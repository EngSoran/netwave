# NetWeave - حلول شبكات احترافية

Professional Network Solutions Platform with Comprehensive Admin Panel

## 🌐 Overview

NetWeave is a modern, full-featured web application for managing network services with a comprehensive Arabic (RTL) admin panel. Built with Next.js 15, Firebase, and features a beautiful Glass Morphism design.

## ✨ Key Features

### For Users
- 🎯 Interactive service catalog
- 📅 Service booking system with email confirmation
- 💳 Electronic payment via ZainCash
- 📥 Purchase and download paid files
- 🔧 Curated tools directory
- 🔐 Google OAuth authentication

### For Administrators (Complete Admin Panel)
- 📊 **Comprehensive Dashboard** with live statistics
- 🏠 **Home Page Editor** - Edit content without code
- 🖼️ **Media Library** - Upload and manage images with drag-drop
- 📁 **Categories Management** - Organize all content
- ⚙️ **Site Settings** - Full control (Contact, Social, SEO)
- 👥 **Users Management** - View users and their activity
- 💰 **Purchases Dashboard** - Revenue tracking with CSV export
- ⭐ **Testimonials Management** - Client testimonials with ratings
- ❓ **FAQs Management** - FAQ system
- 📦 **Services Management** - Full CRUD operations
- 📋 **Booking Requests** - Track and update status
- 📄 **Files Management** - Paid downloadable files
- 🔧 **Tools Management** - Useful links directory

## 🛠️ Tech Stack

- **Next.js 15** (App Router) + **TypeScript 5**
- **React 18.3** + **Tailwind CSS 3.4**
- **Firebase** (Firestore, Auth, Storage, Analytics)
- **Radix UI** + **Shadcn/ui** Components
- **React Hook Form** + **Zod** Validation
- **ZainCash** Payment Gateway (Iraqi market)
- **react-dropzone**, **react-quill**, **recharts**

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- ZainCash account (optional, for payments)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/netweave.git
cd netweave
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → Google Sign-in
3. Create **Firestore Database**
4. Enable **Storage**
5. Copy Firebase config from Project Settings

### 4. Configure Environment Variables

Create `.env.local` in project root:

```bash
# ZainCash (Optional - for payments)
NEXT_PUBLIC_ZAINCASH_MERCHANT_ID=your_merchant_id
ZAINCASH_SECRET=your_secret_key
NEXT_PUBLIC_ZAINCASH_MSISDN=your_phone_number
NEXT_PUBLIC_ZAINCASH_API_URL=https://test.zaincash.iq
```

**Note:** Firebase config is in `src/lib/firebase.ts`

### 5. Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 6. Update Admin Email

In `src/lib/admins.ts`:

```typescript
export const ADMIN_EMAILS = [
  "your-admin-email@gmail.com", // Change this
];
```

**⚠️ Important:** Also update in:
- `firestore.rules` (line 10)
- `storage.rules` (line 8)

Then redeploy: `firebase deploy --only firestore:rules,storage:rules`

### 7. Run Development Server

```bash
npm run dev
# Access at http://localhost:9002
```

### 8. Build for Production

```bash
npm run build
npm start
```

## 🔐 Security

### Firestore Rules
- ✅ **Services**: Public read, admin-only write
- ✅ **Bookings**: Users own data, admins manage all
- ✅ **Files**: Public read, admin-only write
- ✅ **Media**: Public read, admin-only upload
- ✅ **Categories**: Public read, admin-only write
- ✅ **Testimonials**: Published only public read
- ✅ **FAQs**: Published only public read

### Storage Rules
- ✅ Public read for images
- ✅ Admin-only uploads

### Authentication
- Google OAuth
- Email whitelist for admins
- Client + server-side validation

## 🌍 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
# Or using Vercel CLI
npm i -g vercel
vercel
```

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── layout.tsx     # Layout with Sidebar
│   │   ├── page.tsx       # Dashboard
│   │   └── [13 admin routes]
│   ├── booking/           # Booking page
│   ├── files/             # Paid files
│   ├── services/[slug]/   # Service details
│   └── payment/           # Payment pages
├── components/
│   ├── admin/             # Admin components
│   ├── layout/            # Header & Footer
│   └── ui/                # Shadcn/Radix UI
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── storage.ts         # Upload utilities
│   ├── admins.ts          # Admin whitelist
│   └── zaincash.ts        # Payment integration
└── hooks/
    └── use-toast.ts       # Toast notifications
```

## 🐛 Troubleshooting

### Firebase Rules Denied
- Deploy rules: `firebase deploy --only firestore:rules,storage:rules`
- Verify email matches in `admins.ts` and `firestore.rules`

### Images Won't Upload
- Check Storage Rules deployed
- Ensure user is admin
- Max file size: 5MB

### Admin Panel Not Showing
- Login with admin email
- Check browser console for errors

## 📄 License

MIT License

## 👨‍💻 Developer

Developed with ❤️ and Claude Code

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📞 Support

- Open an [Issue](https://github.com/yourusername/netweave/issues)
- WhatsApp: [+964 771 629 5191](https://wa.me/009647716295191)

---

**⭐ If you like this project, please give it a star!**
