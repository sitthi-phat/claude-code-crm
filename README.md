# PrintCRM - ระบบบริหารงานพิมพ์

Phase 1 CRM สำหรับธุรกิจพิมพ์ สร้างด้วย Next.js + Tailwind CSS + shadcn/ui

## โครงสร้างโปรเจกต์

```
claude-crm/
├── apps/
│   ├── web/          # Next.js App Router (port 3000)
│   └── server/       # Express server (port 3001)
├── package.json      # root workspace
└── README.md
```

## เริ่มใช้งาน

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# รัน web app เท่านั้น (Phase 1)
npm run dev:web

# รัน ทั้ง web + server พร้อมกัน
npm run dev
```

แล้วเปิด [http://localhost:3000](http://localhost:3000)

## Mock Credentials (Phase 1)

```
Email:    admin@company.com
Password: admin1234
```

## หน้าที่มีในระบบ

| หน้า | URL | รายละเอียด |
|------|-----|------------|
| Login | `/login` | Mock authentication |
| Forgot Password | `/login/forgot-password` | Reset password form |
| แดชบอร์ด | `/` | KPI Cards, AI Insights, Tasks, Activity Feed |
| บริษัท | `/clients` | รายชื่อบริษัท + search/filter |
| รายละเอียดบริษัท | `/clients/[id]` | ผู้ติดต่อ, งาน, ประวัติสื่อสาร |
| ผู้ติดต่อ | `/contacts` | รายชื่อผู้ติดต่อทั้งหมด |
| รายละเอียดผู้ติดต่อ | `/contacts/[id]` | Communication log |
| ไปป์ไลน์การขาย | `/sales` | Leads, Quotes, Deals |
| ใบเสนอราคา | `/sales/quotes/[id]` | รายละเอียด line items + timeline |
| งานผลิต | `/production` | Kanban Board + ประวัติ |
| รายละเอียดงาน | `/production/[id]` | Stage progress, line items |
| วัตถุดิบ | `/inventory/materials` | สต็อก + แจ้งเตือน |
| ซัพพลายเออร์ | `/inventory/suppliers` | รายชื่อซัพพลายเออร์ |
| Automation & AI | `/automation` | Workflows + Charts |
| ตั้งค่า | `/settings` | Users, Integrations |

## Features (Phase 1)

- **Authentication** — Mock login/logout with AuthGuard on all routes
- **Theme** — Light / Dark mode toggle (via next-themes)
- **Language** — EN / TH switcher, default EN (persisted in localStorage)
- **Quick Add Modals** — New Contact, Draft Quote (with line items + 7% VAT), Log Call
- **Sales** — Create Quote modal
- **Production** — Create New Job modal
- **Inventory** — Add Raw Material modal

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes
- **Backend**: Express.js (dev proxy, Phase 1 only)
- **Data**: Mock data — no real API calls (`apps/web/lib/mock-data/`)

## หมายเหตุ

Phase 1 ใช้ mock data ทั้งหมดใน `apps/web/lib/mock-data/`
ไม่มีการเชื่อมต่อ database หรือ API จริง
Phase 2 จะเพิ่ม backend API, database, LINE OA, และ microservices
