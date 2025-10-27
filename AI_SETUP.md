# AI Provider Setup Guide

Your Smart Escalate AI chatbot now supports **two AI providers**: Groq and Google Gemini!

## 🔑 Get Your Gemini API Key

### Step 1: Visit Google AI Studio
Go to: https://aistudio.google.com/app/apikey

### Step 2: Create API Key
1. Sign in with your Google account
2. Click **"Get API Key"** or **"Create API Key"**
3. Select or create a project
4. Copy your API key (starts with `AIza...`)

### Step 3: Add to .env File
Open your `.env` file and replace the placeholder:

```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## ⚙️ Configuration Options

### Available AI Providers:

#### 1. **Groq** (Current Default)
- Fast and efficient
- Model: `llama-3.3-70b-versatile`
- Best for: Quick responses

#### 2. **Google Gemini**
- Highly intelligent
- Model: `gemini-1.5-flash`
- Best for: Complex reasoning

---

## 🔄 Switching Between Providers

### Option 1: Use Groq (Current)
```env
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

### Option 2: Use Gemini
```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GEMINI_MODEL=gemini-1.5-flash
```

---

## 🚀 How to Apply Changes

After updating `.env`:

1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart**: `npm run dev`
3. **Hard refresh browser**: Ctrl+Shift+R
4. **Test the chatbot!**

---

## 📊 Available Models

### Groq Models:
- `llama-3.3-70b-versatile` (Default)
- `llama-3.1-8b-instant` (Faster)
- `mixtral-8x7b-32768` (Alternative)

### Gemini Models:
- `gemini-1.5-flash` (Default - Fast & Efficient)
- `gemini-1.5-pro` (More powerful)
- `gemini-2.0-flash-exp` (Experimental)

---

## 🆓 Free Tier Limits

### Groq:
- ✅ Free tier available
- Rate limits apply

### Gemini:
- ✅ Generous free tier
- 15 requests/minute (free)
- 1500 requests/day (free)
- 1 million tokens/month (free)

---

## 🔍 Testing Your Setup

Open browser console (F12) and look for:

✅ **Groq**: `🤖 Using AI provider: groq`
✅ **Gemini**: `🤖 Using AI provider: gemini`

---

## 🎯 Current Configuration

Your current `.env` file:
```env
# Groq API Configuration (Active)
VITE_GROQ_API_KEY=gsk_your_key_here ✅
VITE_GROQ_MODEL=llama-3.3-70b-versatile

# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here ❌ (Add your key!)
VITE_GEMINI_MODEL=gemini-1.5-flash

# AI Provider Selection
VITE_AI_PROVIDER=groq (Change to 'gemini' to use Gemini)
```

---

## 💡 Recommendations

**For Production:**
- Use Gemini for better accuracy
- Use Groq for faster responses

**For Development:**
- Groq: Already working! ✅
- Gemini: Add your API key to enable

---

## 🆘 Troubleshooting

### Chatbot not working?
1. Check console for errors (F12)
2. Verify API key in `.env`
3. Restart dev server
4. Hard refresh browser

### Switched to Gemini but still using Groq?
- You must restart the dev server!
- Changes to `.env` require server restart

---

## 📝 Need Help?

1. Check browser console (F12) for debug messages
2. Look for `🔍 Debug` messages
3. Verify which provider is active: `🤖 Using AI provider`

---

**Ready to try Gemini?**
1. Get API key from https://aistudio.google.com/app/apikey
2. Add to `.env` file
3. Change `VITE_AI_PROVIDER=gemini`
4. Restart server
5. Enjoy! 🎉
