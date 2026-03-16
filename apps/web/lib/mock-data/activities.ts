export type ActivityType =
  | 'job_created'
  | 'job_stage_changed'
  | 'job_completed'
  | 'quote_sent'
  | 'quote_approved'
  | 'quote_rejected'
  | 'client_added'
  | 'call_logged'
  | 'email_sent'
  | 'payment_received'
  | 'inventory_alert'
  | 'note_added';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  entityType: 'job' | 'quote' | 'client' | 'inventory' | 'payment';
  entityId: string;
  entityName: string;
  metadata?: Record<string, string | number | boolean>;
}

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'job_stage_changed',
    title: 'งาน JOB-2026-004 เข้าสู่ขั้นตอนการจัดส่ง',
    description: 'แบนเนอร์งานสัมมนา EventPro Thailand พร้อมส่งมอบ',
    timestamp: '2026-03-16T09:30:00',
    user: 'ช่างพิมพ์ A',
    entityType: 'job',
    entityId: 'j4',
    entityName: 'JOB-2026-004',
    metadata: { from: 'finishing', to: 'shipping' }
  },
  {
    id: 'a2',
    type: 'quote_approved',
    title: 'ใบเสนอราคา QT-2026-007 ได้รับการอนุมัติ',
    description: 'FashionBrand Thailand อนุมัติใบเสนอราคา Lookbook คอลเลกชันฤดูร้อน มูลค่า ฿98,440',
    timestamp: '2026-03-15T16:45:00',
    user: 'ณัฐพล จันทร์เพ็ญ',
    entityType: 'quote',
    entityId: 'q7',
    entityName: 'QT-2026-007',
    metadata: { amount: 98440 }
  },
  {
    id: 'a3',
    type: 'job_created',
    title: 'สร้างงานใหม่ JOB-2026-015',
    description: 'คาตาล็อกบริการโรงแรม Royal Thai Hotels Group 96 หน้า มูลค่า ฿320,000',
    timestamp: '2026-03-16T08:00:00',
    user: 'วันดี มีผล',
    entityType: 'job',
    entityId: 'j15',
    entityName: 'JOB-2026-015',
    metadata: { value: 320000 }
  },
  {
    id: 'a4',
    type: 'inventory_alert',
    title: 'แจ้งเตือนสต็อกต่ำ: หมึก Eco-solvent สี CMYK',
    description: 'สต็อกหมดแล้ว! กรุณาสั่งซื้อด่วน - ใช้กับงานพิมพ์ป้ายไวนิล',
    timestamp: '2026-03-16T07:00:00',
    user: 'ระบบ',
    entityType: 'inventory',
    entityId: 'm6',
    entityName: 'INK-ECO-CMYK',
    metadata: { currentStock: 0, minStock: 8 }
  },
  {
    id: 'a5',
    type: 'call_logged',
    title: 'บันทึกการโทร: วิภาวี รักสวย - BrandHouse',
    description: 'หารือรายละเอียดคาตาล็อก 48 หน้า ลูกค้าต้องการ mock-up ภายในสัปดาห์นี้',
    timestamp: '2026-03-15T14:00:00',
    user: 'สมหมาย ขายดี',
    entityType: 'client',
    entityId: 'co2',
    entityName: 'BrandHouse Agency'
  },
  {
    id: 'a6',
    type: 'payment_received',
    title: 'รับชำระเงิน: Thai Print Solutions',
    description: 'รับชำระค่างาน JOB-2026-001 (โบรชัวร์ Q1) จำนวน ฿45,475 (50%)',
    timestamp: '2026-03-15T11:30:00',
    user: 'บัญชี',
    entityType: 'payment',
    entityId: 'j1',
    entityName: 'JOB-2026-001',
    metadata: { amount: 45475 }
  },
  {
    id: 'a7',
    type: 'quote_sent',
    title: 'ส่งใบเสนอราคา QT-2026-008',
    description: 'ส่งใบเสนอราคาคาตาล็อกโรงแรม Royal Thai Hotels Group มูลค่า ฿342,400 ทางอีเมล',
    timestamp: '2026-03-15T10:00:00',
    user: 'วันดี มีผล',
    entityType: 'quote',
    entityId: 'q8',
    entityName: 'QT-2026-008',
    metadata: { amount: 342400 }
  },
  {
    id: 'a8',
    type: 'job_stage_changed',
    title: 'งาน JOB-2026-007 เริ่มขั้นตอน Pre-press',
    description: 'Lookbook FashionBrand Thailand เริ่มทำ layout และตรวจสอบไฟล์',
    timestamp: '2026-03-16T08:30:00',
    user: 'ช่างดีไซน์ B',
    entityType: 'job',
    entityId: 'j7',
    entityName: 'JOB-2026-007',
    metadata: { stage: 'pre-press' }
  },
  {
    id: 'a9',
    type: 'email_sent',
    title: 'ส่งอีเมลยืนยันรับงาน: MegaStore Retail',
    description: 'ยืนยันรับคำสั่งซื้อป้ายไวนิล 20 ป้าย กำหนดส่ง 18 มี.ค. 2026',
    timestamp: '2026-03-15T09:00:00',
    user: 'วันดี มีผล',
    entityType: 'client',
    entityId: 'co3',
    entityName: 'MegaStore Retail Group'
  },
  {
    id: 'a10',
    type: 'job_completed',
    title: 'งาน JOB-2026-014 เสร็จสิ้น',
    description: 'ป้ายชื่อและบัตรประจำตัวงานสัมมนา EventPro Thailand ส่งมอบเรียบร้อย',
    timestamp: '2026-03-13T17:00:00',
    user: 'ช่างพิมพ์ C',
    entityType: 'job',
    entityId: 'j14',
    entityName: 'JOB-2026-014'
  },
  {
    id: 'a11',
    type: 'client_added',
    title: 'เพิ่มลูกค้าใหม่: Beauty Paradise Salon',
    description: 'ลูกค้าใหม่จาก Instagram ต้องการ menu และ price list สวยงาม',
    timestamp: '2026-03-14T15:30:00',
    user: 'สมหมาย ขายดี',
    entityType: 'client',
    entityId: 'l5',
    entityName: 'Beauty Paradise Salon'
  },
  {
    id: 'a12',
    type: 'inventory_alert',
    title: 'แจ้งเตือนสต็อกวิกฤต: กระดาษอาร์ต 300 แกรม',
    description: 'สต็อกเหลือ 12 รีม ต่ำกว่าระดับขั้นต่ำ 20 รีม - มีงานนามบัตรรอผลิต',
    timestamp: '2026-03-13T08:00:00',
    user: 'ระบบ',
    entityType: 'inventory',
    entityId: 'm3',
    entityName: 'PAP-ART300-BC',
    metadata: { currentStock: 12, minStock: 20 }
  }
];
