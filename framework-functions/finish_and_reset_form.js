import Router from "next/router";

// Function for handle if user already finish filling the form
export const handleFinish = (e, eventAttributes, setEventAttributes, setIsFinished, tempEmailArray) => {
  e.preventDefault();
  if (eventAttributes.title && eventAttributes.start && eventAttributes.end) {
    setIsFinished(true);
    if (eventAttributes.isNotifEmailEnabled) {
      setEventAttributes(eventAttributes => ({
        ...eventAttributes,
        emailArray: tempEmailArray,
        notifArray: [
          { 'method': 'email', 'minutes': eventAttributes.notifEmail },
          { 'method': 'popup', 'minutes': eventAttributes.notif }
        ]
      }));
    } else {
      setEventAttributes(eventAttributes => ({
        ...eventAttributes,
        emailArray: tempEmailArray,
        notifArray: [
          { 'method': 'popup', 'minutes': eventAttributes.notif }
        ]
      }));
    }
  } else {
    alert("Judul, Waktu Mulai, dan Waktu Selesai wajib diisi")
  }
}

// Function for reset the form
export const resetEvent = (setEventAttributes, setIsFinished, setTempEmailArray, setOCRAttributes) => {
  if (Router.pathname == "/dashboard") {
    setEventAttributes(eventAttributes => ({
      ...eventAttributes,
      title: "",
      description: "",
      location: "",
      start: "",
      end: "",
      eventHTMLLink: "",
      notif: 30,
      notifEmail: 30,
      isNotifEmailEnabled: false,
      emailArray: [],
      notifArray: [],
    }));
    setTempEmailArray([]);
  } else {
    setEventAttributes(eventAttributes => ({
      ...eventAttributes,
      title: "",
      description: "",
      location: "",
      start: "",
      end: "",
    }));
  }
  setOCRAttributes(OCRAttributes => ({
    ...OCRAttributes,
    file: null,
  }));
  setIsFinished(false);
}