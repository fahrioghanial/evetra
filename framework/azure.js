// File for Azure and OCR

// Import azure cognitive service form recognizer
export const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

// set key and endpoint variables with the values from the Azure portal.
export const key = `${process.env.NEXT_PUBLIC_AZURE_KEY}`;
export const endpoint = `${process.env.NEXT_PUBLIC_AZURE_ENDPOINT}`;

// Function for extracting pdf document
export const handleOCR = (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
    setStart("");
    setEnd("");
    setLocation("");
    setIsClicked(true);
    setIsOCRFinished(false);
    const formData = new FormData();
    // Send users PDF File to database
    formData.append('original_document', file);
    // Get users IPv4 address
    axios.get('https://geolocation-db.com/json/').then(function (result) {
        // Send users IPv4 address to database
        formData.append('ip_address', result.data.IPv4);
        const record = client.records.create('documents', formData);
        record.then((result) => {
        const collectionId = result["@collectionId"];
        const recordId = result.id;
        const filename = result.original_document;
        const titleTemp = "";
        const descriptionTemp = "";
        const dateTemp = "";
        const startTimeTemp = "";
        const endTimeTemp = "";

        // document direct download link for cognitive service
        const formUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files/${collectionId}/${recordId}/${filename}`;
        console.log("collection id: ", collectionId);
        console.log("record id: ", recordId);
        console.log("filename: ", filename);

        async function main() {
            const clientAzure = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

            const poller = await clientAzure.beginAnalyzeDocumentFromUrl("prebuilt-document", formUrl);

            const { keyValuePairs } = await poller.pollUntilDone();

            if (!keyValuePairs || keyValuePairs.length <= 0) {
            console.log("No key-value pairs were extracted from the document.");
            } else {
            console.log("Key-Value Pairs:");
            const formatted_data = [];
            keyValuePairs.map((result, index) => {
                formatted_data.push(formatter(result, index));
            });

            formatted_data.map((result) => {
                if (/tema|acara|kegiatan/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                titleTemp = result.value;
                descriptionTemp = result.value;
                }
                if (/hari|tanggal/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                dateTemp = result.value;
                if (dateTemp.includes(",")) {
                    dateTemp = dateTemp.substring(result.value.indexOf(",") + 1);
                } else if (dateTemp.includes("/")) {
                    dateTemp = dateTemp.substring(result.value.indexOf("/") + 1);
                }
                if (dateTemp.indexOf(" ") == 0) {
                    dateTemp = dateTemp.substring(1);
                }
                dateTemp = dateTemp.split(/[" "]/);

                if (dateTemp[0].length == 1) {
                    dateTemp[0] = "0" + dateTemp[0];
                }
                if (/Jan/i.test(dateTemp[1])) {
                    dateTemp[1] = "01";
                }
                else if (/Feb/i.test(dateTemp[1])) {
                    dateTemp[1] = "02"
                }
                else if (/Mar/i.test(dateTemp[1])) {
                    dateTemp[1] = "03"
                }
                else if (/Apr/i.test(dateTemp[1])) {
                    dateTemp[1] = "04"
                }
                else if (/Mei/i.test(dateTemp[1])) {
                    dateTemp[1] = "05"
                }
                else if (/Jun/i.test(dateTemp[1])) {
                    dateTemp[1] = "06"
                }
                else if (/Jul/i.test(dateTemp[1])) {
                    dateTemp[1] = "07"
                }
                else if (/Agu/i.test(dateTemp[1])) {
                    dateTemp[1] = "08"
                }
                else if (/Sep/i.test(dateTemp[1])) {
                    dateTemp[1] = "09"
                }
                else if (/Okt/i.test(dateTemp[1])) {
                    dateTemp[1] = "10"
                }
                else if (/Nov/i.test(dateTemp[1])) {
                    dateTemp[1] = "11"
                }
                else if (/Des/i.test(dateTemp[1])) {
                    dateTemp[1] = "12"
                }

                dateTemp = dateTemp.reverse();

                console.log("dateTemp: ", dateTemp);
                }

                if (/waktu/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                startTimeTemp = result.value.substring(0, 5).split(/[.]/);
                endTimeTemp = result.value.substring(result.value.length - 5);
                if (endTimeTemp.includes(".")) {
                    endTimeTemp = endTimeTemp.split(/[.]/);
                } else {
                    endTimeTemp = startTimeTemp.map(Number);
                    endTimeTemp[0] = endTimeTemp[0] + 1;
                    endTimeTemp = endTimeTemp.map(String);
                    if (endTimeTemp[0].length == 1) {
                    endTimeTemp[0] = "0" + endTimeTemp[0];
                    }
                    if (endTimeTemp[1].length == 1) {
                    endTimeTemp[1] = "0" + endTimeTemp[1];
                    }
                }
                console.log("start: ", startTimeTemp)
                console.log("end: ", endTimeTemp)
                setStart(dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + startTimeTemp[0] + ":" + startTimeTemp[1]);
                setEnd(dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + endTimeTemp[0] + ":" + endTimeTemp[1]);
                }

                if (/tempat/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                setLocation(result.value)
                }
            })

            if (titleTemp == "" || descriptionTemp == "") {
                setTitle(file.name.replace(".pdf", ""))
                setDescription(file.name.replace(".pdf", ""))
            } else {
                setTitle(titleTemp);
                setDescription(descriptionTemp);
            }

            setIsOCRFinished(true);
            }

        }

        main().catch((error) => {
            console.error("An error occurred:", error);
        });
        })
    })
};