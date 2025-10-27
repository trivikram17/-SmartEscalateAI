# EmailJS Setup Guide for Contact Form

## 🚀 Quick Setup (5 minutes)

Follow these steps to enable the contact form on your website:

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (it's **FREE** - 200 emails/month)
3. Verify your email

### Step 2: Add Email Service

1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook** 
   - **Yahoo**
   - Or any other provider
4. Click **"Connect Account"** and follow the OAuth flow
5. **Copy your Service ID** (looks like: `service_abc123`)

### Step 3: Create Email Template

1. Click **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template content:

**Subject:**
```
New Contact Form Submission: {{subject}}
```

**Body:**
```
You have a new message from Smart Escalate AI contact form:

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the Smart Escalate AI contact form.
```

4. Click **"Save"**
5. **Copy your Template ID** (looks like: `template_xyz789`)

### Step 4: Get Your Public Key

1. Go to **"Account"** tab
2. Find **"Public Key"** section
3. **Copy your Public Key** (looks like: `AbC123dEf456GhI`)

### Step 5: Update .env File

Open your `.env` file and replace the placeholder values:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123      # Your Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xyz789    # Your Template ID
VITE_EMAILJS_PUBLIC_KEY=AbC123dEf456GhI     # Your Public Key
```

### Step 6: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Test Your Contact Form

1. Go to `http://localhost:8080/contact`
2. Fill out the form
3. Click "Send Message"
4. Check your email inbox!

## 🎯 What Happens Now?

When someone fills out your contact form:
1. EmailJS receives the form data
2. Uses your template to format the email
3. Sends it to the email address connected to your service
4. User sees a success message
5. You get the email instantly!

## 🔒 Security Notes

✅ **Safe:** Public key is designed to be used in frontend code  
✅ **No exposure:** Your actual email credentials stay on EmailJS servers  
✅ **Rate limited:** EmailJS prevents spam automatically  
✅ **Free tier:** 200 emails/month is plenty for most websites  

## 🆘 Troubleshooting

### "Configuration missing" error
- Make sure all three values are in your `.env` file
- Restart your dev server after adding them

### Emails not arriving
- Check your spam folder
- Verify your email service is connected in EmailJS dashboard
- Make sure the Service ID and Template ID are correct

### "Failed to send" error
- Check browser console for detailed error
- Verify your Public Key is correct
- Make sure you're not over the free tier limit (200/month)

## 📧 Need Help?

- EmailJS Docs: https://www.emailjs.com/docs/
- Your Smart Escalate AI support: support@smartescalate.ai

---

**That's it! Your contact form is now fully functional! 🎉**
