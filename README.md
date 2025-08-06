# Place & Trade - Verinin Ötesini Görün

A React-based geospatial data visualization platform for place analysis and trade area insights.

# Place & Trade - Verinin Ötesini Görün

A React-based geospatial data visualization platform for place analysis and trade area insights.

## ✅ Task 1.1 Completed: Project Skeleton Setup
## ✅ Task 1.2 Completed: Backend and Deployment Integrations

### What's Been Implemented

#### Core Technologies
- ✅ **React 18+** with TypeScript
- ✅ **Vite** as build tool for fast development
- ✅ **Material-UI (MUI)** for component library
- ✅ **Zustand** for global state management
- ✅ **TanStack Query (React Query)** for server state management

#### Backend & Deployment
- ✅ **Supabase** integration with TypeScript client
- ✅ **Database API layers** for places, trade areas, and customer data
- ✅ **React Query hooks** for server state management
- ✅ **Vercel deployment** configuration
- ✅ **Environment variables** setup for different environments

#### Development Tools
- ✅ **ESLint** configured with TypeScript and React rules
- ✅ **Prettier** for code formatting
- ✅ **React Query Devtools** for debugging

#### Brand & Theme
- ✅ **Custom MUI Theme** with brand colors from `brandingGuideline.md`:
  - Deep Blue (#0A2540) - Primary
  - Accent Teal (#00C49F) - Secondary
  - Neutral Gray (#425466) - Text
  - Off-White (#F6F9FC) - Background
- ✅ **Inter Font** integration from Google Fonts
- ✅ **Typography hierarchy** matching brand guidelines

#### Project Structure
- ✅ **Organized folder structure**:
  ```
  src/
  ├── api/          # React Query setup & API clients
  ├── components/   # Reusable UI components
  ├── constants/    # App constants
  ├── contexts/     # React contexts
  ├── hooks/        # Custom hooks
  ├── pages/        # Page components
  ├── store/        # Zustand store
  ├── theme/        # MUI theme configuration
  ├── types/        # TypeScript type definitions
  └── utils/        # Utility functions
  ```

#### State Management
- ✅ **Zustand store** with organized slices for:
  - Filter state (category, radius, rating)
  - Map state (center, zoom, selected place, overlays)
  - UI state (sidebars, loading, errors)
- ✅ **Devtools integration** for debugging

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Build for production
npm run build
```

### Current Status

The application is now ready for feature development. The basic setup includes:

1. ✅ Properly configured React + TypeScript environment
2. ✅ Material-UI theme matching brand guidelines
3. ✅ Zustand store for state management
4. ✅ React Query for server state management
5. ✅ ESLint + Prettier for code quality
6. ✅ Organized project structure
7. ✅ Inter font integration
8. ✅ Type definitions for core entities

### Next Steps

The project is ready for implementing:
- Map component integration (Mapbox GL JS + Deck.gl)
- Backend integration (Supabase)
- UI components (sidebars, filters, cards)
- API layer for data fetching
- Map visualization features

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

### Dependencies

**Production:**
- React 19.1.0
- TypeScript ~5.8.3
- Material-UI 7.3.1
- Zustand 5.0.7
- TanStack Query 5.84.1

**Development:**
- Vite 7.0.4
- ESLint 9.30.1
- Prettier 3.6.2
- React Query Devtools 5.84.1
