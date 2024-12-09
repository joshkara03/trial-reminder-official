document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const emailInput = document.getElementById('email');
  const dateInput = document.getElementById('reminderDate');
  const saveBtn = document.getElementById('saveBtn');

  saveBtn.addEventListener('click', () => {
    const url = urlInput.value;
    const email = emailInput.value;
    const reminderDate = dateInput.value;

    // Validate inputs
    if (!url || !email || !reminderDate) {
      alert('Please fill out all fields.');
      return;
    }

    chrome.runtime.sendMessage(
      { type: 'setReminder', url, email, date: reminderDate },
      (response) => {
        if (response.status === 'ok') {
          alert('Reminder saved!');
        } else {
          alert('Error saving reminder: ' + response.error);
        }
      }
    );
  });
});