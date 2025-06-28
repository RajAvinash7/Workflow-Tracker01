# Task Management Dashboard

## Overview

This is a full-stack task management web application built with React, TypeScript, Express.js, and PostgreSQL. The application provides a clean, modern dashboard interface for managing personal tasks and user profiles. It features a responsive design using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Uses connect-pg-simple for session storage
- **API Design**: RESTful API endpoints

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage class for development/testing

## Key Components

### Database Schema
- **Users Table**: Stores user profile information including username, password, name, email, role, department, location, profile image, and join date
- **Tasks Table**: Stores task information with relationships to users, including title, description, completion status, priority, due date, and timestamps

### API Endpoints
- `GET /api/user` - Retrieve current user profile
- `PATCH /api/user` - Update user profile
- `GET /api/tasks` - Retrieve user's tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/stats` - Get task statistics

### UI Components
- **Dashboard**: Main application interface with profile card, task list, and statistics panel
- **Profile Card**: Displays and allows editing of user information
- **Task List**: Interactive task management with filtering and CRUD operations
- **Statistics Panel**: Visual representation of task completion metrics
- **Modals**: Add task and edit profile modals with form validation

## Data Flow

1. **Authentication**: Simplified authentication using hardcoded user ID (development setup)
2. **Task Management**: Full CRUD operations with optimistic updates
3. **Profile Management**: User profile editing with real-time updates
4. **Statistics**: Real-time calculation of task completion metrics
5. **State Synchronization**: TanStack Query handles caching and synchronization between client and server

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- UI/UX libraries (Radix UI primitives, Lucide React icons)
- State management (TanStack Query)
- Styling (Tailwind CSS, class-variance-authority)
- Form validation (Zod, @hookform/resolvers)
- Date handling (date-fns)

### Backend Dependencies
- Express.js server framework
- Database (Drizzle ORM, @neondatabase/serverless)
- Session management (express-session, connect-pg-simple)
- Development tools (TSX for TypeScript execution)

### Build Tools
- Vite (frontend bundling and development server)
- ESBuild (backend bundling for production)
- TypeScript compiler
- PostCSS with Tailwind CSS

## Deployment Strategy

### Development
- Frontend: Vite development server on port 5000
- Backend: Express server with TypeScript execution via TSX
- Database: Neon Database (serverless PostgreSQL)
- Hot reloading enabled for both frontend and backend

### Production Build
- Frontend: Static files built with Vite and served from `/dist/public`
- Backend: Bundle built with ESBuild targeting Node.js
- Database: Production Neon Database with connection pooling
- Deployment target: Replit autoscale infrastructure

### Configuration
- Environment variables for database connection
- Drizzle configuration for database schema and migrations
- Vite configuration with path aliases and plugin setup
- TypeScript configuration with path mapping

## Changelog
- June 27, 2025: Initial setup with core dashboard functionality
- June 27, 2025: Added enhanced functionality including:
  - Task Calendar: Visual calendar view showing tasks by due date
  - Activity Feed: Recent task activities and timeline
  - Productivity Chart: Weekly productivity tracking with completion metrics
  - Advanced Task Search: Search and filter tasks by various criteria
  - Tabbed Navigation: Organized dashboard into Overview, Calendar, Analytics, and Search tabs
- June 27, 2025: Added advanced features:
  - Dark Mode Toggle: Switch between light and dark themes with persistent storage
  - Weekly/Monthly Reports: Comprehensive productivity reports with export functionality
  - Goal Setting: Set and track daily/weekly/monthly task completion goals
  - Enhanced UI: Full dark mode support across all components
  - Extended Navigation: Added Reports and Goals tabs for better organization
- June 27, 2025: UI cleanup and optimization:
  - Removed Recent Activity section from Calendar, Analytics, Search, Reports, and Goals tabs
  - Kept Recent Activity only in Overview section for better focus and reduced clutter
  - Fixed dark mode text visibility issues across all components
- June 27, 2025: Made dashboard fully responsive:
  - Updated header layout with responsive logo, navigation, and user menu
  - Redesigned tab navigation to work on mobile with icon-only view on small screens
  - Added responsive spacing and sizing across all components
  - Updated profile card to stack vertically on mobile
  - Made task list and statistics panels mobile-friendly
  - Added custom responsive breakpoints for extra small screens
  - Optimized all grid layouts for mobile, tablet, and desktop views

## User Preferences

Preferred communication style: Simple, everyday language.