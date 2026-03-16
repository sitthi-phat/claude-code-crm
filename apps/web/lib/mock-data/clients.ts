export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  line?: string;
  avatar?: string;
  lastContact?: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'line' | 'call' | 'meeting';
  subject: string;
  summary: string;
  date: string;
  direction: 'inbound' | 'outbound';
  contactId: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  address: string;
  tier: 'enterprise' | 'mid-market' | 'smb';
  status: 'active' | 'inactive' | 'prospect';
  totalRevenue: number;
  contacts: Contact[];
  tags: string[];
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'สมชาย ใจดี',
    role: 'ผู้จัดการฝ่ายจัดซื้อ',
    email: 'somchai@thaiprint.co.th',
    phone: '081-234-5678',
    line: '@somchai_tp',
    lastContact: '2026-03-14'
  },
  {
    id: 'c2',
    name: 'วิภาวี รักสวย',
    role: 'ผู้อำนวยการการตลาด',
    email: 'wiphawi@brandhouse.th',
    phone: '089-876-5432',
    line: '@wiphawi_bh',
    lastContact: '2026-03-12'
  },
  {
    id: 'c3',
    name: 'ประสิทธิ์ มั่นคง',
    role: 'CEO',
    email: 'prasit@megastore.co.th',
    phone: '082-345-6789',
    lastContact: '2026-03-10'
  },
  {
    id: 'c4',
    name: 'นิภาพร สุขสันต์',
    role: 'ผู้จัดการโปรเจกต์',
    email: 'nipaporn@eventpro.th',
    phone: '083-456-7890',
    line: '@nipaporn_ep',
    lastContact: '2026-03-15'
  },
  {
    id: 'c5',
    name: 'ธนาธร วงษ์ศรี',
    role: 'ผู้จัดการฝ่ายบัญชี',
    email: 'thanathorn@thaiprint.co.th',
    phone: '084-567-8901',
    lastContact: '2026-03-08'
  },
  {
    id: 'c6',
    name: 'กนกวรรณ แสงทอง',
    role: 'Creative Director',
    email: 'kanok@brandhouse.th',
    phone: '085-678-9012',
    line: '@kanok_bh',
    lastContact: '2026-03-13'
  },
  {
    id: 'c7',
    name: 'ชัยวัฒน์ บุญมาก',
    role: 'ผู้จัดการสาขา',
    email: 'chaiwat@megastore.co.th',
    phone: '086-789-0123',
    lastContact: '2026-03-09'
  },
  {
    id: 'c8',
    name: 'พิมพ์ใจ ดอกไม้',
    role: 'Event Coordinator',
    email: 'pimjai@eventpro.th',
    phone: '087-890-1234',
    line: '@pimjai_event',
    lastContact: '2026-03-16'
  },
  {
    id: 'c9',
    name: 'สุรชัย ทองดี',
    role: 'ผู้จัดการฝ่ายขาย',
    email: 'surachai@hospital.or.th',
    phone: '088-901-2345',
    lastContact: '2026-03-11'
  },
  {
    id: 'c10',
    name: 'มาลี สมบูรณ์',
    role: 'ผู้อำนวยการ',
    email: 'malee@school.ac.th',
    phone: '089-012-3456',
    lastContact: '2026-03-07'
  },
  {
    id: 'c11',
    name: 'ณัฐพล จันทร์เพ็ญ',
    role: 'Brand Manager',
    email: 'natthapon@fashionbrand.co.th',
    phone: '081-111-2222',
    line: '@natthapon_fb',
    lastContact: '2026-03-14'
  },
  {
    id: 'c12',
    name: 'รัตนา พึ่งพา',
    role: 'ผู้จัดการโลจิสติกส์',
    email: 'rattana@logistics.co.th',
    phone: '082-222-3333',
    lastContact: '2026-03-05'
  }
];

