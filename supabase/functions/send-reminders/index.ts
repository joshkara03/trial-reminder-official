import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Hard-coded values from your provided snippet
const SUPABASE_URL = 'https://shzvtjnenlpheqalpbjk.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoenZ0am5lbmxwaGVxYWxwYmprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzcxNTk4MCwiZXhwIjoyMDQ5MjkxOTgwfQ.ZqFXkocSoj72MVEabQHTsjORlNZwO123it8qZZadMPI'
const RESEND_API_KEY = 're_YD2JmNj1_AkjL2D9pwZ2jYnUK6FHDjkqE'

// Create a Supabase client using the provided URL and service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (_req) => {
  const today = new Date().toISOString().split('T')[0]

  // Fetch reminders due today that haven't been sent yet
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('reminder_date', today)
    .eq('reminder_sent', false)

  if (error) {
    console.error('Error fetching reminders:', error)
    return new Response('Error fetching reminders', { status: 500 })
  }

  for (const reminder of reminders) {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Make sure this email is verified in your Re:Send dashboard
        to: reminder.email,
        subject: '🚨 Last Call: Trial Ending Soon! 🚨',
        text: `Hey you!

Your trial for ${reminder.url} is like a carton of milk—it’s expiring today. 🥛 If you don’t want to be charged and end up explaining random charges to your bank, now’s your moment to cancel.

If you’re enjoying this reminder and want to support our noble cause (a.k.a. keeping me caffeinated), you can totally buy me a coffee. ☕ Like, literally:
buymeacoffee.com/joshkarathra

Either way, you’re awesome. Just don’t forget about that trial, okay?

Best,
Your Friendly Neighborhood Trial Reminder 🕶️`
      })
    })

    if (!emailResponse.ok) {
      console.error(`Failed to send email to ${reminder.email}:`, await emailResponse.text())
      continue
    }

    // Mark the reminder as sent in the database
    const { error: updateError } = await supabase
      .from('reminders')
      .update({ reminder_sent: true })
      .eq('id', reminder.id)

    if (updateError) {
      console.error('Error updating reminder:', updateError)
    }
  }

  return new Response('Reminders processed', { status: 200 })
})
