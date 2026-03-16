export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface QuoteLineItem {
  id: string;
  description: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  contactName: string;
  status: QuoteStatus;
  createdDate: string;
  validUntil: string;
  sentDate?: string;
  approvedDate?: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
  terms?: string;
  assignedTo: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  value: number;
  status: 'won' | 'lost';
  closeDate: string;
  quoteId?: string;
  reason?: string;
  assignedTo: string;
}

export const mockQuotes: Quote[] = [
  {
    id: 'q1',
    quoteNumber: 'QT-2026-001',
    clientId: 'co1',
    clientName: 'Thai Print Solutions',
    contactName: 'สมชาย ใจดี',
    status: 'approved',
    createdDate: '2026-03-01',
    validUntil: '2026-03-31',
    sentDate: '2026-03-02',
    approvedDate: '2026-03-05',
    lineItems: [
      {
        id: 'ql1',
        description: 'โบรชัวร์ A4 พับ 3 ตอน',
        specification: '4 สี ทั้ง 2 หน้า กระดาษอาร์ต 130 แกรม เคลือบมัน',
        quantity: 10000,
        unit: 'ชิ้น',
        unitPrice: 7.5,
        discount: 0,
        total: 75000
      },
      {
        id: 'ql2',
        description: 'ค่าแยกสีและเพลท',
        specification: '4 สี 2 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 8000,
        discount: 0,
        total: 8000
      },
      {
        id: 'ql3',
        description: 'ค่าออกแบบ',
        specification: 'จำนวน 1 แบบ',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 2000,
        discount: 0,
        total: 2000
      }
    ],
    subtotal: 85000,
    vat: 5950,
    total: 90950,
    notes: 'ราคานี้รวมค่าจัดส่งภายใน กทม.',
    terms: 'ชำระเงิน 50% ก่อนผลิต ยอดที่เหลือเมื่อรับงาน',
    assignedTo: 'สมหมาย ขายดี'
  },
  {
    id: 'q2',
    quoteNumber: 'QT-2026-002',
    clientId: 'co3',
    clientName: 'MegaStore Retail Group',
    contactName: 'ประสิทธิ์ มั่นคง',
    status: 'sent',
    createdDate: '2026-03-08',
    validUntil: '2026-03-22',
    sentDate: '2026-03-09',
    lineItems: [
      {
        id: 'ql4',
        description: 'ป้ายไวนิล 3x6 เมตร',
        specification: 'พิมพ์ Eco-solvent ทนแดดทนฝน',
        quantity: 20,
        unit: 'ป้าย',
        unitPrice: 2000,
        discount: 5,
        total: 38000
      },
      {
        id: 'ql5',
        description: 'ค่าติดตั้งห่วงและตะขอ',
        specification: 'ห่วงสแตนเลส ทุก 50 ซม.',
        quantity: 20,
        unit: 'ป้าย',
        unitPrice: 150,
        discount: 0,
        total: 3000
      },
      {
        id: 'ql6',
        description: 'ค่าออกแบบ',
        specification: '20 แบบ (แก้ไขได้ 3 ครั้ง)',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 8000,
        discount: 0,
        total: 8000
      }
    ],
    subtotal: 49000,
    vat: 3430,
    total: 52430,
    notes: 'ราคาพิเศษสำหรับลูกค้าประจำ ลด 5% สำหรับป้ายไวนิล',
    terms: 'ชำระเงิน 100% ก่อนผลิต',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'q3',
    quoteNumber: 'QT-2026-003',
    clientId: 'co2',
    clientName: 'BrandHouse Agency',
    contactName: 'วิภาวี รักสวย',
    status: 'draft',
    createdDate: '2026-03-10',
    validUntil: '2026-03-24',
    lineItems: [
      {
        id: 'ql7',
        description: 'คาตาล็อกสินค้า A4',
        specification: '4 สี 48 หน้า กระดาษอาร์ตการ์ด 150 แกรม ปกแข็ง',
        quantity: 5000,
        unit: 'เล่ม',
        unitPrice: 60,
        discount: 0,
        total: 300000
      },
      {
        id: 'ql8',
        description: 'ค่าแยกสีและเพลท',
        specification: '4 สี 48 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 40000,
        discount: 0,
        total: 40000
      }
    ],
    subtotal: 340000,
    vat: 23800,
    total: 363800,
    notes: 'รอ artwork จากลูกค้าก่อนยืนยันราคา',
    terms: 'ชำระเงิน 50% ก่อนผลิต ยอดที่เหลือเมื่อรับงาน',
    assignedTo: 'สมหมาย ขายดี'
  },
  {
    id: 'q4',
    quoteNumber: 'QT-2026-004',
    clientId: 'co4',
    clientName: 'EventPro Thailand',
    contactName: 'นิภาพร สุขสันต์',
    status: 'approved',
    createdDate: '2026-03-12',
    validUntil: '2026-03-19',
    sentDate: '2026-03-12',
    approvedDate: '2026-03-13',
    lineItems: [
      {
        id: 'ql9',
        description: 'Roll-up Banner 80x200 ซม.',
        specification: 'พิมพ์ full color พร้อมขาตั้งอลูมิเนียม',
        quantity: 15,
        unit: 'ชุด',
        unitPrice: 1500,
        discount: 0,
        total: 22500
      },
      {
        id: 'ql10',
        description: 'ค่าออกแบบ',
        specification: '15 แบบ',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 5500,
        discount: 0,
        total: 5500
      }
    ],
    subtotal: 28000,
    vat: 1960,
    total: 29960,
    assignedTo: 'สมหมาย ขายดี'
  },
  {
    id: 'q5',
    quoteNumber: 'QT-2026-005',
    clientId: 'co5',
    clientName: 'Bangkok General Hospital',
    contactName: 'สุรชัย ทองดี',
    status: 'sent',
    createdDate: '2026-03-05',
    validUntil: '2026-04-05',
    sentDate: '2026-03-06',
    lineItems: [
      {
        id: 'ql11',
        description: 'Annual Report 64 หน้า',
        specification: '4 สี ปกแข็ง เข้าเล่มไสกาว กระดาษอาร์ต 130 แกรม',
        quantity: 1000,
        unit: 'เล่ม',
        unitPrice: 150,
        discount: 0,
        total: 150000
      },
      {
        id: 'ql12',
        description: 'ค่าแยกสีและเพลท',
        specification: '4 สี 64 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 25000,
        discount: 0,
        total: 25000
      },
      {
        id: 'ql13',
        description: 'ค่าออกแบบและ Layout',
        specification: 'จำนวน 64 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 10000,
        discount: 0,
        total: 10000
      }
    ],
    subtotal: 185000,
    vat: 12950,
    total: 197950,
    notes: 'ราคานี้ยังไม่รวมค่าถ่ายภาพ',
    terms: 'ชำระตามงวดงาน 3 งวด',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'q6',
    quoteNumber: 'QT-2026-006',
    clientId: 'co9',
    clientName: 'TechStartup Hub',
    contactName: '-',
    status: 'rejected',
    createdDate: '2026-02-20',
    validUntil: '2026-03-06',
    sentDate: '2026-02-21',
    lineItems: [
      {
        id: 'ql14',
        description: 'นามบัตรพนักงาน',
        specification: '4 สี 2 หน้า การ์ด 300 แกรม',
        quantity: 2000,
        unit: 'ใบ',
        unitPrice: 3,
        discount: 0,
        total: 6000
      }
    ],
    subtotal: 6000,
    vat: 420,
    total: 6420,
    notes: 'ลูกค้าแจ้งว่าราคาสูงกว่าที่อื่น',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'q7',
    quoteNumber: 'QT-2026-007',
    clientId: 'co7',
    clientName: 'FashionBrand Thailand',
    contactName: 'ณัฐพล จันทร์เพ็ญ',
    status: 'approved',
    createdDate: '2026-03-14',
    validUntil: '2026-03-28',
    sentDate: '2026-03-14',
    approvedDate: '2026-03-15',
    lineItems: [
      {
        id: 'ql15',
        description: 'Lookbook 32 หน้า',
        specification: '4 สี กระดาษอาร์ตการ์ด 150 แกรม เคลือบนาค',
        quantity: 2000,
        unit: 'เล่ม',
        unitPrice: 40,
        discount: 0,
        total: 80000
      },
      {
        id: 'ql16',
        description: 'ค่าแยกสีและเพลท',
        specification: '4 สี 32 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 8000,
        discount: 0,
        total: 8000
      },
      {
        id: 'ql17',
        description: 'ค่าออกแบบ',
        specification: 'Lookbook concept',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 4000,
        discount: 0,
        total: 4000
      }
    ],
    subtotal: 92000,
    vat: 6440,
    total: 98440,
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'q8',
    quoteNumber: 'QT-2026-008',
    clientId: 'co10',
    clientName: 'Royal Thai Hotels Group',
    contactName: '-',
    status: 'draft',
    createdDate: '2026-03-16',
    validUntil: '2026-03-30',
    lineItems: [
      {
        id: 'ql18',
        description: 'คาตาล็อกบริการโรงแรม 96 หน้า',
        specification: '4 สี ปกแข็ง เคลือบ UV เฉพาะจุด',
        quantity: 2000,
        unit: 'เล่ม',
        unitPrice: 140,
        discount: 0,
        total: 280000
      },
      {
        id: 'ql19',
        description: 'ค่าแยกสีและเพลท',
        specification: '4 สี 96 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 30000,
        discount: 0,
        total: 30000
      },
      {
        id: 'ql20',
        description: 'ค่าออกแบบและ Layout',
        specification: '96 หน้า',
        quantity: 1,
        unit: 'งาน',
        unitPrice: 10000,
        discount: 0,
        total: 10000
      }
    ],
    subtotal: 320000,
    vat: 22400,
    total: 342400,
    assignedTo: 'วันดี มีผล'
  }
];

