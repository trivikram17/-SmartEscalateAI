# 🚀 Quick Start: EmailJS Setup for User Email Feature

## What You Need to Know

Your Smart Escalate AI now sends ticket emails **FROM the user's email address** (obtained during login). When a user logs in and generates a ticket, the email to the company (Airtel, Jio, Amazon, etc.) appears to come from the user, and companies will reply directly to the user's inbox.

**Key Feature**: User email is automatically captured during login - no need to ask for it during chat!

---

## 📝 EmailJS Template Configuration

### Template Variables (Copy-Paste This List):

```
to_email
from_name
from_email
reply_to
ticket_number
subject
priority
category
company
chat_summary
created_at
```

### Template Settings in EmailJS Dashboard:

When creating your template in EmailJS:

1. **To Email**: `{{to_email}}`  
   *(This will be the company's customer care email)*

2. **From Name**: `{{from_name}}`  
   *(User's name)*

3. **Reply-To**: `{{reply_to}}`  
   *(User's email - companies reply here!)*

---

## 🔑 Environment Variables

Add these to your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🧪 Quick Test

1. **Login**: Go to `/login` and sign up with your email
2. Run: `npm run dev`
3. Chat: "My Airtel internet is not working"
4. AI asks: "Which company?" → Answer: "Airtel"
5. AI generates ticket → Email sent to care@airtel.in (using YOUR login email!)
6. Airtel's reply will go to your login email ✅

**No need to provide email during chat - it's already from your login!**

---

## 📚 Full Documentation

- **Complete Setup Guide**: `EMAILJS_SETUP.md`
- **Template Configuration**: `TICKET_EMAIL_SETUP.md`
- **Implementation Details**: `USER_EMAIL_IMPLEMENTATION.md`
- **System Overview**: `INTELLIGENT_ESCALATION_GUIDE.md`

---

## ⚡ Key Points

✅ User logs in with email (required for authentication)  
✅ Email automatically stored in localStorage  
✅ Email used for ticket generation (no need to ask again!)  
✅ Ticket email sent FROM user's email  
✅ Companies reply directly to user's inbox  
✅ 13+ companies supported with auto-routing  
✅ Guest mode available with default email  

**Status**: Ready to use - just add EmailJS credentials!
