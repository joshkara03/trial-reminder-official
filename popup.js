document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const dateInput = document.getElementById('reminderDate');
    const saveBtn = document.getElementById('saveBtn');
  
    chrome.storage.local.get(['currentTrialUrl'], (data) => {
      // just have data if needed, the user sets email and date manually
    });
  
    saveBtn.addEventListener('click', () => {
      chrome.storage.local.get(['currentTrialUrl'], (data) => {
        const url = data.currentTrialUrl;
        const email = emailInput.value;
        const reminderDate = dateInput.value;
        
        chrome.runtime.sendMessage({type: 'setReminder', url, email, date: reminderDate}, (response) => {
          if (response.status === 'ok') {
            alert('Reminder saved!');
          } else {
            alert('Error saving reminder.');
          }
        });
      });
    });
  });
  