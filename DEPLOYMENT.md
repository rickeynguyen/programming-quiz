# Deployment Guide for Render

This guide will help you deploy the Python Programming Quiz Portal to Render.

## Prerequisites

1. A GitHub account with this repository pushed
2. A Render account (sign up at https://render.com)
3. An OpenAI API key

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure all your changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub account if not already connected
5. Select your repository: `programming-quiz`

### 3. Configure the Web Service

Fill in the following settings:

- **Name**: `programming-quiz` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: `Python 3`
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn app:app`
- **Instance Type**: `Free` (or choose paid for better performance)

### 4. Add Environment Variables

Click **"Advanced"** and add the following environment variable:

- **Key**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (from https://platform.openai.com/api-keys)

Optional environment variables:
- **Key**: `FLASK_ENV`
- **Value**: `production`

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Run the build script
   - Start your application with Gunicorn

3. Wait for the deployment to complete (usually 2-5 minutes)

### 6. Access Your Application

Once deployed, Render will provide you with a URL like:
```
https://programming-quiz-xxxx.onrender.com
```

Your quiz portal is now live! 🎉

## Important Notes

### Free Tier Limitations

If using Render's free tier:
- Service spins down after 15 minutes of inactivity
- First request after spin-down will take 30-60 seconds to respond
- 750 hours/month of runtime (more than enough for personal use)

### Environment Variables

Your `.env` file is NOT deployed to Render (it's in `.gitignore`). Always set environment variables in Render's dashboard.

### Updating Your Deployment

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically.

### Custom Domain (Optional)

To use a custom domain:
1. Go to your service settings in Render
2. Click "Custom Domain"
3. Follow instructions to add your domain

## Monitoring

### View Logs

In your Render dashboard:
1. Select your service
2. Click "Logs" tab
3. View real-time logs

### Check Metrics

Click "Metrics" to see:
- CPU usage
- Memory usage
- Request counts
- Response times

## Troubleshooting

### Build Fails

Check the build logs for errors. Common issues:
- Missing dependencies in `requirements.txt`
- Python version mismatch (check `runtime.txt`)

### App Crashes

Check the runtime logs. Common issues:
- Missing `OPENAI_API_KEY` environment variable
- Port binding issues (should use `PORT` env var)

### Slow Performance

Free tier has limited resources. Consider:
- Upgrading to a paid instance
- Optimizing database queries (if added later)
- Reducing AI token limits

## Costs

### OpenAI API Costs

Using gpt-4o-mini:
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

Estimated cost per quiz session:
- ~400 tokens per question = $0.0006
- ~600 tokens per validation = $0.0009
- ~400 tokens per chat = $0.0006
- **Total per question: ~$0.002 (0.2 cents)**

### Render Costs

- **Free Tier**: $0/month (with limitations)
- **Starter**: $7/month (no spin-down, better performance)
- **Standard**: $25/month (more resources)

## Support

- Render Documentation: https://render.com/docs
- OpenAI API: https://platform.openai.com/docs
- Issues: Create issue in GitHub repository

## Security Recommendations

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Rotate API keys regularly** - Update in Render dashboard
3. **Monitor API usage** - Check OpenAI dashboard for unusual activity
4. **Set API rate limits** - Configure in OpenAI dashboard
5. **Use environment variables** - Never hardcode secrets

---

**Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Environment variables set (OPENAI_API_KEY)
- [ ] Build successful
- [ ] Application accessible via Render URL
- [ ] Quiz questions generating correctly
- [ ] All features working (ELI5, Chat, Topic management)

**Your app is ready for production! 🚀**
