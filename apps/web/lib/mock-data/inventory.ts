export type StockStatus = 'in-stock' | 'low-stock' | 'critical' | 'out-of-stock';

export interface Material {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  supplier: string;
  supplierId: string;
  location: string;
  lastUpdated: string;
  stockStatus: StockStatus;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  category: string[];
  paymentTerms: string;
  leadTimeDays: number;
  rating: number;
  status: 'active' | 'inactive';
  notes?: string;
}

export const mockSuppliers: Supplier[] = [
  {
    id: 's1',
    name: 'Paper World Co., Ltd.',
    contactName: 'คุณวิทยา กระดาษ',
    email: 'witaya@paperworld.co.th',
    phone: '02-111-2222',
    address: '100 ถ.บางนา-ตราด กม.5 กรุงเทพฯ',
    category: ['กระดาษ', 'บอร์ด'],
    paymentTerms: 'Net 30',
    leadTimeDays: 3,
    rating: 4.5,
    status: 'active',
    notes: 'ซัพพลายเออร์กระดาษหลัก มีสต็อกครบทุกประเภท'
  },
  {
    id: 's2',
    name: 'Ink Supply Thailand',
    contactName: 'คุณอนุชา หมึก',
    email: 'anucha@inksupply.co.th',
    phone: '02-333-4444',
    address: '200 ถ.พระราม 2 สมุทรสาคร',
    category: ['หมึกพิมพ์', 'สีพิมพ์'],
    paymentTerms: 'Net 15',
    leadTimeDays: 2,
    rating: 4.8,
    status: 'active',
    notes: 'ตัวแทนจำหน่าย Pantone และ CMYK ครบทุกสี'
  },
  {
    id: 's3',
    name: 'Film & Plate Solutions',
    contactName: 'คุณประชา แม่พิมพ์',
    email: 'pracha@filmplate.co.th',
    phone: '02-555-6666',
    address: '300 ถ.สุขสวัสดิ์ กรุงเทพฯ',
    category: ['แม่พิมพ์', 'ฟิล์ม', 'เพลท'],
    paymentTerms: 'Net 30',
    leadTimeDays: 5,
    rating: 4.2,
    status: 'active'
  },
  {
    id: 's4',
    name: 'Vinyl & Banner Store',
    contactName: 'คุณสมศักดิ์ ไวนิล',
    email: 'somsak@vinylstore.co.th',
    phone: '02-777-8888',
    address: '400 ถ.เอกชัย กรุงเทพฯ',
    category: ['ไวนิล', 'วัสดุพิมพ์กว้าง'],
    paymentTerms: 'Net 15',
    leadTimeDays: 2,
    rating: 4.0,
    status: 'active'
  },
  {
    id: 's5',
    name: 'Finishing Supplies Co.',
    contactName: 'คุณชวลิต เคลือบ',
    email: 'chawalit@finishing.co.th',
    phone: '02-999-0000',
    address: '500 ถ.ลาดกระบัง กรุงเทพฯ',
    category: ['น้ำยาเคลือบ', 'กาว', 'อุปกรณ์เข้าเล่ม'],
    paymentTerms: 'Net 30',
    leadTimeDays: 4,
    rating: 3.8,
    status: 'active'
  },
  {
    id: 's6',
    name: 'Packaging Materials Ltd.',
    contactName: 'คุณณรงค์ กล่อง',
    email: 'narong@packaging.co.th',
    phone: '02-112-3456',
    address: '600 ถ.มอเตอร์เวย์ สมุทรปราการ',
    category: ['กล่อง', 'บรรจุภัณฑ์'],
    paymentTerms: 'Net 45',
    leadTimeDays: 7,
    rating: 4.3,
    status: 'active'
  }
];

