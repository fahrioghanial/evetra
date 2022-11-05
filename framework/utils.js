// For utility functions

// Function for formatting the extracted result that return from azure form recognizer
const formatter = (result, index) => {
    return {
      id: index,
      key: result.key.content,
      value: (result.value && result.value.content) || "<undefined>",
      confidence: result.confidence,
    };
};

// Function for download file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 0);
    }   
}