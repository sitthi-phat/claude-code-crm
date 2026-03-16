import { mockContacts, mockCompanies, mockCommunications } from "@/lib/mock-data/clients";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building2, ArrowLeft, MessageCircle, Calendar, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const commTypeConfig = {
  email: { label: "อีเมล", color: "text-blue-400", bg: "bg-blue-400/10", icon: Mail },
  line: { label: "LINE", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: MessageCircle },
  call: { label: "โทรศัพท์", color: "text-amber-400", bg: "bg-amber-400/10", icon: Phone },
  meeting: { label: "ประชุม", color: "text-purple-400", bg: "bg-purple-400/10", icon: Calendar },
};

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const contact = mockContacts.find(c => c.id === params.id);
  if (!contact) notFound();

  const company = mockCompanies.find(co => co.contacts.some(c => c.id === contact.id));
  const communications = mockCommunications.filter(c => c.contactId === contact.id);

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <Link href="/contacts" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        กลับ
      </Link>

      {/* Contact Header */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground mb-1">{contact.name}</h1>
            <div className="text-sm text-muted-foreground mb-3">{contact.role}</div>

            {company && (
              <Link href={`/clients/${company.id}`}>
                <div className="flex items-center gap-2 text-sm text-primary hover:underline mb-3 w-fit">
                  <Building2 className="w-4 h-4" />
                  {company.name}
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4 text-blue-400" />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                <Phone className="w-4 h-4 text-emerald-400" />
                {contact.phone}
              </a>
              {contact.line && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  {contact.line}
                </div>
              )}
              {contact.lastContact && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  ติดต่อล่าสุด: {contact.lastContact}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="w-4 h-4" />
              อีเมล
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              โทร
            </Button>
          </div>
        </div>
      </Card>

      {/* Communication Log */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4.5 h-4.5 text-primary" />
            <h2 className="font-semibold text-foreground">ประวัติการสื่อสาร</h2>
            <Badge variant="secondary" className="text-xs">{communications.length}</Badge>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-7">บันทึกใหม่</Button>
        </div>

        {communications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            ยังไม่มีประวัติการสื่อสาร
          </div>
        ) : (
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />
            <div className="space-y-4">
              {communications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(comm => {
                const cConfig = commTypeConfig[comm.type];
                const CommIcon = cConfig.icon;
                return (
                  <div key={comm.id} className="flex items-start gap-4 relative">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-background z-10", cConfig.bg)}>
                      <CommIcon className={cn("w-4 h-4", cConfig.color)} />
                    </div>
                    <div className="flex-1 p-4 bg-secondary/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{comm.subject}</span>
                          <Badge className={cn("text-xs border-0", cConfig.bg, cConfig.color)}>{cConfig.label}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {comm.direction === "inbound" ? "รับ" : "ส่ง"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comm.date).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{comm.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
