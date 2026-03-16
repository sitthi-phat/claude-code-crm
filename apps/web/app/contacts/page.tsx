"use client";

import { useState } from "react";
import { mockContacts, mockCompanies } from "@/lib/mock-data/clients";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Search, Plus, Mail, Phone, Building2, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getCompany = (contactId: string) =>
    mockCompanies.find(co => co.contacts.some(c => c.id === contactId));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ผู้ติดต่อทั้งหมด</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockContacts.length} รายชื่อ</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          เพิ่มผู้ติดต่อ
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาชื่อ ตำแหน่ง อีเมล..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(contact => {
          const company = getCompany(contact.id);
          return (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
              <Card className="p-4 bg-card border-border hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {contact.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{contact.role}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>

                {company && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{company.name}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-400 transition-colors">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-400 transition-colors">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{contact.phone}</span>
                  </a>
                  {contact.line && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageCircle className="w-3 h-3 shrink-0" />
                      <span>{contact.line}</span>
                    </div>
                  )}
                </div>

                {contact.lastContact && (
                  <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    ติดต่อล่าสุด: {contact.lastContact}
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">ไม่พบผู้ติดต่อที่ค้นหา</div>
      )}
    </div>
  );
}
