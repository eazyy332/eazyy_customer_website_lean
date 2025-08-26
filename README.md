# Eazyy Customer Website

A modern, responsive customer website built with React, TypeScript, and TailwindCSS.

## 🚀 Features

- **React 18** with TypeScript
- **Responsive Design** - Mobile-first approach
- **TailwindCSS 3** for styling
- **React Router 6** for SPA navigation
- **Radix UI** components for accessibility
- **Express Server** integration
- **Supabase** backend integration

## 📱 Pages & Routes

### Main Pages
- **Home** (`/`) - Landing page
- **Services** (`/services`) - Service offerings
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form
- **Help** (`/help`) - FAQ and support
- **Privacy** (`/privacy`) - Privacy policy

### Order Flow
- **Order Start** (`/order/start`) - Begin new order
- **Service Selection** (`/order/services`) - Choose services
- **Item Selection** (`/order/items/:category`) - Select items
- **Scheduling** (`/order/scheduling`) - Pickup/delivery times
- **Address** (`/order/address`) - Location details
- **Payment** (`/order/payment`) - Payment processing
- **Confirmation** (`/order/confirmation`) - Order confirmation

### User Account
- **Login** (`/login`) - User authentication
- **Cart** (`/cart`) - Shopping cart
- **Order History** (`/orders`) - Past orders
- **Notifications** (`/notifications`) - User notifications
- **Messages** (`/messages`) - Communication center

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS 3 + Radix UI
- **Routing**: React Router 6
- **Backend**: Express.js + Supabase
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd eazyy_customer_website_lean

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Note**: The `SUPABASE_SERVICE_ROLE_KEY` is required for server-side operations. You can find this key in your Supabase project settings under 'API Keys' (it's the `service_role` key).

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── components/        # UI components
│   │   ├── ui/           # Radix UI components
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   └── MobileTabBar.tsx
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── global.css        # Global styles
├── server/                # Express backend
├── shared/                # Shared types
├── public/                # Static assets
└── package.json
```

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run typecheck    # TypeScript validation
```

## 🌐 Deployment

### Netlify
Includes `netlify.toml` for easy deployment.

### Vercel
Can be deployed on Vercel with minimal configuration.

### Manual Deployment
```bash
npm run build
npm start
```

## 📄 License

This project is proprietary software owned by Eazyy.

---

Built with ❤️ by the Eazyy development team
