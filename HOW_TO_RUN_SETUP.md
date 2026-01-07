# How to Run the GitHub Setup Script

## ⚠️ Important: Run in Interactive PowerShell

The script needs to run in an **interactive PowerShell window** (not through automated tools).

---

## 🚀 Step-by-Step Instructions

### Step 1: Create GitHub Repository First

1. Go to: **https://github.com/new**
2. Repository name: `sunshine-realtors-website`
3. Choose **Private** (recommended) or **Public**
4. **⚠️ DO NOT check:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. Click **"Create repository"**

### Step 2: Copy Your Repository URL

After creating, you'll see a URL like:
```
https://github.com/YOUR_USERNAME/sunshine-realtors-website.git
```

**Copy this URL!**

### Step 3: Open PowerShell in Your Project Folder

**Option A: From File Explorer**
1. Navigate to: `D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website`
2. Right-click in the folder
3. Select **"Open in Terminal"** or **"Open PowerShell window here"**

**Option B: From PowerShell**
```powershell
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
```

### Step 4: Run the Setup Script

```powershell
.\setup-github.ps1
```

The script will:
1. Ask for your GitHub repository URL (paste the URL you copied)
2. Check if a remote already exists
3. Add the GitHub remote
4. Ask if you want to push now
5. Push your code (if you choose yes)

---

## 🔐 Authentication

When pushing, GitHub will ask for:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (NOT your password)
  - Create token: https://github.com/settings/tokens
  - Select `repo` scope
  - Copy the token and use it as your password

---

## ✅ Alternative: Manual Setup (If Script Doesn't Work)

If you prefer to do it manually, run these commands:

```powershell
# Navigate to project
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/sunshine-realtors-website.git

# Verify
git remote -v

# Push code
git push -u origin master
```

---

## 🆘 Troubleshooting

### "Read-Host not available"
- **Solution:** Run the script in an interactive PowerShell window (not automated)

### "Remote already exists"
- **Solution:** The script will ask if you want to replace it, or run:
  ```powershell
  git remote remove origin
  git remote add origin YOUR_URL
  ```

### "Authentication failed"
- **Solution:** Use a Personal Access Token, not your password
- Create token: https://github.com/settings/tokens

### "Repository not found"
- **Solution:** Make sure you created the repository on GitHub first
- Check the URL is correct

---

## 📞 Need Help?

If you provide your GitHub repository URL, I can help you set it up manually!

---

**Ready?** Create the repo, then run `.\setup-github.ps1` in PowerShell! 🚀



