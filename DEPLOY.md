# CatchBase — Deployment Guide
# How to get CatchBase.uk live, step by step

---

## STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Click the big green "LTS" button to download it
3. Open the downloaded file and click through the installer (just keep clicking Next)
4. Once done, open **Terminal** (Mac) or **Command Prompt** (Windows)
5. Type this and press Enter to confirm it worked:
   ```
   node --version
   ```
   You should see something like `v20.x.x` — that means it's working!

---

## STEP 2 — Create a GitHub Account & Upload Your Code

1. Go to https://github.com and sign up for a free account
2. Once logged in, click the **+** button (top right) → "New repository"
3. Name it: `catchbase`
4. Make sure it's set to **Public**
5. Click "Create repository"

Now upload your files:
6. Download and install **GitHub Desktop** from https://desktop.github.com
7. Open GitHub Desktop → File → "Clone Repository"
8. Find your `catchbase` repo and clone it to your computer
9. Copy all the files from this zip into that folder
10. In GitHub Desktop you'll see all the files listed — write "First upload" in the Summary box
11. Click **Commit to main**, then click **Push origin**

Your code is now on GitHub! ✅

---

## STEP 3 — Deploy on Vercel (Makes it live!)

1. Go to https://vercel.com and sign up (use "Continue with GitHub")
2. Click **"Add New Project"**
3. Find your `catchbase` repository and click **Import**
4. Leave all settings as default — Vercel detects React automatically
5. Click **Deploy**
6. Wait about 1 minute — you'll get a URL like `catchbase.vercel.app`

Visit that URL and your site is live! 🎉

---

## STEP 4 — Connect CatchBase.uk (GoDaddy)

Get your Vercel IP first:
1. In Vercel, go to your project → Settings → Domains
2. Type in `catchbase.uk` and click Add
3. Vercel will show you an **IP address** (looks like `76.76.21.21`) — copy it

Now go to GoDaddy:
4. Log in to https://godaddy.com
5. Go to "My Products" → find catchbase.uk → click "DNS"
6. Find the **A Record** that points to `@` — click the pencil/edit icon
7. Change the **Value** to the IP address Vercel gave you
8. Save it

Then add a CNAME:
9. Click "Add New Record"
10. Type: CNAME | www | cname.vercel-dns.com | TTL: 1 hour
11. Save

Wait 10–30 minutes for it to go live. Then visit **CatchBase.uk** 🐟

---

## NEED HELP?

If you get stuck at any step, just message Claude and describe what you see on screen — we'll get through it together!
