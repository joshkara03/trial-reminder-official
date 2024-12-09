chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'setReminder') {
    const { url, email, date } = message;

    // Save the reminder to your database or API
    fetch('https://shzvtjnenlpheqalpbjk.supabase.co/rest/v1/reminders', {
      method: 'POST',
      headers: {
        'apikey': 'YOUR_SUPABASE_API_KEY',
        'Authorization': 'Bearer YOUR_SUPABASE_API_KEY',
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
