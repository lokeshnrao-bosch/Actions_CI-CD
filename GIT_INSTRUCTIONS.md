# Git Setup and Deployment Instructions

## Prerequisites

### Install Git

If Git is not installed on your system, download and install it:

**Windows:**

1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart PowerShell/Command Prompt after installation

**Alternative for Windows:**

```powershell
# Using Chocolatey (if installed)
choco install git

# Using Winget (Windows 10/11)
winget install --id Git.Git -e --source winget
```

**Mac:**

```bash
# Using Homebrew
brew install git

# Using Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install git
```

## Git Setup and Push Instructions

Once Git is installed, follow these steps:

### 1. Configure Git (First Time Setup)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Initialize Repository and Add Files

```bash
# Navigate to project directory
cd "C:\sandboxes\Training\ecommerce-app"

# Initialize Git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Complete eCommerce application with professional SVG images"
```

### 3. Connect to Remote Repository

```bash
# Add the remote repository
git remote add origin https://github.com/lokeshnrao-bosch/Actions_CI-CD.git

# Verify remote is added
git remote -v
```

### 4. Push to GitHub

```bash
# Push to main branch (or master if that's your default)
git push -u origin main

# If the above fails, try with master branch
git push -u origin master
```

### Alternative: Create New Branch

If you want to push to a specific branch:

```bash
# Create and switch to a new branch
git checkout -b ecommerce-app

# Push to the new branch
git push -u origin ecommerce-app
```

## Troubleshooting

### Authentication Issues

If you encounter authentication issues:

1. **Personal Access Token (Recommended):**

   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with repo permissions
   - Use the token as your password when prompted

2. **SSH Key (Alternative):**

   ```bash
   # Generate SSH key
   ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

   # Add SSH key to SSH agent
   ssh-add ~/.ssh/id_rsa

   # Copy public key and add to GitHub Settings > SSH Keys
   cat ~/.ssh/id_rsa.pub

   # Use SSH URL instead
   git remote set-url origin git@github.com:lokeshnrao-bosch/Actions_CI-CD.git
   ```

### Branch Issues

If you get errors about branch names:

```bash
# Check current branch
git branch

# Rename branch if needed
git branch -M main

# Or work with master branch
git checkout -b master
```

### Force Push (Use Carefully)

If the repository already has content and you need to overwrite:

```bash
git push -f origin main
```

⚠️ **Warning:** This will overwrite existing content in the repository!

## Repository Structure

Your repository will contain:

```
ecommerce-app/
├── .gitignore                 # Git ignore file
├── README.md                  # Main documentation
├── SETUP_GUIDE.md            # Setup instructions
├── IMAGES_GUIDE.md           # Image integration guide
├── GIT_INSTRUCTIONS.md       # This file
├── index.html                # Home page
├── products.html             # Products listing
├── product-detail.html       # Product details
├── cart.html                 # Shopping cart
├── assets/
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   └── images/               # Images and SVG files
└── data/
    └── products.json         # Product data
```

## Continuous Deployment

Once pushed to GitHub, you can set up:

### GitHub Pages (Free Hosting)

1. Go to repository Settings > Pages
2. Select source branch (main/master)
3. Your site will be available at: `https://lokeshnrao-bosch.github.io/Actions_CI-CD/`

### GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Quick Commands Reference

```bash
# Check status
git status

# Add specific files
git add filename.html

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Check commit history
git log --oneline

# Check remote repositories
git remote -v

# Switch branches
git checkout branch-name

# Create new branch
git checkout -b new-branch-name
```

## Project Features to Highlight in Commits

When making future commits, highlight these features:

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional SVG product images
- ✅ Shopping cart with localStorage persistence
- ✅ Product search and filtering
- ✅ Clean, modern UI/UX
- ✅ No external dependencies
- ✅ Cross-browser compatibility
- ✅ Accessibility features
- ✅ Performance optimized
- ✅ SEO friendly structure

## Support

If you encounter issues:

1. Check Git installation: `git --version`
2. Verify remote URL: `git remote -v`
3. Check repository permissions on GitHub
4. Ensure you have push access to the repository

Happy coding! 🚀
