# AWS S3 Photo Manager

A React-based photo management application that uses AWS S3 for storage. Built with Vite, TypeScript, and Tailwind CSS.

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your AWS credentials
3. Run the deployment script:
   ```bash
   npm run deploy
   ```

## Manual Setup

1. Create `.env` file with required AWS credentials:
   ```
   VITE_AWS_ACCESS_KEY_ID=your_access_key_id
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
   VITE_AWS_REGION=your_region
   VITE_AWS_BUCKET_NAME=your_bucket_name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Docker Deployment

Make sure Docker is installed and running, then:

```bash
docker-compose up --build
```

The application will be available at http://localhost:5173

## Features

- Upload photos to AWS S3
- Create and navigate albums
- View photos in a grid layout
- Multi-select photos for batch operations
- Delete single or multiple photos
- Automatic thumbnail generation
- Drag and drop upload support
- Mobile-responsive design
- Album navigation with breadcrumbs

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_AWS_ACCESS_KEY_ID | AWS Access Key ID |
| VITE_AWS_SECRET_ACCESS_KEY | AWS Secret Access Key |
| VITE_AWS_REGION | AWS Region (e.g., us-east-1) |
| VITE_AWS_BUCKET_NAME | S3 Bucket Name |

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Run deployment script