# Hunger Games Simulator - Project Analysis

## 📋 Project Overview

**Los Juegos del Hambre** (Hunger Games Simulator) is a Next.js web application that simulates the Hunger Games with 24 tributes across 12 districts. The application allows users to manage custom characters, assign them as tributes, and simulate game events with day/night phases.

**Language**: Spanish (UI and content)  
**Status**: Functional but missing Supabase configuration

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x (strict mode enabled)
- **Styling**: Tailwind CSS 4.1.9 with custom theme
- **UI Components**: shadcn/ui (New York style) - 57+ components
- **Icons**: Lucide React
- **Fonts**: Inter (sans), Cinzel (serif)

### Backend/Database
- **Database**: Supabase (PostgreSQL)
- **ORM/Client**: @supabase/ssr 0.8.0, @supabase/supabase-js
- **Authentication**: Not implemented (public access via RLS policies)

### Additional Tools
- **Analytics**: Vercel Analytics
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Date Handling**: date-fns

---

## 🎮 Core Features

### 1. Character Management
- **CRUD Operations**: Create, read, delete characters
- **Image Support**: Optional image URLs for characters
- **Storage**: Characters stored in Supabase `characters` table
- **Minimum Requirement**: 24 characters needed to start a game

### 2. Game Setup
- **12 Districts**: Each with customizable names (default Spanish names)
- **24 Tributes**: 2 per district (male/female slots)
- **Tribute Assignment**: 
  - Manual assignment via Tribute Selector modal
  - Random assignment option
  - Character-to-tribute mapping with `characterId`

### 3. Game Simulation
- **Day/Night Phases**: Alternating phases with different event types
- **Event Types**:
  - **Day**: Neutral, shelter, sponsor, injury, alliance
  - **Night**: Kill, trap, escape, neutral
- **Game Mechanics**:
  - Health system (0-100)
  - Status tracking (healthy, injured, critical)
  - Kill tracking per tribute
  - Random event generation with probability weights
- **Controls**:
  - Start game
  - Simulate next phase
  - Simulate to end (auto-complete)
  - Reset game

### 4. UI Components
- **District Grid**: Visual representation of all 12 districts with tributes
- **Event Feed**: Chronological log of all game events, grouped by turn/phase
- **Fallen Tributes**: Memorial section for deceased tributes
- **Game Controls**: Statistics dashboard and control buttons
- **Character Manager**: Modal for managing character database
- **Tribute Selector**: Modal for assigning characters to tribute slots

---

## 🗄️ Database Schema

### Tables (from `scripts/001_create_hunger_games_tables.sql`)

#### `games`
- Stores game sessions
- Fields: id, name, status, current_turn, current_phase, winner_id, timestamps
- **Status**: Not currently used in frontend (all logic is client-side)

#### `characters`
- Custom characters/tributes
- Fields: id, name, avatar_color, created_at
- **Note**: Schema includes `avatar_color` but frontend uses `image_url` (mismatch!)

#### `tributes`
- Tributes in a specific game
- Fields: id, game_id, character_id, name, district, avatar_color, health, is_alive, kills, status, position
- **Note**: Schema uses `avatar_color` but frontend uses `image_url` (mismatch!)

#### `game_events`
- Game event log
- Fields: id, game_id, turn, phase, type, description, involved_tribute_ids, created_at
- **Status**: Not currently used (events stored in client state only)

### Row Level Security (RLS)
- All tables have RLS enabled
- Public read/write policies (no authentication)
- **Security Risk**: Anyone can modify data

---

## 📁 Project Structure

```
hunger-games-redesign/
├── app/
│   ├── globals.css          # Tailwind + theme variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main game component
├── components/
│   ├── character-manager.tsx    # Character CRUD modal
│   ├── district-grid.tsx        # 12-district grid display
│   ├── event-feed.tsx           # Event log sidebar
│   ├── fallen-tributes.tsx     # Memorial section
│   ├── game-controls.tsx       # Stats + control buttons
│   ├── tribute-card.tsx        # Individual tribute card
│   ├── tribute-selector.tsx   # Tribute assignment modal
│   ├── theme-provider.tsx      # (exists but not used)
│   └── ui/                     # 57+ shadcn/ui components
├── lib/
│   ├── game-engine.ts          # Core game logic
│   ├── game-types.ts           # TypeScript interfaces
│   ├── utils.ts                # Utility functions (cn)
│   └── supabase/
│       ├── client.ts           # Browser client
│       └── server.ts            # Server client (unused)
├── scripts/
│   └── 001_create_hunger_games_tables.sql
└── hooks/                      # Custom hooks (unused)
```

