# Smart Escalate AI

An AI-assisted customer support and ticket escalation app built with Vite, React, TypeScript, Tailwind, and shadcn/ui. It features live streaming chat (Groq/Gemini), nuanced priority/escalation logic, and a confirmation-gated ticket workflow with optional email notifications via a small Node/Express API.

## Features

- Streaming AI chat (Groq and Gemini)
- Friendly, concise, non-repetitive responses
- Progress-aware escalation (ask for a ticket only after many failed attempts)
- Ticket confirmation step with conversation summary
- Email workflow (Express + Nodemailer) to route tickets to vendor/company addresses
- Clean UI with shadcn/ui and Tailwind

## Requirements

- Node.js 18+
- npm

## Setup

1) Install dependencies

```powershell
npm install
```

2) Configure environment variables in .env

```env
# AI providers (optional, enable what you use)
VITE_GROQ_API_KEY=your_groq_key
VITE_GEMINI_API_KEY=your_gemini_key

# Email server (required for email sending)
EMAIL_API_PORT=3001
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_user
SMTP_PASS=your_password
EMAIL_FROM="Smart Escalate AI <no-reply@yourdomain.com>"
EMAIL_FALLBACK_TO=support@yourdomain.com
```

3) Run the dev servers

During development, the Vite dev server proxies /api to the email server.

```powershell
# Start both servers
npm run dev:full

# Or run separately
npm run server; npm run dev
```

Vite runs at http://localhost:8080. Email API runs at http://localhost:3001.

## Email Workflow

When a ticket is confirmed, the app compiles a summary (last ~20 messages) and POSTs it to /api/sendTicketEmail. The Express server sends it via Nodemailer using your SMTP settings. If vendor routing can’t be determined, EMAIL_FALLBACK_TO is used.

## Scripts

- dev: Start Vite only
- server: Start the email API server
- dev:full: Run both concurrently
- build: Build the app
- preview: Preview a production build

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Groq SDK, Google Generative AI (optional)
- Express + Nodemailer for email

## Notes

- Set real SMTP credentials to test email sending.
- The app asks users before generating a ticket, and only suggests it after repeated failed attempts to resolve the issue.

## License

MIT