export const mockMaterials: Material[] = [
  {
    id: 'm1',
    name: 'กระดาษอาร์ต 130 แกรม A4',
    category: 'กระดาษ',
    sku: 'PAP-ART130-A4',
    unit: 'รีม',
    currentStock: 85,
    minStock: 50,
    maxStock: 200,
    unitCost: 450,
    supplier: 'Paper World Co., Ltd.',
    supplierId: 's1',
    location: 'คลัง A1',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm2',
    name: 'กระดาษอาร์ตการ์ด 150 แกรม A4',
    category: 'กระดาษ',
    sku: 'PAP-ARTCARD150-A4',
    unit: 'รีม',
    currentStock: 28,
    minStock: 30,
    maxStock: 150,
    unitCost: 580,
    supplier: 'Paper World Co., Ltd.',
    supplierId: 's1',
    location: 'คลัง A1',
    lastUpdated: '2026-03-14',
    stockStatus: 'low-stock',
    notes: 'สั่งเพิ่มด่วน ใช้กับงาน Lookbook'
  },
  {
    id: 'm3',
    name: 'กระดาษอาร์ต 300 แกรม (นามบัตร)',
    category: 'กระดาษ',
    sku: 'PAP-ART300-BC',
    unit: 'รีม',
    currentStock: 12,
    minStock: 20,
    maxStock: 100,
    unitCost: 750,
    supplier: 'Paper World Co., Ltd.',
    supplierId: 's1',
    location: 'คลัง A2',
    lastUpdated: '2026-03-13',
    stockStatus: 'critical',
    notes: 'วิกฤต! ต้องสั่งทันที'
  },
  {
    id: 'm4',
    name: 'หมึกพิมพ์ CMYK ชุด 4 สี (Offset)',
    category: 'หมึกพิมพ์',
    sku: 'INK-CMYK-OFFSET',
    unit: 'กก.',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitCost: 1200,
    supplier: 'Ink Supply Thailand',
    supplierId: 's2',
    location: 'คลัง B1',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm5',
    name: 'หมึกพิมพ์ Eco-solvent สีดำ',
    category: 'หมึกพิมพ์',
    sku: 'INK-ECO-BLK',
    unit: 'ลิตร',
    currentStock: 8,
    minStock: 10,
    maxStock: 50,
    unitCost: 2800,
    supplier: 'Ink Supply Thailand',
    supplierId: 's2',
    location: 'คลัง B2',
    lastUpdated: '2026-03-12',
    stockStatus: 'low-stock'
  },
  {
    id: 'm6',
    name: 'หมึกพิมพ์ Eco-solvent สี CMYK',
    category: 'หมึกพิมพ์',
    sku: 'INK-ECO-CMYK',
    unit: 'ลิตร',
    currentStock: 0,
    minStock: 8,
    maxStock: 40,
    unitCost: 3200,
    supplier: 'Ink Supply Thailand',
    supplierId: 's2',
    location: 'คลัง B2',
    lastUpdated: '2026-03-10',
    stockStatus: 'out-of-stock',
    notes: 'หมดสต็อก! รอสั่งซื้อ'
  },
  {
    id: 'm7',
    name: 'เพลทอะลูมิเนียม CTP',
    category: 'แม่พิมพ์',
    sku: 'PLT-CTP-ALU',
    unit: 'แผ่น',
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    unitCost: 185,
    supplier: 'Film & Plate Solutions',
    supplierId: 's3',
    location: 'คลัง C1',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm8',
    name: 'ไวนิลสติ๊กเกอร์ขาว (Vinyl White)',
    category: 'ไวนิล',
    sku: 'VNL-WHT-1M',
    unit: 'เมตร',
    currentStock: 180,
    minStock: 100,
    maxStock: 500,
    unitCost: 85,
    supplier: 'Vinyl & Banner Store',
    supplierId: 's4',
    location: 'คลัง D1',
    lastUpdated: '2026-03-14',
    stockStatus: 'in-stock'
  },
  {
    id: 'm9',
    name: 'ไวนิลแบนเนอร์ 440g Backlit',
    category: 'ไวนิล',
    sku: 'VNL-BNR-440',
    unit: 'เมตร',
    currentStock: 35,
    minStock: 50,
    maxStock: 300,
    unitCost: 95,
    supplier: 'Vinyl & Banner Store',
    supplierId: 's4',
    location: 'คลัง D1',
    lastUpdated: '2026-03-13',
    stockStatus: 'low-stock'
  },
  {
    id: 'm10',
    name: 'น้ำยาเคลือบ UV (UV Varnish)',
    category: 'น้ำยาเคลือบ',
    sku: 'FIN-UV-VAR',
    unit: 'ลิตร',
    currentStock: 22,
    minStock: 15,
    maxStock: 80,
    unitCost: 950,
    supplier: 'Finishing Supplies Co.',
    supplierId: 's5',
    location: 'คลัง E1',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm11',
    name: 'น้ำยาเคลือบมัน (Gloss Lamination)',
    category: 'น้ำยาเคลือบ',
    sku: 'FIN-GLOSS-LAM',
    unit: 'ม้วน',
    currentStock: 5,
    minStock: 8,
    maxStock: 40,
    unitCost: 1800,
    supplier: 'Finishing Supplies Co.',
    supplierId: 's5',
    location: 'คลัง E2',
    lastUpdated: '2026-03-11',
    stockStatus: 'critical'
  },
  {
    id: 'm12',
    name: 'สปริงเข้าเล่ม (Wire-O)',
    category: 'อุปกรณ์เข้าเล่ม',
    sku: 'BND-WIREO',
    unit: 'ม้วน',
    currentStock: 18,
    minStock: 10,
    maxStock: 60,
    unitCost: 280,
    supplier: 'Finishing Supplies Co.',
    supplierId: 's5',
    location: 'คลัง E3',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm13',
    name: 'กาวร้อน (Hot Melt Glue)',
    category: 'กาว',
    sku: 'ADH-HOTMELT',
    unit: 'กก.',
    currentStock: 32,
    minStock: 20,
    maxStock: 100,
    unitCost: 180,
    supplier: 'Finishing Supplies Co.',
    supplierId: 's5',
    location: 'คลัง E3',
    lastUpdated: '2026-03-14',
    stockStatus: 'in-stock'
  },
  {
    id: 'm14',
    name: 'กระดาษปอนด์ 80 แกรม A4',
    category: 'กระดาษ',
    sku: 'PAP-BOND80-A4',
    unit: 'รีม',
    currentStock: 200,
    minStock: 100,
    maxStock: 600,
    unitCost: 280,
    supplier: 'Paper World Co., Ltd.',
    supplierId: 's1',
    location: 'คลัง A3',
    lastUpdated: '2026-03-15',
    stockStatus: 'in-stock'
  },
  {
    id: 'm15',
    name: 'กระดาษ NCR 3 ชั้น (กระดาษไม่ใช้คาร์บอน)',
    category: 'กระดาษพิเศษ',
    sku: 'PAP-NCR3-A4',
    unit: 'รีม',
    currentStock: 15,
    minStock: 20,
    maxStock: 80,
    unitCost: 420,
    supplier: 'Paper World Co., Ltd.',
    supplierId: 's1',
    location: 'คลัง A4',
    lastUpdated: '2026-03-10',
    stockStatus: 'low-stock'
  }
];
