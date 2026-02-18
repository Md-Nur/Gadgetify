# 🛒 Gadgetify - Modern Tech E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/daisyUI-5.0-55AD9B?style=flat-square)](https://daisyui.com/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-000000?style=flat-square&logo=bun)](https://bun.sh/)

Gadgetify is a premium, high-performance e-commerce platform built for gadget enthusiasts. It features a sleek, tech-inspired design with a seamless user experience, powered by the latest web technologies.

## 🚀 Key Features

- **💎 Premium UX/UI**: Beautiful, responsive design using Tailwind CSS 4 and DaisyUI 5 with glassmorphism effects and smooth animations.
- **🔐 Secure Authentication**: Multi-layered security using JWT and Bcryptjs for user and admin authentication.
- **⚡ Eager Image Upload**: Profile pictures are uploaded to ImgBB instantly during signup to minimize registration time.
- **📦 Advanced Cart System**: Persistent guest cart that intelligently merges with the user's account upon login.
- **🔍 Dedicated Order Tracking**: Search and track orders in real-time with a clean, dedicated tracking interface.
- **🛠️ Admin Dashboard**: Robust management system for products, orders, and user accounts.
- **🛠️ Secured DB Connections**: Explicitly configured PostgreSQL SSL modes for maximum security and stability.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [DaisyUI 5](https://daisyui.com/)
- **Image Hosting**: [ImgBB API](https://imgbb.com/)
- **State Management**: React Context API (Cart & Auth)

## 🏁 Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation) installed on your machine.
- A PostgreSQL database (Neon recommended).
- An ImgBB API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Md-Nur/Gadgetify.git
   cd Gadgetify
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=verify-full"
   JWT_SECRET_TOKEN="your_jwt_secret"
   IMGBB_API="your_imgbb_api_key"
   ```

4. **Database Setup:**
   ```bash
   bun --bun prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
├── app/                  # Next.js App Router
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # Backend API routes
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth & Cart contexts
│   ├── user/             # User profile & auth routes
│   └── track-order/      # New dedicated tracking page
├── generated/            # Prisma generated client
├── lib/                  # Library configurations (Prisma)
├── public/               # Static assets
└── prisma/               # Database schema & migrations
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with 💙 by **Nur** and the **Gadgetify** team.