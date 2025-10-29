# Job Portal Dash

**Live Demo:** [https://jobportaldash.vercel.app](https://jobportaldash.vercel.app)  
**Repository:** [https://github.com/aryapdf/job-portal-dash](https://github.com/aryapdf/job-portal-dash)

## Project Overview

Job Portal Dash is a modern job management dashboard built with Next.js 16, designed to help recruiters and HR teams manage job postings and candidate submissions efficiently.  
It provides a responsive, fast, and modular admin interface that supports CRUD operations for job listings, gesture-based input for interactive features, and Firebase integration for real-time data management.

Key features:
- Job posting management (create, edit, delete)
- Candidate management (update, edit, delete)
- Responsive layout for mobile and desktop
- Gesture-based auto-capture photo
- Firebase authentication and Firestore database integration
- Real-time state management with Redux Toolkit
- Modern drag-and-drop interaction via DnD Kit
- Data table rendering with TanStack React Table

## Tech Stack

**Framework**
- Next.js 16 (React 19)

**UI & Styling**
- TailwindCSS 4  
- Shadcn/UI  

**State & Logic**
- Redux Toolkit  
- React Hook Form + Zod validation  
- DnD Kit (drag and drop sorting)  
- TanStack React Table  

**Backend & Auth**
- Firebase (Firestore, Auth, Admin SDK)  
- Resend (transactional email service)

**Utilities**
- date-fns  
- Sonner (toast notifications)

**Build & Tooling**
- TypeScript  
- ESLint  
- PostCSS  

## Run Locally
**Prerequisites**
- Minimum Node version: **v20+**  
- Default package manager: **NPM**   
- Configure Firestore security rules to allow authenticated read/write operations.
- Configure Resend to allow magic links feature.


1. **Clone the repository**
   ```bash
   git clone https://github.com/aryapdf/job-portal-dash.git
   cd job-portal-dash
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Setup environment variables**

   Create a `.env.local` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

   NEXT_PUBLIC_BASE_URL=your-public-base-url
   RESEND_API_KEY=your-resend-key

   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   ```
   http://localhost:3000
   ```
