# Smart Escalate AI

An intelligent AI-powered support and escalation system for seamless customer support and ticket management. Built with modern web technologies, this application provides an enterprise-grade support platform with AI-powered chatbot capabilities, intelligent ticket management, and comprehensive analytics.

## 🌟 Features

- **AI-Powered Chatbot**: Intelligent support assistance powered by Groq LLaMA or Google Gemini
- **Smart Ticket Management**: Create, track, and escalate support tickets with AI recommendations
- **Real-time Database**: Supabase-powered backend with real-time synchronization
- **User Authentication**: Secure authentication and user management with Supabase Auth
- **Analytics Dashboard**: Real-time insights into support metrics and performance
- **Knowledge Base**: Comprehensive documentation and FAQs
- **Contact Form**: EmailJS-powered contact system with instant notifications
- **Dark/Light Mode**: Beautiful theme switching with persistent preferences
- **Responsive Design**: Mobile-first, fully responsive interface
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ & npm installed
- Supabase account (free tier available)
- A Groq API key OR Google Gemini API key (free tier available)
- EmailJS account (optional, for contact form)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd smart-escalate-ai

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Edit .env and add your API keys (see Configuration section)

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Configuration

### Environment Variables

1. Copy `.env.example` to `.env`
2. Configure your preferred AI provider and credentials

### AI Provider Setup

**Option A: Groq** (Recommended for speed)
- Sign up at [console.groq.com](https://console.groq.com)
- Generate an API key
- Set `VITE_AI_PROVIDER=groq` in your `.env` file
- Add your API key to `VITE_GROQ_API_KEY`

**Option B: Google Gemini** (Recommended for intelligence)
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create an API key
- Set `VITE_AI_PROVIDER=gemini` in your `.env` file
- Add your API key to `VITE_GEMINI_API_KEY`

### Database & Authentication Setup

**Supabase** (Required for data persistence)
- Sign up at [Supabase](https://supabase.com)
- Create a new project
- Copy your project URL and anon key from Settings > API
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`

### Email Service (Optional)

To enable the contact form:
- Sign up at [EmailJS](https://www.emailjs.com) (free tier: 200 emails/month)
- Create an email service and template
- Add your EmailJS credentials to `.env`

Detailed setup instructions available in `EMAILJS_SETUP.md`

## 🏗️ Technologies Used

### Core Framework
- **Vite** - Lightning-fast build tool
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon set

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - Authentication and user management
- **Real-time subscriptions** - Live data updates

### AI & APIs
- **Groq SDK** - Fast LLM inference
- **Google Generative AI** - Gemini AI integration
- **EmailJS** - Email delivery service

### State Management & Routing
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form state management

### Additional Libraries
- **date-fns** - Modern date utility library
- **class-variance-authority** - Component variant management
- **embla-carousel** - Touch-friendly carousel

## 📁 Project Structure

```
smart-escalate-ai/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── AppLayout.tsx
│   │   ├── TopNav.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ...
│   ├── pages/          # Application pages/routes
│   │   ├── Index.tsx   # Home/Dashboard
│   │   ├── Login.tsx
│   │   ├── AIServices.tsx
│   │   ├── Analytics.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useChatBot.ts
│   │   └── use-toast.ts
│   ├── lib/            # Utility functions
│   │   └── utils.ts
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Application entry point
├── .env                # Environment variables (create this)
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎯 Available Scripts

```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🔐 Authentication

The application includes a secure authentication system:

- Login page with form validation
- Protected routes requiring authentication
- User profile management
- Persistent session using localStorage
- Logout functionality

**Demo Credentials:** Any email/password combination works for testing purposes.

## 🎨 Features Overview

### AI Chatbot
- Intelligent responses powered by Groq or Gemini
- Context-aware conversations
- Support ticket recommendations
- Real-time typing indicators

### Ticket Management
- Create and track support tickets
- AI-powered priority classification
- Status tracking (Open, In Progress, Resolved)
- Quick action shortcuts

### Analytics Dashboard
- Ticket metrics and trends
- Response time tracking
- AI performance insights
- Visual charts and graphs

### Knowledge Base
- Searchable documentation
- FAQ sections
- Video tutorials
- Step-by-step guides

### User Profile
- Profile customization
- Notification preferences
- Theme selection
- Account settings

## 🎨 Theming

The application supports both light and dark modes:
- Toggle via sun/moon icon in top navigation
- Preference saved to localStorage
- Smooth transitions between themes
- All components fully themed

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile-first approach
- Adaptive navigation
- Touch-friendly interactions
- Optimized for all screen sizes

## 🛠️ Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/AppSidebar.tsx`

### Adding New Components

1. Create component in `src/components/`
2. Import and use in pages
3. Follow existing patterns for consistency

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application. See `.env.example` for the complete list of required and optional environment variables.

## 🚀 Deployment

### Build for Production

```sh
npm run build
```

The `dist/` folder will contain optimized production files.

### Deployment Platforms

This app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

**Important:** Remember to set environment variables in your hosting platform's settings.

## 🔍 Troubleshooting

### Chatbot not responding?
- Verify API key is set in `.env`
- Check you've selected the correct AI provider
- Restart dev server after changing `.env`
- Check browser console for errors

### Contact form not working?
- Verify EmailJS credentials in `.env`
- Check EmailJS dashboard for quota limits
- Ensure email template is configured correctly

### Build errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (16+ required)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, and modern web technologies

