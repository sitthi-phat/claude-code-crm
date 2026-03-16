export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type TaskType = 'follow-up' | 'approval' | 'call' | 'meeting' | 'delivery' | 'design' | 'admin';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  relatedClientId?: string;
  relatedClientName?: string;
  relatedJobId?: string;
  relatedJobName?: string;
  relatedQuoteId?: string;
  relatedQuoteName?: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'ติดตาม: MegaStore - อนุมัติใบเสนอราคา QT-2026-002',
    description: 'ส่งใบเสนอราคาไปแล้ว 7 วัน รอการอนุมัติ กำหนดหมดอายุ 22 มี.ค.',
    type: 'follow-up',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2026-03-17',
    dueTime: '10:00',
    assignedTo: 'วันดี มีผล',
    relatedClientId: 'co3',
    relatedClientName: 'MegaStore Retail Group',
    relatedQuoteId: 'q2',
    relatedQuoteName: 'QT-2026-002',
    createdAt: '2026-03-15',
    tags: ['ติดตาม', 'ใบเสนอราคา']
  },
  {
    id: 't2',
    title: 'ตรวจสอบ Proof: Lookbook FashionBrand',
    description: 'ส่ง proof สีให้ลูกค้าตรวจสอบก่อนพิมพ์จริง รอการอนุมัติ',
    type: 'approval',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-03-17',
    dueTime: '15:00',
    assignedTo: 'ช่างดีไซน์ B',
    relatedClientId: 'co7',
    relatedClientName: 'FashionBrand Thailand',
    relatedJobId: 'j7',
    relatedJobName: 'JOB-2026-007',
    createdAt: '2026-03-16',
    tags: ['proof', 'อนุมัติ']
  },
  {
    id: 't3',
    title: 'โทรติดตาม: BGH - สถานะ Annual Report',
    description: 'โทรสอบถามสถานะการส่ง artwork และยืนยันกำหนดส่ง',
    type: 'call',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-03-17',
    dueTime: '09:00',
    assignedTo: 'วันดี มีผล',
    relatedClientId: 'co5',
    relatedClientName: 'Bangkok General Hospital',
    relatedJobId: 'j5',
    relatedJobName: 'JOB-2026-005',
    createdAt: '2026-03-15',
    tags: ['โทร', 'artwork', 'ด่วน']
  },
  {
    id: 't4',
    title: 'สั่งซื้อ: หมึก Eco-solvent CMYK - หมดสต็อก',
    description: 'สต็อกหมดแล้ว ต้องสั่งซื้อด่วนก่อนเริ่มงานป้ายไวนิล MegaStore',
    type: 'admin',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2026-03-16',
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2026-03-16',
    tags: ['สั่งซื้อ', 'สต็อก', 'ด่วน']
  },
  {
    id: 't5',
    title: 'ประชุม: Kick-off คาตาล็อกโรงแรม Royal Thai',
    description: 'นัดประชุมกับทีม Royal Thai Hotels เพื่อวางแนวทาง concept และ content',
    type: 'meeting',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-03-18',
    dueTime: '14:00',
    assignedTo: 'วันดี มีผล',
    relatedClientId: 'co10',
    relatedClientName: 'Royal Thai Hotels Group',
    relatedJobId: 'j15',
    relatedJobName: 'JOB-2026-015',
    createdAt: '2026-03-16',
    tags: ['ประชุม', 'kick-off']
  },
  {
    id: 't6',
    title: 'ส่งมอบ: แบนเนอร์ EventPro (JOB-2026-004)',
    description: 'จัดส่ง Roll-up Banner 15 ชุด ไปยังสถานที่จัดงาน',
    type: 'delivery',
    priority: 'urgent',
    status: 'in-progress',
    dueDate: '2026-03-17',
    dueTime: '08:00',
    assignedTo: 'ช่างพิมพ์ A',
    relatedClientId: 'co4',
    relatedClientName: 'EventPro Thailand',
    relatedJobId: 'j4',
    relatedJobName: 'JOB-2026-004',
    createdAt: '2026-03-15',
    tags: ['จัดส่ง', 'ด่วน']
  },
  {
    id: 't7',
    title: 'ออกแบบ Mock-up: คาตาล็อก BrandHouse',
    description: 'ทำ mock-up คาตาล็อก 48 หน้า ให้ลูกค้าตัดสินใจ',
    type: 'design',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-03-19',
    assignedTo: 'ช่างดีไซน์ B',
    relatedClientId: 'co2',
    relatedClientName: 'BrandHouse Agency',
    relatedQuoteId: 'q3',
    relatedQuoteName: 'QT-2026-003',
    createdAt: '2026-03-15',
    tags: ['ออกแบบ', 'mock-up']
  },
  {
    id: 't8',
    title: 'ส่ง Proof: ป้ายไวนิล MegaStore (JOB-2026-002)',
    description: 'ส่ง digital proof ให้ลูกค้าตรวจสอบและอนุมัติก่อนพิมพ์',
    type: 'approval',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2026-03-16',
    dueTime: '17:00',
    assignedTo: 'ช่างดีไซน์ B',
    relatedClientId: 'co3',
    relatedClientName: 'MegaStore Retail Group',
    relatedJobId: 'j2',
    relatedJobName: 'JOB-2026-002',
    createdAt: '2026-03-15',
    tags: ['proof', 'อนุมัติ', 'ด่วน']
  },
  {
    id: 't9',
    title: 'ติดตาม: BGH - ใบเสนอราคา Annual Report',
    description: 'ใบเสนอราคาส่งไป 10 วันแล้ว ยังไม่มีการตอบรับ',
    type: 'follow-up',
    priority: 'medium',
    status: 'overdue',
    dueDate: '2026-03-14',
    assignedTo: 'วันดี มีผล',
    relatedClientId: 'co5',
    relatedClientName: 'Bangkok General Hospital',
    relatedQuoteId: 'q5',
    relatedQuoteName: 'QT-2026-005',
    createdAt: '2026-03-10',
    tags: ['ติดตาม', 'เกินกำหนด']
  },
  {
    id: 't10',
    title: 'เตรียมงาน: ใบเสนอราคา TechStartup Hub',
    description: 'ลูกค้าใหม่ต้องการ quote สำหรับนามบัตรและ stationery ครบชุด',
    type: 'follow-up',
    priority: 'low',
    status: 'pending',
    dueDate: '2026-03-20',
    assignedTo: 'วันดี มีผล',
    relatedClientId: 'co9',
    relatedClientName: 'TechStartup Hub',
    createdAt: '2026-03-14',
    tags: ['ใบเสนอราคา', 'ลูกค้าใหม่']
  }
];
