---
description: Deploy the Pocket Reader PWA to GitHub Pages
---

# Host Your PWA for Free on GitHub Pages

Follow these steps to put your "Pocket Reader" online so you can share the link or install it on your phone.

## Phase 1: Prepare Your Local Folder (I can help with this!)
1. Open your terminal in the project folder.
2. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Pocket Reader"
   ```
   *(I can run these 3 commands for you if you approve)*

## Phase 2: Create Repository on GitHub.com
1. Log in to your [GitHub account](https://github.com/).
2. Click the **+** icon in the top right and select **New repository**.
3. Name it `pocket-reader` (or whatever you like).
4. Make sure **Public** is selected (required for free hosting).
5. **Do NOT** check "Initialize with README", "Add .gitignore", or "Add license". Keep it empty.
6. Click **Create repository**.

## Phase 3: Connect and Push
1. Copy the commands GitHub shows you under the section **"…or push an existing repository from the command line"**. They will look like this:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pocket-reader.git
   git branch -M main
   git push -u origin main
   ```
2. Paste and run those commands in your terminal.

## Phase 4: Turn on the Website
1. Go back to your GitHub repository page.
2. Click on **Settings** (top tab).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and `/ (root)`. Click **Save**.
6. Wait 1-2 minutes. Refresh the page. You will see your polished URL (e.g., `https://your-username.github.io/pocket-reader/`).

**Done!** Open that link on your phone and tap "Share" > "Add to Home Screen" to install it as an app.
