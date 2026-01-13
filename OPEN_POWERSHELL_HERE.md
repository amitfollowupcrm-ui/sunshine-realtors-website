# How to Open PowerShell in Your Project Folder

## Method 1: Using File Explorer (Easiest)

1. **Open File Explorer**
2. **Navigate to:** `D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website`
3. **Click in the address bar** and type: `powershell`
4. **Press Enter**
   - OR right-click in the folder → **"Open in Terminal"**
   - OR hold **Shift** and right-click → **"Open PowerShell window here"**

## Method 2: From Current PowerShell

If you're already in PowerShell, just run:
```powershell
cd "D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website"
.\setup-github.ps1
```

## Method 3: Create a Shortcut

1. Right-click on your desktop
2. New → Shortcut
3. Location: `powershell.exe -NoExit -Command "cd 'D:\Devloment\RMSINFRATECH INC\sunshine-realtors-website'"`
4. Name it: "Sunshine Realtors PowerShell"
5. Double-click to open!

---

## After Opening PowerShell

Once PowerShell is open in the project folder, run:

```powershell
.\setup-github.ps1
```

The script will guide you through the rest!

---

**Or just provide your GitHub URL and I'll set it up for you!** 🚀





