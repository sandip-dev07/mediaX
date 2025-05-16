# TweetSync - Twitter/X Content Management Platform

A Next.js 14 application that allows users to post to Twitter/X, schedule content for optimal times, and customize their posts.

## Features

- Twitter OAuth authentication
- Post tweets directly to Twitter
- Schedule tweets for future posting
- View analytics and engagement metrics
- Manage scheduled tweets
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js for authentication
- Twitter API v2
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Twitter Developer Account with API keys

### Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/twitter-scheduler.git
cd twitter-scheduler
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Copy the `.env.local.example` file to `.env.local` and fill in your values:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

4. Set up the database:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is ready to be deployed on Vercel. The cron job for posting scheduled tweets is configured in `vercel.json`.

## License

MIT
\`\`\`

Let's create a media upload component:
