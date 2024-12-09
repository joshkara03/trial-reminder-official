// Simple keyword detection
const keywords = ["Free trial", "7-day trial", "Cancel anytime"];
const pageText = document.body.innerText;

if (keywords.some(kw => pageText.includes(kw))) {
  // Create a small button or panel on the page to open the popup
  const reminderBtn = document.createElement('button');
  reminderBtn.textContent = "Set Trial Reminder";
  reminderBtn.style.position = 'fixed';
  reminderBtn.style.bottom = '20px';
  reminderBtn.style.right = '20px';
  reminderBtn.style.zIndex = '999999';
  
  reminderBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({type: 'openPopup', url: window.location.href});
  });
  
  document.body.appendChild(reminderBtn);
}