export const mockCommunications: Communication[] = [
  {
    id: 'comm1',
    type: 'email',
    subject: 'ยืนยันคำสั่งซื้อ: โบรชัวร์ Q1 2026',
    summary: 'ลูกค้ายืนยันการสั่งพิมพ์โบรชัวร์ 10,000 ชิ้น ขนาด A4 พับ 3 ตอน ต้องการภายใน 15 มี.ค.',
    date: '2026-03-14T10:30:00',
    direction: 'inbound',
    contactId: 'c1'
  },
  {
    id: 'comm2',
    type: 'call',
    subject: 'หารือราคาและดีไซน์',
    summary: 'โทรคุยเรื่องราคาพิมพ์แคตตาล็อก ลูกค้าต้องการ full color 48 หน้า จำนวน 5,000 เล่ม ขอ mock-up ภายในสัปดาห์นี้',
    date: '2026-03-12T14:00:00',
    direction: 'outbound',
    contactId: 'c2'
  },
  {
    id: 'comm3',
    type: 'line',
    subject: 'ส่ง artwork ไฟล์สำหรับนามบัตร',
    summary: 'ลูกค้าส่งไฟล์ AI สำหรับนามบัตร 500 ใบ พร้อมขอแก้ไขสีให้ตรงกับ brand guideline',
    date: '2026-03-15T09:15:00',
    direction: 'inbound',
    contactId: 'c4'
  },
  {
    id: 'comm4',
    type: 'email',
    subject: 'ส่งใบเสนอราคา #QT-2026-042',
    summary: 'ส่งใบเสนอราคาป้ายไวนิลขนาด 3x6 เมตร จำนวน 20 ป้าย รวม 48,500 บาท รอการอนุมัติภายใน 7 วัน',
    date: '2026-03-10T11:00:00',
    direction: 'outbound',
    contactId: 'c3'
  },
  {
    id: 'comm5',
    type: 'meeting',
    subject: 'ประชุม Kick-off งานพิมพ์ประจำปี',
    summary: 'ประชุมวางแผนงานพิมพ์ทั้งปี ครอบคลุม: ปฏิทิน, ของขวัญปีใหม่, โบรชัวร์รายไตรมาส มูลค่ารวมประมาณ 1.2 ล้านบาท',
    date: '2026-03-08T09:00:00',
    direction: 'outbound',
    contactId: 'c5'
  },
  {
    id: 'comm6',
    type: 'line',
    subject: 'ตรวจสอบสีก่อนพิมพ์จริง',
    summary: 'ส่ง proof สีให้ลูกค้าตรวจสอบ รอการอนุมัติเพื่อเริ่มผลิต',
    date: '2026-03-13T16:30:00',
    direction: 'outbound',
    contactId: 'c6'
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'co1',
    name: 'Thai Print Solutions Co., Ltd.',
    industry: 'สื่อสิ่งพิมพ์',
    website: 'www.thaiprint.co.th',
    address: '123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    tier: 'enterprise',
    status: 'active',
    totalRevenue: 2850000,
    contacts: mockContacts.filter(c => c.id === 'c1' || c.id === 'c5'),
    tags: ['ลูกค้าประจำ', 'งานใหญ่', 'ชำระตรงเวลา'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2024-01-15',
    notes: 'ลูกค้าเก่าแก่ มีงานต่อเนื่องทุกไตรมาส'
  },
  {
    id: 'co2',
    name: 'BrandHouse Agency',
    industry: 'โฆษณาและการตลาด',
    website: 'www.brandhouse.th',
    address: '456 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
    tier: 'mid-market',
    status: 'active',
    totalRevenue: 1240000,
    contacts: mockContacts.filter(c => c.id === 'c2' || c.id === 'c6'),
    tags: ['เอเจนซี่', 'งานดีไซน์', 'ชำระบางครั้งล่าช้า'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2024-03-20'
  },
  {
    id: 'co3',
    name: 'MegaStore Retail Group',
    industry: 'ค้าปลีก',
    website: 'www.megastore.co.th',
    address: '789 ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210',
    tier: 'enterprise',
    status: 'active',
    totalRevenue: 3150000,
    contacts: mockContacts.filter(c => c.id === 'c3' || c.id === 'c7'),
    tags: ['ลูกค้าVIP', 'งานใหญ่', 'POS Materials'],
    assignedTo: 'วันดี มีผล',
    createdAt: '2023-11-05',
    notes: 'ต้องการงานเร่งบ่อยครั้ง มีงาน in-store materials ตลอดปี'
  },
  {
    id: 'co4',
    name: 'EventPro Thailand',
    industry: 'จัดงานอีเวนต์',
    website: 'www.eventpro.th',
    address: '321 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    tier: 'mid-market',
    status: 'active',
    totalRevenue: 875000,
    contacts: mockContacts.filter(c => c.id === 'c4' || c.id === 'c8'),
    tags: ['งานอีเวนต์', 'งานเร่ง', 'ป้ายแบนเนอร์'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2024-06-10'
  },
  {
    id: 'co5',
    name: 'Bangkok General Hospital',
    industry: 'สุขภาพ',
    website: 'www.bgh.or.th',
    address: '654 ถ.เพชรบุรี แขวงถนนเพชรบุรี เขตราชเทวี กรุงเทพฯ 10400',
    tier: 'enterprise',
    status: 'active',
    totalRevenue: 1680000,
    contacts: mockContacts.filter(c => c.id === 'c9'),
    tags: ['โรงพยาบาล', 'งานราชการ', 'สื่อสุขภาพ'],
    assignedTo: 'วันดี มีผล',
    createdAt: '2023-08-20',
    notes: 'ต้องผ่านกระบวนการจัดซื้อ ใช้เวลาอนุมัตินาน'
  },
  {
    id: 'co6',
    name: 'Smart Academy School',
    industry: 'การศึกษา',
    website: 'www.smartacademy.ac.th',
    address: '987 ถ.ลาดพร้าว แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
    tier: 'smb',
    status: 'active',
    totalRevenue: 420000,
    contacts: mockContacts.filter(c => c.id === 'c10'),
    tags: ['โรงเรียน', 'งานประจำปี', 'เอกสารการศึกษา'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2024-09-01'
  },
  {
    id: 'co7',
    name: 'FashionBrand Thailand',
    industry: 'แฟชั่นและเครื่องแต่งกาย',
    website: 'www.fashionbrand.co.th',
    address: '147 ถ.เอกมัย แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    tier: 'mid-market',
    status: 'active',
    totalRevenue: 965000,
    contacts: mockContacts.filter(c => c.id === 'c11'),
    tags: ['แฟชั่น', 'Lookbook', 'บรรจุภัณฑ์'],
    assignedTo: 'วันดี มีผล',
    createdAt: '2024-04-15'
  },
  {
    id: 'co8',
    name: 'Swift Logistics Co., Ltd.',
    industry: 'โลจิสติกส์',
    website: 'www.swiftlogistics.co.th',
    address: '258 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    tier: 'smb',
    status: 'active',
    totalRevenue: 285000,
    contacts: mockContacts.filter(c => c.id === 'c12'),
    tags: ['โลจิสติกส์', 'สติ๊กเกอร์', 'ฉลาก'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2025-01-10'
  },
  {
    id: 'co9',
    name: 'TechStartup Hub',
    industry: 'เทคโนโลยี',
    website: 'www.techstartuphub.co.th',
    address: '369 ถ.สุขุมวิท 101 แขวงบางจาก เขตพระโขนง กรุงเทพฯ 10260',
    tier: 'smb',
    status: 'prospect',
    totalRevenue: 0,
    contacts: [],
    tags: ['สตาร์ทอัพ', 'Prospect'],
    assignedTo: 'วันดี มีผล',
    createdAt: '2026-02-20'
  },
  {
    id: 'co10',
    name: 'Royal Thai Hotels Group',
    industry: 'โรงแรมและการท่องเที่ยว',
    website: 'www.royalthaihotels.com',
    address: '741 ถ.สาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    tier: 'enterprise',
    status: 'active',
    totalRevenue: 2100000,
    contacts: [],
    tags: ['โรงแรม', 'งานใหญ่', 'วัสดุสิ่งพิมพ์ต่อเนื่อง'],
    assignedTo: 'วันดี มีผล',
    createdAt: '2023-05-12',
    notes: 'ต้องการงานพิมพ์ประจำสำหรับทุกสาขา 15 แห่ง'
  },
  {
    id: 'co11',
    name: 'Organic Food Market',
    industry: 'อาหารและเครื่องดื่ม',
    website: 'www.organicfood.co.th',
    address: '852 ถ.อโศก แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    tier: 'smb',
    status: 'inactive',
    totalRevenue: 165000,
    contacts: [],
    tags: ['อาหาร', 'บรรจุภัณฑ์', 'ลูกค้าเก่า'],
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2024-02-28'
  }
];
