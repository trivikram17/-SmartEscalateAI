# 🚀 Supabase Database Setup Instructions

## ✅ What's Been Done
- ✅ Added Supabase credentials to `.env`
- ✅ Created Supabase client configuration (`src/lib/supabase.ts`)
- ✅ Updated `useChatBot.ts` to save tickets to Supabase
- ✅ Updated `useTicketManager.ts` to use Supabase
- ✅ Updated Analytics page to fetch from Supabase
- ✅ Added real-time subscriptions for live updates

## 📋 What You Need To Do

### Step 1: Run the SQL Setup Script

1. Open your Supabase project dashboard:
   - Go to: https://supabase.com/dashboard/project/kjryedtwzqpsnfrtghtk

2. Navigate to the SQL Editor:
   - Click **"SQL Editor"** in the left sidebar
   - Or go directly to: https://supabase.com/dashboard/project/kjryedtwzqpsnfrtghtk/sql

3. Create a new query:
   - Click **"New Query"** button

4. Copy the entire contents of `supabase-setup.sql` file

5. Paste it into the SQL Editor

6. Click **"Run"** or press `Ctrl+Enter`

7. You should see: ✅ **"Success. No rows returned"**

### Step 2: Verify the Setup

1. In Supabase dashboard, click **"Table Editor"** in the left sidebar

2. You should now see a **"tickets"** table with these columns:
   - `id` (int8, primary key)
   - `ticket_number` (text, unique)
   - `status` (text)
   - `category` (text)
   - `priority` (text)
   - `description` (text)
   - `subject` (text, nullable)
   - `user_email` (text)
   - `user_name` (text)
   - `company_email` (text, nullable)
   - `email_sent` (bool)
   - `email_sent_at` (timestamptz, nullable)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

### Step 3: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser

3. **Test Ticket Creation:**
   - Go to the chatbot
   - Ask to create a ticket (e.g., "I need help with login")
   - The chatbot will generate a ticket
   - Check the Analytics page - the ticket should appear there

4. **Test Global Visibility:**
   - Open the app in a different browser or incognito window
   - You should see the SAME tickets
   - Any changes made in one window should appear in the other **in real-time**

### Step 4: Optional - Initialize Sample Tickets

If you want to test with sample data:

1. Go to the Analytics page
2. Click the **"Initialize Sample Tickets"** button
3. This will create 5 sample tickets in your Supabase database

## 🔄 How It Works Now

### Real-Time Updates
- All changes to tickets are synced **instantly** across all users
- Create, update, or delete a ticket - everyone sees it immediately
- Uses Supabase Realtime subscriptions

### Global Ticket Storage
- All tickets are stored in **Supabase PostgreSQL database**
- No more localStorage - tickets are truly global
- All users see the same tickets regardless of browser/device

### Fallback Mechanism
- If Supabase is unavailable, the app falls back to localStorage
- You'll see a toast notification if cloud storage fails
- Ensures the app keeps working even if database is down

## 🎯 Expected Behavior

### Before Setup (Current State)
- App will show errors in console
- Tickets won't save properly
- Analytics page might be empty

### After Setup (Once SQL is run)
- ✅ Tickets save to global database
- ✅ All users see the same tickets
- ✅ Real-time updates work
- ✅ Analytics dashboard shows live data
- ✅ Total Tickets, Resolved, Pending counts are accurate

## 🐛 Troubleshooting

### "relation 'tickets' does not exist"
- You haven't run the SQL script yet
- Go back to Step 1 and run `supabase-setup.sql`

### "permission denied for table tickets"
- RLS (Row Level Security) might be blocking access
- Check the SQL script includes: `ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;`
- Make sure the policies are created

### Tickets not appearing in real-time
- Check browser console for errors
- Verify Supabase URL and anon key in `.env`
- Make sure the Realtime feature is enabled in Supabase dashboard

### Can't see tickets from chatbot in Analytics
- This should work automatically now
- All tickets (chatbot + manual) go to the same Supabase table
- Refresh the page if needed

## 📊 Database Schema

The `tickets` table structure:
```sql
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    subject TEXT,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    company_email TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎉 Once Setup is Complete

Your ticket system will be **fully global** with:
- ✅ Real-time synchronization
- ✅ Cloud-based storage
- ✅ Multi-user support
- ✅ Persistent data across sessions
- ✅ Automatic updates in Analytics dashboard

All you need to do is **run the SQL script once** and you're done! 🚀