---

## ⚠️ Issues & Missing Pieces

### 🔴 Critical Issues

1. **Missing Supabase Credentials**
   - No `.env.local` or `.env` file
   - No `.env.example` template
   - Application will fail on startup without credentials
   - Required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Database Schema Mismatch**
   - Schema defines `avatar_color` field
   - Frontend uses `image_url` field
   - Characters table missing `image_url` column
   - This will cause runtime errors when saving characters with images

3. **Unused Database Tables**
   - `games`, `tributes`, `game_events` tables exist but are never used
   - All game state is stored in React state (client-side only)
   - No persistence between sessions
   - Database is only used for character storage

### 🟡 Medium Issues

4. **No Error Handling**
   - Supabase errors are only logged to console
   - No user-facing error messages
   - No retry logic for failed operations

5. **No Loading States**
   - Character loading has a flag but minimal UI feedback
   - No skeleton loaders or spinners

6. **TypeScript Configuration**
   - `ignoreBuildErrors: true` in `next.config.mjs`
   - Hides potential type errors during build

7. **Security Concerns**
   - RLS policies allow public write access
   - No authentication system
   - Anyone can delete/modify characters

8. **Missing Features from Schema**
   - `CustomEventTemplate` type defined but never used
   - `betrayal`, `theft`, `exploration` event types defined but not implemented

### 🟢 Minor Issues

9. **Unused Files**
   - `components/theme-provider.tsx` exists but not imported
   - `hooks/` directory has files but they're not used
   - `lib/supabase/server.ts` exists but never called (client-side only app)

10. **Inconsistent Naming**
    - Database uses snake_case (`image_url`)
    - TypeScript uses camelCase (`imageUrl`)
    - Conversion happens manually in code

11. **No Documentation**
    - No README.md
    - No setup instructions
    - No API documentation

---

## 🎯 Recommendations

### Immediate Actions (Required)

1. **Create `.env.local` file**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Fix Database Schema**:
   - Add `image_url TEXT` column to `characters` table
   - Or migrate frontend to use `avatar_color` instead
   - Run migration script

3. **Add Error Handling**:
   - Toast notifications for errors
   - Retry logic for network failures
   - User-friendly error messages

### Short-term Improvements

4. **Implement Game Persistence**:
   - Save game state to `games` table
   - Save events to `game_events` table
   - Load previous games

5. **Add Authentication**:
   - Supabase Auth integration
   - User-specific characters/games
   - Secure RLS policies

6. **Improve UX**:
   - Loading skeletons
   - Optimistic updates
   - Better mobile responsiveness

### Long-term Enhancements

7. **Additional Features**:
   - Custom event templates
   - Game history/replay
   - Statistics/analytics
   - Export game results
   - Multiplayer support

8. **Code Quality**:
   - Remove `ignoreBuildErrors`
   - Add unit tests
   - Add E2E tests
   - Improve TypeScript strictness

---

## 📊 Code Quality Assessment

### Strengths ✅
- Clean component architecture
- TypeScript types well-defined
- Modern React patterns (hooks, functional components)
- Good separation of concerns
- Responsive design with Tailwind
- Accessible UI components (shadcn/ui)

### Weaknesses ❌
- No error boundaries
- Minimal error handling
- No tests
- TypeScript errors ignored
- Inconsistent data models
- No documentation

---

## 🚀 Getting Started (After Fixes)

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up Supabase**:
   - Create Supabase project
   - Run `scripts/001_create_hunger_games_tables.sql`
   - Add migration for `image_url` column
   - Copy credentials to `.env.local`

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Access application**:
   - Open http://localhost:3000
   - Add 24+ characters
   - Assign tributes
   - Start simulation

---

## 📝 Summary

This is a **well-structured, modern React application** with a solid foundation, but it has **critical configuration gaps** that prevent it from running. The code quality is good, but the project needs:

1. ✅ Supabase credentials configuration
2. ✅ Database schema alignment
3. ✅ Error handling improvements
4. ✅ Documentation

Once these are addressed, the application should work smoothly. The architecture supports future enhancements like game persistence, authentication, and additional features.

---

**Analysis Date**: 2024  
**Project Status**: ⚠️ Needs Configuration  
**Estimated Time to Production**: 2-4 hours (for critical fixes)
