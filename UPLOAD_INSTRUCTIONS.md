# GitHub Upload Instructions

1. Download the project files from StackBlitz

2. On your local machine, run these commands:
```bash
# Clone your repository
git clone https://github.com/Ashok-Rawat-Code/AWS-S3-Photo-Manager.git

# Copy all project files to the cloned directory
# (Make sure to copy all files including hidden ones like .env.example)

# Navigate to the repository directory
cd AWS-S3-Photo-Manager

# Add all files to git
git add .

# Commit the changes
git commit -m "Add AWS S3 Photo Manager with multi-select support"

# Push to GitHub
git push origin main
```

Important: Make sure not to commit the `.env` file if it contains real AWS credentials!