chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle the "setUrl" message
  if (message.type === 'setUrl') {
    chrome.storage.local.set({ currentTrialUrl: message.url });
    return; // Exit the listener for this message
  }

  // Handle the "setReminder" message
  if (message.type === 'setReminder') {
    // Extract details from the message
    const { url, email, date } = message;

    // Call Supabase REST API to save the reminder
    fetch('https://shzvtjnenlpheqalpbjk.supabase.co/rest/v1/reminders', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoenZ0am5lbmxwaGVxYWxwYmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MTU5ODAsImV4cCI6MjA0OTI5MTk4MH0.013tlIzw3zkmyWBwLTparF9QFOZ2HVdrC54sGUyOzmk',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoenZ0am5lbmxwaGVxYWxwYmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MTU5ODAsImV4cCI6MjA0OTI5MTk4MH0.013tlIzw3zkmyWBwLTparF9QFOZ2HVdrC54sGUyOzmk',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        email: email,
        reminder_date: date,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error inserting reminder:', errorText);
          sendResponse({ status: 'error', error: errorText });
        } else {
          sendResponse({ status: 'ok' });
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        sendResponse({ status: 'error', error: err });
      });

    return true; // Keep the sendResponse channel open
  }
});
