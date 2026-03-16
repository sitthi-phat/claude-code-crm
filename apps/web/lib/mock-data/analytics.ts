export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
  jobs: number;
}

export interface DealWinRate {
  name: string;
  value: number;
  color: string;
}

export interface TopClient {
  clientId: string;
  clientName: string;
  revenue: number;
  jobs: number;
  tier: string;
}

export interface ProductionTrend {
  week: string;
  completed: number;
  started: number;
  inProgress: number;
}

export interface KPIData {
  activeJobs: number;
  activeJobsTrend: number;
  monthlyRevenuePipeline: number;
  pendingQuotesValue: number;
  closedDealsValue: number;
  pendingApprovals: number;
  inventoryAlerts: number;
}

export const kpiData: KPIData = {
  activeJobs: 10,
  activeJobsTrend: 18.5,
  monthlyRevenuePipeline: 892430,
  pendingQuotesValue: 614830,
  closedDealsValue: 277600,
  pendingApprovals: 3,
  inventoryAlerts: 5
};

export const monthlyRevenueData: MonthlyRevenue[] = [
  { month: 'ต.ค. 2025', revenue: 520000, target: 600000, jobs: 18 },
  { month: 'พ.ย. 2025', revenue: 680000, target: 650000, jobs: 22 },
  { month: 'ธ.ค. 2025', revenue: 920000, target: 800000, jobs: 28 },
  { month: 'ม.ค. 2026', revenue: 750000, target: 700000, jobs: 24 },
  { month: 'ก.พ. 2026', revenue: 610000, target: 680000, jobs: 19 },
  { month: 'มี.ค. 2026', revenue: 892430, target: 850000, jobs: 15 }
];

export const dealWinRateData: DealWinRate[] = [
  { name: 'ปิดดีล (Won)', value: 68, color: '#10b981' },
  { name: 'สูญเสีย (Lost)', value: 15, color: '#ef4444' },
  { name: 'อยู่ระหว่างดำเนินการ', value: 17, color: '#f59e0b' }
];

export const topClientsData: TopClient[] = [
  {
    clientId: 'co3',
    clientName: 'MegaStore Retail Group',
    revenue: 3150000,
    jobs: 42,
    tier: 'enterprise'
  },
  {
    clientId: 'co1',
    clientName: 'Thai Print Solutions',
    revenue: 2850000,
    jobs: 38,
    tier: 'enterprise'
  },
  {
    clientId: 'co10',
    clientName: 'Royal Thai Hotels Group',
    revenue: 2100000,
    jobs: 31,
    tier: 'enterprise'
  },
  {
    clientId: 'co5',
    clientName: 'Bangkok General Hospital',
    revenue: 1680000,
    jobs: 24,
    tier: 'enterprise'
  },
  {
    clientId: 'co2',
    clientName: 'BrandHouse Agency',
    revenue: 1240000,
    jobs: 19,
    tier: 'mid-market'
  },
  {
    clientId: 'co7',
    clientName: 'FashionBrand Thailand',
    revenue: 965000,
    jobs: 14,
    tier: 'mid-market'
  },
  {
    clientId: 'co4',
    clientName: 'EventPro Thailand',
    revenue: 875000,
    jobs: 22,
    tier: 'mid-market'
  }
];

export const productionTrendData: ProductionTrend[] = [
  { week: 'สัปดาห์ 1 (ก.พ.)', completed: 8, started: 12, inProgress: 6 },
  { week: 'สัปดาห์ 2 (ก.พ.)', completed: 10, started: 9, inProgress: 5 },
  { week: 'สัปดาห์ 3 (ก.พ.)', completed: 7, started: 11, inProgress: 8 },
  { week: 'สัปดาห์ 4 (ก.พ.)', completed: 12, started: 14, inProgress: 7 },
  { week: 'สัปดาห์ 1 (มี.ค.)', completed: 9, started: 10, inProgress: 9 },
  { week: 'สัปดาห์ 2 (มี.ค.)', completed: 11, started: 13, inProgress: 8 },
  { week: 'สัปดาห์ 3 (มี.ค.)', completed: 5, started: 8, inProgress: 10 }
];

export const revenueByCategory = [
  { category: 'โบรชัวร์ / แผ่นพับ', revenue: 1250000, percentage: 22 },
  { category: 'ป้ายและสื่อกลางแจ้ง', revenue: 980000, percentage: 17 },
  { category: 'บรรจุภัณฑ์', revenue: 850000, percentage: 15 },
  { category: 'หนังสือ / รายงาน', revenue: 720000, percentage: 13 },
  { category: 'ปฏิทิน / ของขวัญ', revenue: 580000, percentage: 10 },
  { category: 'นามบัตร / stationery', revenue: 420000, percentage: 7 },
  { category: 'อื่นๆ', revenue: 912430, percentage: 16 }
];
