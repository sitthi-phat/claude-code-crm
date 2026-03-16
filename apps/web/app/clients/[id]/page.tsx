"use client";

import { useState } from "react";
import { mockCompanies, mockCommunications } from "@/lib/mock-data/clients";
import { mockJobs } from "@/lib/mock-data/jobs";
import { mockQuotes } from "@/lib/mock-data/quotes";
import { mockTasks } from "@/lib/mock-data/tasks";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, Mail, Phone, Globe, MapPin, Users,
  ArrowLeft, MessageCircle, FileText,
  Plus, Calendar, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NewContactModal } from "@/components/modals/NewContactModal";

const tierConfig = {
  enterprise: { label: "Platinum", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
  "mid-market": { label: "Gold", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  smb: { label: "Silver", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30" },
};

const statusConfig = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  inactive: { label: "Inactive", color: "text-slate-400", bg: "bg-slate-400/10" },
  prospect: { label: "Prospect", color: "text-amber-400", bg: "bg-amber-400/10" },
};

const quoteStatusConfig = {
  draft: { label: "ร่าง", color: "text-slate-400", bg: "bg-slate-400/10" },
  sent: { label: "ส่งแล้ว", color: "text-blue-400", bg: "bg-blue-400/10" },
  approved: { label: "อนุมัติ", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  rejected: { label: "ปฏิเสธ", color: "text-red-400", bg: "bg-red-400/10" },
  expired: { label: "หมดอายุ", color: "text-amber-400", bg: "bg-amber-400/10" },
};

const stageConfig = {
  "pre-press": { label: "Pre-press", color: "text-purple-400", bg: "bg-purple-400/10" },
  printing: { label: "Printing", color: "text-blue-400", bg: "bg-blue-400/10" },
  finishing: { label: "Finishing", color: "text-orange-400", bg: "bg-orange-400/10" },
  shipping: { label: "Shipping", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  done: { label: "Done", color: "text-slate-400", bg: "bg-slate-400/10" },
};

const priorityConfig = {
  low: { label: "ต่ำ", color: "text-slate-400" },
  normal: { label: "ปกติ", color: "text-blue-400" },
  high: { label: "สูง", color: "text-amber-400" },
  urgent: { label: "เร่งด่วน", color: "text-red-400" },
};

const commTypeConfig = {
  email: { label: "อีเมล", color: "text-blue-400", bg: "bg-blue-400/10", icon: Mail },
  line: { label: "LINE", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: MessageCircle },
  call: { label: "โทรศัพท์", color: "text-amber-400", bg: "bg-amber-400/10", icon: Phone },
  meeting: { label: "ประชุม", color: "text-purple-400", bg: "bg-purple-400/10", icon: Users },
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [addContactOpen, setAddContactOpen] = useState(false);
  const router = useRouter();
  const company = mockCompanies.find(c => c.id === params.id);
  if (!company) notFound();

  const companyJobs = mockJobs.filter(j => j.clientId === company.id);
  const activeJobs = companyJobs.filter(j => j.stage !== "done");
  const companyQuotes = mockQuotes.filter(q => q.clientId === company.id);
  const openQuotes = companyQuotes.filter(q => q.status === "sent" || q.status === "draft");
  const totalRevenue = companyQuotes.reduce((sum, q) => sum + q.total, 0);
  const contactComms = mockCommunications.filter(c =>
    company.contacts.some(contact => contact.id === c.contactId)
  );
  const relatedTasks = mockTasks.filter(t => t.relatedClientId === company.id);

  const tConfig = tierConfig[company.tier];
  const sConfig = statusConfig[company.status];

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link href="/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        กลับ
      </Link>

      {/* Company Header */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
                <Badge className={cn("border-0", tConfig.bg, tConfig.color)}>{tConfig.label}</Badge>
                <Badge className={cn("border-0", sConfig.bg, sConfig.color)}>{sConfig.label}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{company.industry}</span>
              </div>
              {company.website && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    {company.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{company.address}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">฿{(company.totalRevenue / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-muted-foreground">มูลค่ารวมทั้งหมด</div>
              <div className="text-sm text-muted-foreground mt-1">ดูแลโดย: {company.assignedTo}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setAddContactOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                เพิ่มผู้ติดต่อ
              </Button>
            </div>
          </div>
        </div>

        {company.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {company.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">ผู้ติดต่อ ({company.contacts.length})</TabsTrigger>
          <TabsTrigger value="quotes">ใบเสนอราคา ({companyQuotes.length})</TabsTrigger>
          <TabsTrigger value="jobs">งานผลิต ({companyJobs.length})</TabsTrigger>
          <TabsTrigger value="comms">การสื่อสาร ({contactComms.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Info Card */}
          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">ข้อมูลบริษัท</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">ที่อยู่</div>
                <div className="text-foreground">{company.address}</div>
              </div>
              {company.website && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">เว็บไซต์</div>
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{company.website}</a>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground mb-1">อุตสาหกรรม</div>
                <div className="text-foreground">{company.industry}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">วันที่เพิ่ม</div>
                <div className="text-foreground">{company.createdAt}</div>
              </div>
            </div>
            {company.notes && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
                {company.notes}
              </div>
            )}
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-emerald-400">
                ฿{(totalRevenue / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Revenue</div>
            </Card>
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-blue-400">{activeJobs.length}</div>
              <div className="text-xs text-muted-foreground mt-1">งาน Active</div>
            </Card>
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-amber-400">{openQuotes.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Open Quotes</div>
            </Card>
            <Card className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-purple-400">{company.contacts.length}</div>
              <div className="text-xs text-muted-foreground mt-1">ผู้ติดต่อ</div>
            </Card>
          </div>

          {/* Recent Activity */}
          {relatedTasks.length > 0 && (
            <Card className="p-5 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">กิจกรรมล่าสุด</h3>
              <div className="space-y-3">
                {relatedTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-start gap-3 text-sm">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      task.status === "completed" ? "bg-emerald-400" :
                        task.status === "overdue" ? "bg-red-400" :
                          task.status === "in-progress" ? "bg-blue-400" : "bg-amber-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground truncate">{task.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {task.dueDate} • {task.assignedTo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Contacts */}
        <TabsContent value="contacts" className="mt-4">
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">ผู้ติดต่อ ({company.contacts.length})</h3>
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddContactOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                เพิ่มผู้ติดต่อ
              </Button>
            </div>
            {company.contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                ยังไม่มีผู้ติดต่อ
              </div>
            ) : (
              <div className="space-y-3">
                {company.contacts.map(contact => (
                  <Link key={contact.id} href={`/contacts/${contact.id}`}>
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />{contact.email}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />{contact.phone}
                          </span>
                          {contact.line && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageCircle className="w-3 h-3" />{contact.line}
                            </span>
                          )}
                        </div>
                      </div>
                      {contact.lastContact && (
                        <div className="text-xs text-muted-foreground shrink-0">
                          <div>ติดต่อล่าสุด</div>
                          <div>{contact.lastContact}</div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 3: Quotations */}
        <TabsContent value="quotes" className="mt-4">
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">ใบเสนอราคา ({companyQuotes.length})</h3>
            </div>
            {companyQuotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">ยังไม่มีใบเสนอราคา</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs text-muted-foreground pb-3 font-medium">เลขที่</th>
                        <th className="text-left text-xs text-muted-foreground pb-3 font-medium">รายการ</th>
                        <th className="text-left text-xs text-muted-foreground pb-3 font-medium">วันที่สร้าง</th>
                        <th className="text-left text-xs text-muted-foreground pb-3 font-medium">หมดอายุ</th>
                        <th className="text-right text-xs text-muted-foreground pb-3 font-medium">มูลค่า (THB)</th>
                        <th className="text-center text-xs text-muted-foreground pb-3 font-medium">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {companyQuotes.map(quote => {
                        const qConfig = quoteStatusConfig[quote.status];
                        return (
                          <tr
                            key={quote.id}
                            className="hover:bg-secondary/30 transition-colors cursor-pointer"
                            onClick={() => router.push(`/sales/quotes/${quote.id}`)}
                          >
                            <td className="py-3 font-mono text-xs text-muted-foreground">{quote.quoteNumber}</td>
                            <td className="py-3 text-foreground max-w-[160px] truncate">{quote.lineItems[0]?.description}</td>
                            <td className="py-3 text-muted-foreground">{quote.createdDate}</td>
                            <td className="py-3 text-muted-foreground">{quote.validUntil}</td>
                            <td className="py-3 text-right font-semibold text-foreground">฿{quote.total.toLocaleString()}</td>
                            <td className="py-3 text-center">
                              <Badge className={cn("text-xs border-0", qConfig.bg, qConfig.color)}>
                                {qConfig.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pipeline รวม</span>
                  <span className="font-bold text-emerald-400">
                    ฿{companyQuotes.reduce((s, q) => s + q.total, 0).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </Card>
        </TabsContent>

        {/* Tab 4: Production Jobs */}
        <TabsContent value="jobs" className="mt-4">
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">งานผลิต ({companyJobs.length})</h3>
            </div>
            {companyJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">ยังไม่มีงาน</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-muted-foreground pb-3 font-medium">เลขงาน</th>
                      <th className="text-left text-xs text-muted-foreground pb-3 font-medium">ชื่องาน</th>
                      <th className="text-left text-xs text-muted-foreground pb-3 font-medium">Stage</th>
                      <th className="text-left text-xs text-muted-foreground pb-3 font-medium">กำหนดส่ง</th>
                      <th className="text-left text-xs text-muted-foreground pb-3 font-medium">Priority</th>
                      <th className="text-right text-xs text-muted-foreground pb-3 font-medium">มูลค่า</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {companyJobs.map(job => {
                      const stConfig = stageConfig[job.stage];
                      const prConfig = priorityConfig[job.priority];
                      return (
                        <tr
                          key={job.id}
                          className="hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => router.push(`/production/${job.id}`)}
                        >
                          <td className="py-3 font-mono text-xs text-muted-foreground">{job.jobNumber}</td>
                          <td className="py-3 text-foreground max-w-[180px] truncate">{job.title}</td>
                          <td className="py-3">
                            <Badge className={cn("text-xs border-0", stConfig.bg, stConfig.color)}>
                              {stConfig.label}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {job.dueDate}
                            </span>
                          </td>
                          <td className={cn("py-3 text-xs font-medium", prConfig.color)}>{prConfig.label}</td>
                          <td className="py-3 text-right font-semibold text-emerald-400">฿{(job.value / 1000).toFixed(0)}K</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 5: Communication */}
        <TabsContent value="comms" className="mt-4">
          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">ประวัติการสื่อสาร ({contactComms.length})</h3>
            {contactComms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">ยังไม่มีประวัติการสื่อสาร</div>
            ) : (
              <div className="space-y-3">
                {contactComms.map(comm => {
                  const cConfig = commTypeConfig[comm.type];
                  const CommIcon = cConfig.icon;
                  return (
                    <div key={comm.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", cConfig.bg)}>
                        <CommIcon className={cn("w-4 h-4", cConfig.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{comm.subject}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(comm.date).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{comm.summary}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={cn("text-xs border-0", cConfig.bg, cConfig.color)}>{cConfig.label}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {comm.direction === "inbound" ? "รับ" : "ส่ง"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <NewContactModal
        open={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        defaultCompanyId={company.id}
      />
    </div>
  );
}
