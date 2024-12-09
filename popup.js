document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const emailInput = document.getElementById('email');
  const dateInput = document.getElementById('reminderDate');
  const saveBtn = document.getElementById('saveBtn');

  // Get the current trial URL from storage and populate the URL field
  chrome.storage.local.get(['currentTrialUrl'], (data) => {
    if (data.currentTrialUrl) {
      urlInput.value = data.currentTrialUrl;
    } else {
      urlInput.value = "No URL detected";
    }
  });

  saveBtn.addEventListener('click', () => {
    const url = urlInput.value;
    const email = emailInput.value;
    const reminderDate = dateInput.value;
    
    chrome.runtime.sendMessage({ type: 'setReminder', url, email, date: reminderDate }, (response) => {
      if (response.status === 'ok') {
        alert('Reminder saved!');
      } else {
        alert('Error saving reminder: ' + response.error);
      }
    });
  });
});

  