# POI Verification System

A Next.js application for verifying and managing Proof of Impact (POI) projects with NFT minting capabilities.

## Features

- 🔐 Secure authentication with Supabase
- 📊 Project management dashboard
- ✅ Project verification workflow
- 💰 Budget tracking
- 🎨 Modern UI with Material-UI
- 🔄 Real-time updates
- 🌐 NFT minting integration

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Emotion (MUI's styling solution)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account and project

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mxsafiri/poi-verify.git
cd poi-verify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  metric TEXT,
  budget TEXT,
  status TEXT DEFAULT 'Pending',
  nft_minted BOOLEAN DEFAULT FALSE,
  funded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Verifiers Table
```sql
CREATE TABLE verifiers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  is_verifier BOOLEAN DEFAULT FALSE
);
```

## Project Structure

```
poi-verify/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/         # React components
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility functions and configurations
│   │   ├── auth/         # Authentication context and hooks
│   │   ├── db.ts         # Database utilities
│   │   └── supabase.ts   # Supabase client configuration
│   └── types/            # TypeScript type definitions
├── public/               # Static files
└── package.json         # Project dependencies and scripts
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler check

## Security

- Row Level Security (RLS) policies are implemented in Supabase
- Users can only access their own projects
- Verifier status is protected
- Environment variables are properly configured

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/mxsafiri/poi-verify](https://github.com/mxsafiri/poi-verify)
