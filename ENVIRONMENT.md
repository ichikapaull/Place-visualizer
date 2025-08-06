# Environment Setup Guide

## Required Environment Variables

Copy `.env.example` to `.env` and fill in the following values:

### Supabase Configuration

1. **VITE_SUPABASE_URL**: Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Find this in your Supabase dashboard under Settings > API

2. **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key
   - Find this in your Supabase dashboard under Settings > API > anon public

### Mapbox Configuration

3. **VITE_MAPBOX_ACCESS_TOKEN**: Your Mapbox access token
   - Create an account at mapbox.com
   - Generate a token with the required scopes

### Application Configuration

4. **VITE_APP_ENV**: Application environment
   - Use `development` for local development
   - Use `production` for production builds

## Database Setup

The application expects the following tables in your Supabase database:

### places
- `id` (uuid, primary key)
- `name` (text)
- `category` (text)
- `latitude` (double precision)
- `longitude` (double precision)
- `rating` (double precision, nullable)
- `address` (text, nullable)
- `customer_count` (integer, nullable)
- `is_my_place` (boolean, default false)
- `created_at` (timestamp with timezone)
- `updated_at` (timestamp with timezone)

### trade_areas
- `id` (uuid, primary key)
- `place_id` (uuid, foreign key to places.id)
- `geometry` (geometry/geography type for GeoJSON)
- `percentage` (integer, check constraint: 30, 50, or 70)
- `created_at` (timestamp with timezone)

### customer_zipcodes
- `id` (uuid, primary key)
- `zipcode` (text)
- `geometry` (geometry/geography type for GeoJSON)
- `customer_count` (integer)
- `created_at` (timestamp with timezone)

## Deployment

### Vercel Environment Variables

When deploying to Vercel, set the following environment variables in your Vercel dashboard:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `VITE_MAPBOX_ACCESS_TOKEN`
4. `VITE_APP_ENV=production`

### Automatic Deployment

The project is configured for automatic deployment to Vercel when pushing to the main branch.

## Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# Start development server
npm run dev
```
