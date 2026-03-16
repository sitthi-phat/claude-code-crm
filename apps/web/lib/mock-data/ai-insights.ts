export type InsightType = 'opportunity' | 'risk' | 'action' | 'alert' | 'recommendation';
export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AIInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  reasoning: string;
  suggestedActions: {
    label: string;
    action: string;
    icon?: string;
  }[];
  relatedEntity?: {
    type: 'client' | 'job' | 'quote' | 'inventory' | 'lead';
    id: string;
    name: string;
  };
  confidence: number;
  createdAt: string;
  dismissed?: boolean;
}

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'risk',
    priority: 'critical',
    title: 'งาน JOB-2026-002 มีความเสี่ยงล่าช้า',
    description: 'ป้ายไวนิล MegaStore ยังไม่ได้รับการอนุมัติ proof และหมึก Eco-solvent หมด - กำหนดส่ง 18 มี.ค. (อีก 2 วัน)',
    reasoning: 'วิเคราะห์จาก: (1) Proof ยังไม่ได้รับการอนุมัติ (2) วัตถุดิบหลักหมดสต็อก (3) กำหนดส่งเร่ง',
    suggestedActions: [
      { label: 'ส่ง Email ด่วน', action: 'draft_email', icon: 'mail' },
      { label: 'ส่ง LINE แจ้งลูกค้า', action: 'send_line', icon: 'message-circle' },
      { label: 'สั่งซื้อวัตถุดิบ', action: 'create_po', icon: 'shopping-cart' }
    ],
    relatedEntity: { type: 'job', id: 'j2', name: 'JOB-2026-002' },
    confidence: 94,
    createdAt: '2026-03-16T07:30:00'
  },
  {
    id: 'ai2',
    type: 'opportunity',
    priority: 'high',
    title: 'โอกาสขาย: Royal Thai Hotels ใกล้อนุมัติใบเสนอราคา',
    description: 'ลูกค้าเปิดอีเมลใบเสนอราคา 3 ครั้งในช่วง 24 ชั่วโมงที่ผ่านมา ประวัติการอนุมัติเฉลี่ย 5 วัน - ตอนนี้ครบ 1 วันแล้ว',
    reasoning: 'วิเคราะห์จากพฤติกรรมการเปิดอีเมลและ pattern การตัดสินใจของลูกค้ารายนี้ในอดีต',
    suggestedActions: [
      { label: 'โทรติดตาม', action: 'log_call', icon: 'phone' },
      { label: 'ส่ง Email ติดตาม', action: 'draft_email', icon: 'mail' },
      { label: 'ดูรายละเอียด Quote', action: 'view_quote', icon: 'file-text' }
    ],
    relatedEntity: { type: 'quote', id: 'q8', name: 'QT-2026-008' },
    confidence: 78,
    createdAt: '2026-03-16T08:00:00'
  },
  {
    id: 'ai3',
    type: 'alert',
    priority: 'critical',
    title: 'สต็อกวัตถุดิบวิกฤต 3 รายการ',
    description: 'หมึก Eco-solvent CMYK (หมดสต็อก), กระดาษ 300 แกรม (12 รีม), น้ำยาเคลือบมัน (5 ม้วน) - มีงานที่ต้องใช้ใน 7 วัน',
    reasoning: 'ตรวจสอบสต็อกเทียบกับงานที่รอผลิตใน production queue',
    suggestedActions: [
      { label: 'สั่งซื้อทั้งหมด', action: 'create_po', icon: 'shopping-cart' },
      { label: 'ดูรายงานสต็อก', action: 'view_inventory', icon: 'package' }
    ],
    confidence: 99,
    createdAt: '2026-03-16T07:00:00'
  },
  {
    id: 'ai4',
    type: 'recommendation',
    priority: 'medium',
    title: 'แนะนำ: ติดตาม BrandHouse - ไม่มีการสั่งซื้อ 6 สัปดาห์',
    description: 'BrandHouse Agency ปกติมีงานทุก 4-6 สัปดาห์ ตอนนี้เงียบผิดปกติ อาจกำลังเปรียบเทียบราคากับคู่แข่ง',
    reasoning: 'วิเคราะห์จากรูปแบบการสั่งงาน 12 เดือนที่ผ่านมา',
    suggestedActions: [
      { label: 'ร่างอีเมล Re-engagement', action: 'draft_email', icon: 'mail' },
      { label: 'เสนอโปรโมชั่น', action: 'create_offer', icon: 'tag' }
    ],
    relatedEntity: { type: 'client', id: 'co2', name: 'BrandHouse Agency' },
    confidence: 72,
    createdAt: '2026-03-15T10:00:00'
  },
  {
    id: 'ai5',
    type: 'opportunity',
    priority: 'medium',
    title: 'โอกาสขายต่อยอด: MegaStore ช่วง Songkran',
    description: 'ช่วงสงกรานต์ใกล้มาถึง ปีที่แล้ว MegaStore สั่งงานสื่อโปรโมชั่น ฿280,000 - แนะนำติดต่อก่อนล่วงหน้า 3 สัปดาห์',
    reasoning: 'วิเคราะห์จาก seasonal buying pattern ย้อนหลัง 2 ปี',
    suggestedActions: [
      { label: 'ส่ง Proposal', action: 'draft_email', icon: 'mail' },
      { label: 'นัดประชุม', action: 'schedule_meeting', icon: 'calendar' }
    ],
    relatedEntity: { type: 'client', id: 'co3', name: 'MegaStore Retail Group' },
    confidence: 85,
    createdAt: '2026-03-15T09:00:00'
  },
  {
    id: 'ai6',
    type: 'action',
    priority: 'high',
    title: 'ใบเสนอราคา QT-2026-005 ใกล้หมดอายุ',
    description: 'BGH Annual Report - ใบเสนอราคายังอยู่ในสถานะ Sent และจะหมดอายุใน 20 วัน มูลค่า ฿197,950',
    reasoning: 'ใบเสนอราคาหมดอายุ 5 เม.ย. และยังไม่มีการตอบรับจากลูกค้า',
    suggestedActions: [
      { label: 'ส่ง Reminder', action: 'draft_email', icon: 'bell' },
      { label: 'โทรติดตาม', action: 'log_call', icon: 'phone' },
      { label: 'ต่ออายุ Quote', action: 'renew_quote', icon: 'refresh-cw' }
    ],
    relatedEntity: { type: 'quote', id: 'q5', name: 'QT-2026-005' },
    confidence: 90,
    createdAt: '2026-03-15T08:00:00'
  }
];
