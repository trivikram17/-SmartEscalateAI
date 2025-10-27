# Smart Escalate AI - Setup Guide

## 🎉 Recent Improvements

Your website has been significantly enhanced with the following features:

### ✅ Completed Features

1. **Custom Logo & Branding**
   - Created custom branding for Smart Escalate AI
   - Created a custom SVG logo with AI and escalation theme
   - Updated branding to "Smart Escalate AI"

2. **Top Navigation Header**
   - Converted left sidebar to a modern top navigation bar
   - Added responsive mobile menu with drawer
   - Integrated logo in header
   - Clean and professional layout

3. **Dark/Light Mode Toggle**
   - Theme switcher button in header
   - Persistent theme preference (localStorage)
   - Smooth theme transitions
   - System theme detection

4. **Login/Authentication System**
   - Beautiful login page with tabs (Login/Sign Up)
   - Protected routes for authenticated users
   - User profile dropdown menu
   - Logout functionality
   - Mock authentication (ready for backend integration)

5. **Groq API Integration**
   - Environment variables setup for secure API key storage
   - Groq SDK installed and configured
   - Intelligent chatbot powered by Groq's LLM
   - Fallback responses when API key not configured

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager

### Installation

1. **Clone and install dependencies**
   ```bash
   cd smart-escalate-ai
   npm install
   ```

2. **Configure Environment Variables**
   
   The `.env` file has been created for you. Add your Groq API key:
   
   ```bash
   # Open .env file and add your API key
   VITE_GROQ_API_KEY=your_actual_groq_api_key_here
   VITE_GROQ_MODEL=llama-3.1-70b-versatile
   ```

   **How to get a Groq API key:**
   - Visit https://console.groq.com
   - Sign up for a free account
   - Navigate to API Keys section
   - Create a new API key
   - Copy and paste it into your `.env` file

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and go to `http://localhost:5173` (or the port shown in terminal)
   - You'll see the login page first
   - Use any email/password to login (mock authentication)

## 🔐 Security Features

### Environment Variables Protection
- `.env` file is in `.gitignore` (never commits sensitive data)
- `.env.example` provided as template
- API keys loaded via Vite's `import.meta.env`

### Important Security Notes
⚠️ **NEVER** commit your `.env` file to version control
⚠️ **NEVER** share your API keys publicly
⚠️ For production, use proper backend API and authentication

## 📁 Project Structure

```
smart-escalate-ai/
├── .env                    # Your API keys (DO NOT COMMIT!)
├── .env.example           # Template for environment variables
├── src/
│   ├── components/
│   │   ├── Logo.tsx       # Custom SVG logo component
│   │   ├── TopNav.tsx     # Top navigation header
│   │   ├── AppLayout.tsx  # Main layout with theme
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── pages/
│   │   ├── Login.tsx      # Login/Signup page
│   │   ├── Index.tsx      # Home page
│   │   └── ...
│   ├── hooks/
│   │   └── useChatBot.ts  # Groq-powered chatbot logic
│   └── App.tsx            # Routes and authentication
```

## 🎨 Features Overview

### Navigation
- **Desktop**: Horizontal navigation bar at top
- **Mobile**: Hamburger menu with slide-out drawer
- **User Menu**: Profile dropdown with logout option

### Theme System
- Toggle between light and dark mode
- Persistent preference
- Smooth transitions
- System theme detection on first visit

### Authentication
- Login and Sign Up tabs
- Form validation
- Protected routes
- User session management
- Profile display in header

### Chatbot (Groq Integration)
- Intelligent responses using Groq's LLM
- Context-aware conversations
- Sentiment analysis
- Automatic ticket escalation
- Fallback responses without API key

## 🛠️ Customization

### Update Logo
Edit `src/components/Logo.tsx` to customize the logo design

### Modify Navigation
Edit `src/components/TopNav.tsx` to add/remove navigation items

### Configure Groq Model
Change the model in `.env`:
```bash
VITE_GROQ_MODEL=llama-3.1-8b-instant  # Faster, lower cost
# or
VITE_GROQ_MODEL=mixtral-8x7b-32768    # More capable
```

### Theme Colors
Edit `tailwind.config.ts` to customize colors

## 📝 Next Steps

### For Production Deployment:
1. Set up proper backend authentication
2. Move API calls to backend (don't expose API keys in frontend)
3. Add database for user management
4. Implement real ticket system
5. Add email notifications
6. Set up monitoring and logging

### Recommended Integrations:
- **Authentication**: Firebase Auth, Auth0, or Supabase
- **Database**: PostgreSQL, MongoDB, or Supabase
- **Backend**: Node.js/Express, or Next.js API routes
- **Hosting**: Vercel, Netlify, or AWS

## 🐛 Troubleshooting

### Chatbot not responding intelligently?
- Check that your Groq API key is set in `.env`
- Verify the API key is valid at https://console.groq.com
- Check browser console for errors

### Theme not persisting?
- Clear browser localStorage and try again
- Check browser console for errors

### Login not working?
- This is mock authentication for development
- Check browser console for any errors

## 📚 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Groq SDK** - AI chatbot
- **React Router** - Navigation
- **Lucide React** - Icons

## 🤝 Support

For issues or questions:
1. Check the `.env.example` file
2. Review browser console for errors
3. Verify all dependencies are installed
4. Ensure Node.js version is 16+

## 📄 License

This project is ready for your use and customization!

---

**Happy coding! 🚀**
