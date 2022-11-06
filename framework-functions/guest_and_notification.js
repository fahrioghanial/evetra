// Function for handling add guests
export function addGuests(e, tempEmail, setTempEmailArray, setTempEmail) {
  e.preventDefault();

  if (tempEmail != "" && tempEmail.includes("@")) {
    setTempEmailArray(tempEmailArray => [...tempEmailArray, { 'email': tempEmail }]);
    setTempEmail("");
  }
}

// Function for handling remove guests
export function removeGuests(e, email, setTempEmailArray, tempEmailArray) {
  e.preventDefault();
  setTempEmailArray(tempEmailArray.filter(item => item.email != email));
}

// Function for handling add email notification
export function addNotifEmail(e, setEventAttributes) {
  e.preventDefault();
  setEventAttributes(eventAttributes => ({
    ...eventAttributes,
    isNotifEmailEnabled: true,
  }));
}