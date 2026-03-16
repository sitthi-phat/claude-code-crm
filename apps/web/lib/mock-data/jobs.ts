export type JobStage = 'pre-press' | 'printing' | 'finishing' | 'shipping' | 'done';
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface JobLineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PrintJob {
  id: string;
  jobNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  stage: JobStage;
  priority: JobPriority;
  dueDate: string;
  startDate: string;
  completedDate?: string;
  assignedTo: string;
  value: number;
  description: string;
  lineItems: JobLineItem[];
  notes?: string;
  tags: string[];
  proofApproved: boolean;
  filesReceived: boolean;
}

export const mockJobs: PrintJob[] = [
  {
    id: 'j1',
    jobNumber: 'JOB-2026-001',
    title: 'โบรชัวร์ประจำไตรมาส Q1',
    clientId: 'co1',
    clientName: 'Thai Print Solutions',
    stage: 'printing',
    priority: 'high',
    dueDate: '2026-03-20',
    startDate: '2026-03-10',
    assignedTo: 'ช่างพิมพ์ A',
    value: 85000,
    description: 'โบรชัวร์ A4 พับ 3 ตอน 4 สี ทั้ง 2 หน้า เคลือบมัน จำนวน 10,000 ชิ้น',
    lineItems: [
      { description: 'โบรชัวร์ A4 พับ 3 ตอน', quantity: 10000, unit: 'ชิ้น', unitPrice: 7.5, total: 75000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 8000, total: 8000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 2000, total: 2000 }
    ],
    tags: ['โบรชัวร์', 'Q1', 'งานประจำ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j2',
    jobNumber: 'JOB-2026-002',
    title: 'ป้ายไวนิล In-store Promotion',
    clientId: 'co3',
    clientName: 'MegaStore Retail Group',
    stage: 'pre-press',
    priority: 'urgent',
    dueDate: '2026-03-18',
    startDate: '2026-03-15',
    assignedTo: 'ช่างดีไซน์ B',
    value: 48500,
    description: 'ป้ายไวนิล 3x6 เมตร พิมพ์ Eco-solvent 20 ป้าย พร้อมติดตั้งห่วง',
    lineItems: [
      { description: 'ป้ายไวนิล 3x6 ม.', quantity: 20, unit: 'ป้าย', unitPrice: 2000, total: 40000 },
      { description: 'ค่าติดตั้งห่วงและตะขอ', quantity: 20, unit: 'ป้าย', unitPrice: 150, total: 3000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 5500, total: 5500 }
    ],
    tags: ['ป้าย', 'ไวนิล', 'ร้านค้า'],
    proofApproved: false,
    filesReceived: true
  },
  {
    id: 'j3',
    jobNumber: 'JOB-2026-003',
    title: 'นามบัตรผู้บริหาร',
    clientId: 'co2',
    clientName: 'BrandHouse Agency',
    stage: 'finishing',
    priority: 'normal',
    dueDate: '2026-03-22',
    startDate: '2026-03-12',
    assignedTo: 'ช่างพิมพ์ C',
    value: 12500,
    description: 'นามบัตร 90x55 มม. การ์ดหนา 350 แกรม เคลือบ UV เฉพาะจุด จำนวน 500 ใบ x 10 แบบ',
    lineItems: [
      { description: 'นามบัตร 350 แกรม เคลือบ UV', quantity: 5000, unit: 'ใบ', unitPrice: 2, total: 10000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 10, unit: 'แบบ', unitPrice: 250, total: 2500 }
    ],
    tags: ['นามบัตร', 'UV', 'ผู้บริหาร'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j4',
    jobNumber: 'JOB-2026-004',
    title: 'แบนเนอร์งานสัมมนา',
    clientId: 'co4',
    clientName: 'EventPro Thailand',
    stage: 'shipping',
    priority: 'urgent',
    dueDate: '2026-03-17',
    startDate: '2026-03-13',
    assignedTo: 'ช่างพิมพ์ A',
    value: 28000,
    description: 'แบนเนอร์ Roll-up 80x200 ซม. พร้อมขาตั้ง จำนวน 15 ชุด',
    lineItems: [
      { description: 'Roll-up Banner 80x200 ซม.', quantity: 15, unit: 'ชุด', unitPrice: 1500, total: 22500 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 5500, total: 5500 }
    ],
    tags: ['แบนเนอร์', 'อีเวนต์', 'งานเร่ง'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j5',
    jobNumber: 'JOB-2026-005',
    title: 'สมุดรายงานประจำปี 2025',
    clientId: 'co5',
    clientName: 'Bangkok General Hospital',
    stage: 'pre-press',
    priority: 'high',
    dueDate: '2026-04-05',
    startDate: '2026-03-15',
    assignedTo: 'ช่างดีไซน์ B',
    value: 185000,
    description: 'Annual Report 64 หน้า A4 4 สี ปกแข็ง เข้าเล่มไสกาว จำนวน 1,000 เล่ม',
    lineItems: [
      { description: 'Annual Report 64 หน้า ปกแข็ง', quantity: 1000, unit: 'เล่ม', unitPrice: 150, total: 150000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 25000, total: 25000 },
      { description: 'ค่าออกแบบและ Layout', quantity: 1, unit: 'งาน', unitPrice: 10000, total: 10000 }
    ],
    tags: ['รายงานประจำปี', 'ปกแข็ง', 'งานใหญ่'],
    proofApproved: false,
    filesReceived: false
  },
  {
    id: 'j6',
    jobNumber: 'JOB-2026-006',
    title: 'ปฏิทินตั้งโต๊ะ 2027',
    clientId: 'co3',
    clientName: 'MegaStore Retail Group',
    stage: 'printing',
    priority: 'normal',
    dueDate: '2026-04-15',
    startDate: '2026-03-20',
    assignedTo: 'ช่างพิมพ์ C',
    value: 245000,
    description: 'ปฏิทินตั้งโต๊ะ 13 แผ่น 4 สี ขนาด 21x15 ซม. เข้าเล่มแบบสปริง จำนวน 5,000 เล่ม',
    lineItems: [
      { description: 'ปฏิทินตั้งโต๊ะ 13 แผ่น', quantity: 5000, unit: 'เล่ม', unitPrice: 45, total: 225000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 15000, total: 15000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 5000, total: 5000 }
    ],
    tags: ['ปฏิทิน', 'ของขวัญ', 'งานประจำ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j7',
    jobNumber: 'JOB-2026-007',
    title: 'Lookbook คอลเลกชันฤดูร้อน',
    clientId: 'co7',
    clientName: 'FashionBrand Thailand',
    stage: 'pre-press',
    priority: 'high',
    dueDate: '2026-03-28',
    startDate: '2026-03-16',
    assignedTo: 'ช่างดีไซน์ B',
    value: 92000,
    description: 'Lookbook 32 หน้า A4 4 สี กระดาษอาร์ตการ์ด 150 แกรม เคลือบนาค จำนวน 2,000 เล่ม',
    lineItems: [
      { description: 'Lookbook 32 หน้า เคลือบนาค', quantity: 2000, unit: 'เล่ม', unitPrice: 40, total: 80000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 8000, total: 8000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 4000, total: 4000 }
    ],
    tags: ['Lookbook', 'แฟชั่น', 'เคลือบนาค'],
    proofApproved: false,
    filesReceived: true
  },
  {
    id: 'j8',
    jobNumber: 'JOB-2026-008',
    title: 'สติ๊กเกอร์ฉลากสินค้า',
    clientId: 'co8',
    clientName: 'Swift Logistics',
    stage: 'done',
    priority: 'normal',
    dueDate: '2026-03-10',
    startDate: '2026-03-05',
    completedDate: '2026-03-09',
    assignedTo: 'ช่างพิมพ์ A',
    value: 18500,
    description: 'สติ๊กเกอร์ฉลาก 5x8 ซม. กระดาษ art 4 สี กาวถาวร จำนวน 50,000 ชิ้น',
    lineItems: [
      { description: 'สติ๊กเกอร์ฉลาก 5x8 ซม.', quantity: 50000, unit: 'ชิ้น', unitPrice: 0.35, total: 17500 },
      { description: 'ค่าแม่พิมพ์', quantity: 1, unit: 'งาน', unitPrice: 1000, total: 1000 }
    ],
    tags: ['สติ๊กเกอร์', 'ฉลาก', 'งานเสร็จ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j9',
    jobNumber: 'JOB-2026-009',
    title: 'เอกสารประชาสัมพันธ์โรงเรียน',
    clientId: 'co6',
    clientName: 'Smart Academy School',
    stage: 'done',
    priority: 'normal',
    dueDate: '2026-03-08',
    startDate: '2026-03-01',
    completedDate: '2026-03-07',
    assignedTo: 'ช่างพิมพ์ C',
    value: 35000,
    description: 'โบรชัวร์รับสมัคร A5 2 ตอน 4 สี จำนวน 5,000 ชิ้น + ซองจดหมาย C6 จำนวน 2,000 ซอง',
    lineItems: [
      { description: 'โบรชัวร์ A5 2 ตอน', quantity: 5000, unit: 'ชิ้น', unitPrice: 5, total: 25000 },
      { description: 'ซองจดหมาย C6 พิมพ์โลโก้', quantity: 2000, unit: 'ซอง', unitPrice: 4, total: 8000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 2000, total: 2000 }
    ],
    tags: ['โรงเรียน', 'โบรชัวร์', 'งานเสร็จ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j10',
    jobNumber: 'JOB-2026-010',
    title: 'เมนูอาหารโรงแรม',
    clientId: 'co10',
    clientName: 'Royal Thai Hotels Group',
    stage: 'finishing',
    priority: 'normal',
    dueDate: '2026-03-25',
    startDate: '2026-03-10',
    assignedTo: 'ช่างพิมพ์ A',
    value: 142000,
    description: 'เมนูอาหาร A4 ปกแข็ง เคลือบ UV เฉพาะจุด ทนน้ำ 4 ภาษา จำนวน 500 เล่ม x 15 สาขา',
    lineItems: [
      { description: 'เมนูอาหาร ปกแข็ง UV เฉพาะจุด', quantity: 7500, unit: 'เล่ม', unitPrice: 18, total: 135000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 5000, total: 5000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 2000, total: 2000 }
    ],
    tags: ['โรงแรม', 'เมนู', 'ปกแข็ง'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j11',
    jobNumber: 'JOB-2026-011',
    title: 'ใบเสร็จและใบกำกับภาษี',
    clientId: 'co1',
    clientName: 'Thai Print Solutions',
    stage: 'printing',
    priority: 'low',
    dueDate: '2026-03-30',
    startDate: '2026-03-16',
    assignedTo: 'ช่างพิมพ์ C',
    value: 22000,
    description: 'ใบเสร็จรับเงิน NCR 3 ชั้น 50 ชุด/เล่ม จำนวน 100 เล่ม',
    lineItems: [
      { description: 'ใบเสร็จ NCR 3 ชั้น', quantity: 5000, unit: 'ชุด', unitPrice: 4, total: 20000 },
      { description: 'ค่าแม่พิมพ์', quantity: 1, unit: 'งาน', unitPrice: 2000, total: 2000 }
    ],
    tags: ['NCR', 'ใบเสร็จ', 'งานเอกสาร'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j12',
    jobNumber: 'JOB-2026-012',
    title: 'กล่องบรรจุภัณฑ์พรีเมียม',
    clientId: 'co7',
    clientName: 'FashionBrand Thailand',
    stage: 'done',
    priority: 'high',
    dueDate: '2026-03-05',
    startDate: '2026-02-20',
    completedDate: '2026-03-04',
    assignedTo: 'ช่างพิมพ์ A',
    value: 156000,
    description: 'กล่องบรรจุภัณฑ์ฝาครอบ 4 สี เคลือบนาค ปั๊มนูน โลโก้ จำนวน 3,000 กล่อง',
    lineItems: [
      { description: 'กล่องบรรจุภัณฑ์ เคลือบนาค ปั๊มนูน', quantity: 3000, unit: 'กล่อง', unitPrice: 48, total: 144000 },
      { description: 'ค่าแม่พิมพ์ตัด', quantity: 1, unit: 'งาน', unitPrice: 8000, total: 8000 },
      { description: 'ค่าแม่พิมพ์ปั๊มนูน', quantity: 1, unit: 'งาน', unitPrice: 4000, total: 4000 }
    ],
    tags: ['กล่อง', 'บรรจุภัณฑ์', 'พรีเมียม', 'งานเสร็จ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j13',
    jobNumber: 'JOB-2026-013',
    title: 'แผ่นพับแนะนำบริการ',
    clientId: 'co5',
    clientName: 'Bangkok General Hospital',
    stage: 'shipping',
    priority: 'normal',
    dueDate: '2026-03-19',
    startDate: '2026-03-08',
    assignedTo: 'ช่างพิมพ์ A',
    value: 42000,
    description: 'แผ่นพับ A4 พับ 3 ตอน 4 สี กระดาษอาร์ต 130 แกรม จำนวน 20,000 ชิ้น',
    lineItems: [
      { description: 'แผ่นพับ A4 พับ 3 ตอน', quantity: 20000, unit: 'ชิ้น', unitPrice: 1.8, total: 36000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 4000, total: 4000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 2000, total: 2000 }
    ],
    tags: ['แผ่นพับ', 'โรงพยาบาล', 'ข้อมูลบริการ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j14',
    jobNumber: 'JOB-2026-014',
    title: 'ป้ายชื่อและบัตรประจำตัว',
    clientId: 'co4',
    clientName: 'EventPro Thailand',
    stage: 'done',
    priority: 'normal',
    dueDate: '2026-03-14',
    startDate: '2026-03-10',
    completedDate: '2026-03-13',
    assignedTo: 'ช่างพิมพ์ C',
    value: 15500,
    description: 'ป้ายชื่องานสัมมนา พิมพ์ full color แบบสำเร็จรูป 150 ชิ้น + บัตรประจำตัว PVC 200 ใบ',
    lineItems: [
      { description: 'ป้ายชื่อ full color', quantity: 150, unit: 'ชิ้น', unitPrice: 45, total: 6750 },
      { description: 'บัตร PVC พิมพ์สี', quantity: 200, unit: 'ใบ', unitPrice: 35, total: 7000 },
      { description: 'ค่าออกแบบ', quantity: 1, unit: 'งาน', unitPrice: 1750, total: 1750 }
    ],
    tags: ['ป้ายชื่อ', 'บัตร PVC', 'อีเวนต์', 'งานเสร็จ'],
    proofApproved: true,
    filesReceived: true
  },
  {
    id: 'j15',
    jobNumber: 'JOB-2026-015',
    title: 'คาตาล็อกสินค้าประจำปี',
    clientId: 'co10',
    clientName: 'Royal Thai Hotels Group',
    stage: 'pre-press',
    priority: 'normal',
    dueDate: '2026-04-10',
    startDate: '2026-03-16',
    assignedTo: 'ช่างดีไซน์ B',
    value: 320000,
    description: 'คาตาล็อกบริการโรงแรม 96 หน้า A4 4 สี ปกแข็ง เคลือบ UV เฉพาะจุด จำนวน 2,000 เล่ม',
    lineItems: [
      { description: 'คาตาล็อก 96 หน้า ปกแข็ง', quantity: 2000, unit: 'เล่ม', unitPrice: 140, total: 280000 },
      { description: 'ค่าแยกสีและเพลท', quantity: 1, unit: 'งาน', unitPrice: 30000, total: 30000 },
      { description: 'ค่าออกแบบและ Layout', quantity: 1, unit: 'งาน', unitPrice: 10000, total: 10000 }
    ],
    tags: ['คาตาล็อก', 'โรงแรม', 'งานใหญ่'],
    proofApproved: false,
    filesReceived: false
  }
];
