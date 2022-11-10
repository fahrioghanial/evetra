import Router from "next/router";
import PocketBase from 'pocketbase';

const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Function for handle if user already finish filling the form
export const handleFinish = (e, eventAttributes, setEventAttributes, setIsFinished, tempEmailArray) => {
  e.preventDefault();
  let emailArray = {}
  let notifArray = {}
  if (eventAttributes.title && eventAttributes.start && eventAttributes.end) {
    setIsFinished(true);
    if (eventAttributes.isNotifEmailEnabled) {
      emailArray = tempEmailArray
      notifArray = [
        { 'method': 'email', 'minutes': eventAttributes.notifEmail },
        { 'method': 'popup', 'minutes': eventAttributes.notif }
      ]
      setEventAttributes(eventAttributes => ({
        ...eventAttributes,
        emailArray: tempEmailArray,
        notifArray: [
          { 'method': 'email', 'minutes': eventAttributes.notifEmail },
          { 'method': 'popup', 'minutes': eventAttributes.notif }
        ]
      }));
    } else {
      emailArray = tempEmailArray
      notifArray = [
        { 'method': 'popup', 'minutes': eventAttributes.notif }
      ]
      setEventAttributes(eventAttributes => ({
        ...eventAttributes,
        emailArray: tempEmailArray,
        notifArray: [
          { 'method': 'popup', 'minutes': eventAttributes.notif }
        ]
      }));
    }

    const data = {
      title: eventAttributes.title,
      description: eventAttributes.description,
      location: eventAttributes.location,
      start: eventAttributes.start,
      end: eventAttributes.end,
      user: localStorage.getItem("email"),
      reminder_minutes: JSON.stringify(notifArray),
      attendees: JSON.stringify(emailArray)
    };

    const record = client.records.create('event_history', data);

    record.then((result) => {
      console.log(result)
    })
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