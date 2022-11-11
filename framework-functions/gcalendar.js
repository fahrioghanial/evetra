
import PocketBase from 'pocketbase';

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Function for handling create event on google calendar
export async function handleCreateEventOnGCal(e, event, setEventAttributes, eventAttributes) {
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
        // eventIDOnGCal: event.id
      }));
      const data = {
        event_id_on_gcal: event.id,
        event_link_on_gcal: event.htmlLink
      };
      client.records.update('event_history', eventAttributes.eventID, data);
      console.log(event)
    });
  } catch (err) {
    console.error(err)
    return;
  }
}