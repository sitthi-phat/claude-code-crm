import { mockCompanies, mockCommunications } from "@/lib/mock-data/clients";
import { mockJobs } from "@/lib/mock-data/jobs";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Globe, MapPin, Users, TrendingUp, Printer, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tierConfig = {
  enterprise: { label: "Enterprise", color: "text-purple-400", bg: "bg-purple-400/10" },
  "mid-market": { label: "Mid-Market", color: "text-blue-400", bg: "bg-blue-400/10" },
  smb: { label: "SMB", color: "text-slate-400", bg: "bg-slate-400/10" },
};

const statusConfig = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  inactive: { label: "Inactive", color: "text-slate-400", bg: "bg-slate-400/10" },
  prospect: { label: "Prospect", color: "text-amber-400", bg: "bg-amber-400/10" },
};

const commTypeConfig = {
  email: { label: "อีเมล", color: "text-blue-400", bg: "bg-blue-400/10", icon: Mail },
  line: { label: "LINE", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: MessageCircle },
  call: { label: "โทรศัพท์", color: "text-amber-400", bg: "bg-amber-400/10", icon: Phone },
  meeting: { label: "ประชุม", color: "text-purple-400", bg: "bg-purple-400/10", icon: Users },
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const company = mockCompanies.find(c => c.id === params.id);
  if (!company) notFound();

  const companyJobs = mockJobs.filter(j => j.clientId === company.id);
  const activeJobs = companyJobs.filter(j => j.stage !== "done");
  const completedJobs = companyJobs.filter(j => j.stage === "done");
  const contactComms = mockCommunications.filter(c =>
    company.contacts.some(contact => contact.id === c.contactId)
  );

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
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
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
                  <a href={`https://${company.website}`} className="text-primary hover:underline">{company.website}</a>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{company.address}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">฿{(company.totalRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground">มูลค่ารวมทั้งหมด</div>
            <div className="text-sm text-muted-foreground mt-1">ดูแลโดย: {company.assignedTo}</div>
          </div>
        </div>

        {company.notes && (
          <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
            {company.notes}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {company.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-blue-400">{activeJobs.length}</div>
          <div className="text-xs text-muted-foreground mt-1">งาน Active</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-emerald-400">{completedJobs.length}</div>
          <div className="text-xs text-muted-foreground mt-1">งานเสร็จ</div>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <div className="text-2xl font-bold text-purple-400">{company.contacts.length}</div>
          <div className="text-xs text-muted-foreground mt-1">ผู้ติดต่อ</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Contacts */}
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-semibold text-foreground">ผู้ติดต่อ</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7">เพิ่มผู้ติดต่อ</Button>
          </div>
          <div className="space-y-3">
            {company.contacts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีผู้ติดต่อ</p>
            )}
            {company.contacts.map(contact => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-blue-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-emerald-400 transition-colors">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Jobs */}
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Printer className="w-4.5 h-4.5 text-primary" />
              <h2 className="font-semibold text-foreground">งานล่าสุด</h2>
            </div>
            <Link href="/production">
              <Button variant="outline" size="sm" className="text-xs h-7">ดูทั้งหมด</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {companyJobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีงาน</p>
            )}
            {companyJobs.slice(0, 5).map(job => (
              <Link key={job.id} href={`/production/${job.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-all cursor-pointer">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    job.stage === "done" ? "bg-emerald-400" : job.priority === "urgent" ? "bg-red-400" : "bg-blue-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground truncate">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.jobNumber} • ครบ {job.dueDate}</div>
                  </div>
                  <div className="text-sm font-medium text-emerald-400 shrink-0">฿{(job.value / 1000).toFixed(0)}K</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Communication History */}
      {contactComms.length > 0 && (
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4.5 h-4.5 text-primary" />
            <h2 className="font-semibold text-foreground">ประวัติการสื่อสาร</h2>
          </div>
          <div className="space-y-3">
            {contactComms.map(comm => {
              const cConfig = commTypeConfig[comm.type];
              const CommIcon = cConfig.icon;
              return (
                <div key={comm.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cConfig.bg)}>
                    <CommIcon className={cn("w-4 h-4", cConfig.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comm.subject}</span>
                      <span className="text-xs text-muted-foreground">{new Date(comm.date).toLocaleDateString("th-TH")}</span>
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
        </Card>
      )}
    </div>
  );
}
