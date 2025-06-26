# ForgeFit

ForgeFit is a comprehensive fitness web application for managing workout routines, tracking nutrition, and exploring food information. It offers a user-friendly interface with authentication, personalized dashboards, and nutrition tracking capabilities.

## Features

- **User Authentication**: Secure login with credentials and Google authentication
- **Personalized Dashboard**: Track workouts, nutrition, and fitness goals in one place
- **Nutrition Search**: Real-time nutrition data for thousands of foods
- **Workout Planning**: Create and manage personalized workout routines
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technologies

- **Frontend**: React, TypeScript, Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Google OAuth and credentials provider
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **API Integration**: CalorieNinjas Nutrition API

## Getting Started

### Prerequisites

- Node.js (18+)
- PostgreSQL database (optional, only if using database adapters)
- Google OAuth credentials (for Google sign-in)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ForgeFit.git
   cd ForgeFit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

   # Google OAuth (optional - only needed for Google sign-in)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # API Keys
   NINJAS_API_KEY=your-calorieninjas-api-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

## Project Structure

```
forgefit/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── api/                # API endpoints
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── app/                # Application-specific components
│   │   ├── auth/               # Authentication components
│   │   ├── layout/             # Layout components
│   │   └── providers/          # Context providers
│   ├── lib/                    # Utility functions and libraries
│   ├── pages/                  # For custom page components
│   └── middleware.ts           # NextAuth middleware for route protection
├── public/                     # Static assets
└── prisma/                     # Database schema (if using Prisma)
```

## Authentication

ForgeFit supports two authentication methods:

- **Credentials Provider**: Email/password login
- **Google OAuth**: One-click sign-in with Google

For development purposes, you can use these credentials:
- Email: demo@forgefit.com
- Password: password123

## Nutrition API

The nutrition lookup feature uses the CalorieNinjas API. You'll need to:

1. Create an account at [CalorieNinjas](https://calorieninjas.com/)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `NINJAS_API_KEY`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the Creative Commons NonCommercial (CC BY-NC) License.

## Acknowledgments

Thanks to all contributors and the CalorieNinja API for nutritional data.
# Deployment fix