export const mockLeads = [
  {
    id: 'l1',
    companyName: 'TechStartup Hub',
    contactName: 'อาณัติ ดิจิทัล',
    email: 'aanat@techstartuphub.co.th',
    phone: '081-999-0000',
    source: 'LinkedIn',
    status: 'new',
    estimatedValue: 50000,
    assignedTo: 'วันดี มีผล',
    createdAt: '2026-02-20',
    notes: 'ต้องการนามบัตรและสื่อพิมพ์สำหรับทีม 50 คน'
  },
  {
    id: 'l2',
    companyName: 'Green Energy Co.',
    contactName: 'สิริ พลังงาน',
    email: 'siri@greenenergy.co.th',
    phone: '082-888-1111',
    source: 'Referral',
    status: 'contacted',
    estimatedValue: 180000,
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2026-03-01',
    notes: 'บริษัทพลังงานทางเลือก ต้องการรายงานประจำปีและสื่อ CSR'
  },
  {
    id: 'l3',
    companyName: 'Foodie Restaurant Group',
    contactName: 'เชฟ กริน',
    email: 'chef@foodiegroup.co.th',
    phone: '083-777-2222',
    source: 'Walk-in',
    status: 'qualified',
    estimatedValue: 75000,
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2026-03-05',
    notes: 'ร้านอาหาร 8 สาขา ต้องการเมนูและ signage ครบชุด'
  },
  {
    id: 'l4',
    companyName: 'Pharma Distribution Ltd.',
    contactName: 'ดร.ศุภกิจ',
    email: 'suphakij@pharma.co.th',
    phone: '084-666-3333',
    source: 'Exhibition',
    status: 'proposal',
    estimatedValue: 250000,
    assignedTo: 'วันดี มีผล',
    createdAt: '2026-03-10',
    notes: 'พบในงาน THAIFEX ต้องการ brochure ผลิตภัณฑ์และ package insert'
  },
  {
    id: 'l5',
    companyName: 'Beauty Paradise Salon',
    contactName: 'คุณมี้',
    email: 'me@beautyparadise.co.th',
    phone: '085-555-4444',
    source: 'Instagram',
    status: 'new',
    estimatedValue: 35000,
    assignedTo: 'สมหมาย ขายดี',
    createdAt: '2026-03-14',
    notes: 'ร้านเสริมสวย ต้องการ menu และ price list แบบสวยงาม'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    title: 'งานพิมพ์ประจำปี 2026 - Thai Print Solutions',
    clientId: 'co1',
    clientName: 'Thai Print Solutions',
    value: 850000,
    status: 'won',
    closeDate: '2026-01-15',
    quoteId: 'q1',
    assignedTo: 'สมหมาย ขายดี'
  },
  {
    id: 'd2',
    title: 'แคมเปญ Summer Sale - MegaStore',
    clientId: 'co3',
    clientName: 'MegaStore Retail Group',
    value: 320000,
    status: 'won',
    closeDate: '2026-02-01',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'd3',
    title: 'Annual Report 2025 - BGH',
    clientId: 'co5',
    clientName: 'Bangkok General Hospital',
    value: 185000,
    status: 'won',
    closeDate: '2026-03-05',
    quoteId: 'q5',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'd4',
    title: 'Lookbook Collection - FashionBrand',
    clientId: 'co7',
    clientName: 'FashionBrand Thailand',
    value: 92000,
    status: 'won',
    closeDate: '2026-03-15',
    quoteId: 'q7',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'd5',
    title: 'นามบัตร - TechStartup Hub',
    clientId: 'co9',
    clientName: 'TechStartup Hub',
    value: 6000,
    status: 'lost',
    closeDate: '2026-03-06',
    quoteId: 'q6',
    reason: 'ราคาสูงกว่าคู่แข่ง',
    assignedTo: 'วันดี มีผล'
  },
  {
    id: 'd6',
    title: 'Hotel Menu Reprint - Royal Thai',
    clientId: 'co10',
    clientName: 'Royal Thai Hotels Group',
    value: 142000,
    status: 'won',
    closeDate: '2026-03-10',
    assignedTo: 'วันดี มีผล'
  }
];
