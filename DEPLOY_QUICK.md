# Quick Deploy to Render - Checklist

## 🚀 Fast Track Deployment (5 minutes)

### 1. Go to Render
Visit: https://dashboard.render.com/select-repo

### 2. Connect Repository
- Click "Connect account" if needed
- Select: `rickeynguyen/programming-quiz`
- Click "Connect"

### 3. Configure Service
```
Name:           programming-quiz
Region:         (your choice)
Branch:         main
Build Command:  ./build.sh
Start Command:  gunicorn app:app
```

### 4. Add Environment Variable
Click "Advanced" → "Add Environment Variable"
```
Key:   OPENAI_API_KEY
Value: sk-...your-key...
```

### 5. Deploy
- Click "Create Web Service"
- Wait 2-5 minutes
- Done! ✅

## 📋 Post-Deployment

Your app URL: `https://programming-quiz-xxxx.onrender.com`

### Test Your Deployment
1. Visit the URL
2. Select a topic
3. Generate a question
4. Submit an answer
5. Try "Explain Like I'm 5"
6. Test "Chat about this question"

### Monitor
- Logs: Dashboard → Your Service → "Logs"
- Errors: Check logs for any issues
- Usage: OpenAI dashboard for API costs

## ⚡ Quick Commands

### Update Deployment
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Render auto-deploys on push!

### Check Local First
```bash
./run.sh
# Visit http://127.0.0.1:5000
```

## 💰 Cost Estimate

**OpenAI API** (gpt-4o-mini):
- ~$0.002 per question (0.2 cents)
- $10 credit ≈ 5,000 questions

**Render**:
- Free tier: $0/month (with spin-down)
- Paid: $7/month (no spin-down)

## 🆘 Troubleshooting

**Build fails?**
- Check Python version in `runtime.txt`
- Verify all files in `requirements.txt`

**App won't start?**
- Ensure `OPENAI_API_KEY` is set
- Check logs for errors

**Slow first load?**
- Normal for free tier (30-60 sec after sleep)
- Upgrade to paid tier for instant response

## 📞 Support

- Render: https://render.com/docs
- OpenAI: https://platform.openai.com/docs
- This Repo: https://github.com/rickeynguyen/programming-quiz

---

**That's it! Your quiz is now live on the internet! 🎉**
