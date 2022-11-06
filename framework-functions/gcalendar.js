// Function for handling create event on google calendar
export async function handleCreateEventOnGCal(e, event, setEventAttributes) {
  e.preventDefault();
  try {
    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      // 'sendUpdates': 'all',
      'resource': event,
    });

    request.execute(function (event) {
      setEventAttributes(eventAttributes => ({
        ...eventAttributes,
        eventHTMLLink: event.htmlLink,
      }));
      console.log(event)
    });
  } catch (err) {
    console.error(err)
    return;
  }
}