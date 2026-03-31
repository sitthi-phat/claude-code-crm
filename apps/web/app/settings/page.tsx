"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Plug,
  Shield,
  UserPlus,
  UserX,
  UserCheck,
  Lock,
  KeyRound,
  Mail,
  Check,
  X,
  MessageCircle,
  Webhook,
  Globe,
  Key,
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { mockRoles, mockUsers, mockInvitations } from "@/lib/mock-data/users";
import { AuthUser, Invitation, Role, MenuPermissions, PermissionLevel } from "@/lib/auth/types";
import { InviteUserModal } from "@/components/modals/InviteUserModal";

// ----------------------------------------------------------
// Local state helpers
// ----------------------------------------------------------

const PERM_LEVELS: PermissionLevel[] = ['none', 'view', 'edit', 'full'];
const MENU_SECTIONS: { key: keyof MenuPermissions; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'clients', label: 'Clients & Contacts' },
  { key: 'sales', label: 'Sales Pipeline' },
  { key: 'production', label: 'Production & Jobs' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'automation', label: 'Automation & AI' },
  { key: 'settings', label: 'Settings / Admin' },
];

const PERM_COLORS: Record<PermissionLevel, string> = {
  none: 'bg-slate-400/10 text-slate-400',
  view: 'bg-blue-400/10 text-blue-400',
  edit: 'bg-amber-400/10 text-amber-400',
  full: 'bg-emerald-400/10 text-emerald-400',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-400/10 text-emerald-400',
  pending: 'bg-amber-400/10 text-amber-400',
  disabled: 'bg-slate-400/10 text-slate-400',
};

const INVITATION_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-400/10 text-amber-400',
  accepted: 'bg-emerald-400/10 text-emerald-400',
  expired: 'bg-slate-400/10 text-slate-400',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ----------------------------------------------------------
// Sub-components
// ----------------------------------------------------------

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onCancel(); }}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" onClick={onCancel} className="border-border">Cancel</Button>
          <Button
            onClick={onConfirm}
            className={confirmVariant === 'destructive' ? 'bg-destructive hover:bg-destructive/80 text-destructive-foreground' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------
// Users Sub-tab
// ----------------------------------------------------------

function UsersTab({
  users,
  currentUserId,
  onDisable,
  onEnable,
  onDelete,
  onResendInvite,
  onCancelInvite,
  onInvite,
}: {
  users: AuthUser[];
  currentUserId: string;
  onDisable: (id: string) => void;
  onEnable: (id: string) => void;
  onDelete: (id: string) => void;
  onResendInvite: (id: string) => void;
  onCancelInvite: (id: string) => void;
  onInvite: () => void;
}) {
  const [confirmAction, setConfirmAction] = useState<{
    type: 'disable' | 'enable' | 'delete' | 'cancelInvite';
    userId: string;
    userName: string;
  } | null>(null);

  const handleConfirm = () => {
    if (!confirmAction) return;
    switch (confirmAction.type) {
      case 'disable': onDisable(confirmAction.userId); break;
      case 'enable': onEnable(confirmAction.userId); break;
      case 'delete': onDelete(confirmAction.userId); break;
      case 'cancelInvite': onCancelInvite(confirmAction.userId); break;
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{users.length} users total</div>
        <Button onClick={onInvite} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Login</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Last Login</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {u.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            {u.name}
                            {isSelf && (
                              <span className="text-xs text-muted-foreground">(you)</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("text-xs border-0", PERM_COLORS['edit'])}>
                        {u.roleName}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.loginMethod === 'google' ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <svg viewBox="0 0 48 48" className="w-3.5 h-3.5 shrink-0">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-3.58-13.47-8.79l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                          </svg>
                          Google
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <KeyRound className="w-3.5 h-3.5" />
                          Password
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("text-xs border-0", STATUS_COLORS[u.status])}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(u.lastLogin)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        {u.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isSelf}
                              onClick={() => setConfirmAction({ type: 'disable', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-amber-500 hover:text-amber-500 hover:bg-amber-500/10 disabled:opacity-30"
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" />
                              Disable
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isSelf}
                              onClick={() => setConfirmAction({ type: 'delete', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-red-400 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        {u.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onResendInvite(u.id)}
                              className="h-7 px-2 text-xs text-blue-400 hover:text-blue-400 hover:bg-blue-400/10"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Resend
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmAction({ type: 'cancelInvite', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmAction({ type: 'delete', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-red-400 hover:text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        {u.status === 'disabled' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmAction({ type: 'enable', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10"
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Enable
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmAction({ type: 'delete', userId: u.id, userName: u.name })}
                              className="h-7 px-2 text-xs text-red-400 hover:text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {confirmAction && (
        <ConfirmDialog
          open={true}
          title={
            confirmAction.type === 'delete'
              ? 'Delete User'
              : confirmAction.type === 'disable'
              ? 'Disable User'
              : confirmAction.type === 'enable'
              ? 'Enable User'
              : 'Cancel Invitation'
          }
          description={
            confirmAction.type === 'delete'
              ? `Are you sure you want to delete ${confirmAction.userName}? This action cannot be undone.`
              : confirmAction.type === 'disable'
              ? `Disable ${confirmAction.userName}? They will no longer be able to log in.`
              : confirmAction.type === 'enable'
              ? `Re-enable ${confirmAction.userName}? They will be able to log in again.`
              : `Cancel the pending invitation for ${confirmAction.userName}?`
          }
          confirmLabel={
            confirmAction.type === 'delete'
              ? 'Delete'
              : confirmAction.type === 'disable'
              ? 'Disable'
              : confirmAction.type === 'enable'
              ? 'Enable'
              : 'Cancel Invite'
          }
          confirmVariant={confirmAction.type === 'delete' ? 'destructive' : 'default'}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------
// Roles Sub-tab
// ----------------------------------------------------------

function RolesTab({
  roles,
  onSaveRole,
  onDeleteRole,
  onCreateRole,
}: {
  roles: Role[];
  onSaveRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onCreateRole: () => void;
}) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id ?? '');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedRole = roles.find(r => r.id === selectedRoleId) ?? null;

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setEditingRole(null);
  };

  const startEdit = (role: Role) => {
    setEditingRole(JSON.parse(JSON.stringify(role)));
  };

  const cancelEdit = () => setEditingRole(null);

  const handleSave = () => {
    if (editingRole) {
      onSaveRole(editingRole);
      setEditingRole(null);
    }
  };

  const handlePermChange = (menu: keyof MenuPermissions, level: PermissionLevel) => {
    if (!editingRole) return;
    setEditingRole(prev => prev ? { ...prev, permissions: { ...prev.permissions, [menu]: level } } : prev);
  };

  const displayRole = editingRole ?? selectedRole;

  return (
    <div className="flex gap-4 min-h-[500px]">
      {/* Left panel - role list */}
      <div className="w-56 shrink-0 flex flex-col gap-1">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => handleSelectRole(role.id)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2",
              selectedRoleId === role.id
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            {role.isSystem && <Lock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
            <span className="truncate">{role.name}</span>
          </button>
        ))}
        <Button
          onClick={onCreateRole}
          variant="outline"
          size="sm"
          className="mt-2 gap-1.5 border-border text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Role
        </Button>
      </div>

      {/* Right panel - role editor */}
      {displayRole && (
        <Card className="flex-1 p-5 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {displayRole.isSystem && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
              <div>
                <h3 className="font-semibold text-foreground">{displayRole.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{displayRole.description}</p>
              </div>
            </div>
            {displayRole.isSystem && (
              <Badge className="text-xs border-0 bg-slate-400/10 text-slate-400">System Role</Badge>
            )}
          </div>

          {/* Name + Description inputs (editable for non-system only) */}
          {editingRole && !editingRole.isSystem && (
            <div className="space-y-3 mb-5 pb-5 border-b border-border">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Role Name</label>
                <Input
                  value={editingRole.name}
                  onChange={e => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="bg-secondary border-border text-sm h-8"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <Input
                  value={editingRole.description}
                  onChange={e => setEditingRole(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  className="bg-secondary border-border text-sm h-8"
                />
              </div>
            </div>
          )}

          {/* Permissions grid */}
          <div className="space-y-1">
            <div className="grid grid-cols-5 gap-2 px-2 pb-2 text-xs font-medium text-muted-foreground">
              <div>Section</div>
              {PERM_LEVELS.map(l => (
                <div key={l} className="text-center capitalize">{l}</div>
              ))}
            </div>
            {MENU_SECTIONS.map(({ key, label }) => {
              const currentLevel = displayRole.permissions[key];
              const isEditable = !!editingRole && !editingRole.isSystem;
              return (
                <div key={key} className="grid grid-cols-5 gap-2 px-2 py-2 rounded-lg hover:bg-secondary/20 items-center">
                  <div className="text-sm text-foreground">{label}</div>
                  {PERM_LEVELS.map(level => (
                    <div key={level} className="flex justify-center">
                      {isEditable ? (
                        <input
                          type="radio"
                          name={`perm-${key}`}
                          value={level}
                          checked={editingRole!.permissions[key] === level}
                          onChange={() => handlePermChange(key, level)}
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                      ) : (
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          currentLevel === level
                            ? "border-primary bg-primary/20"
                            : "border-border"
                        )}>
                          {currentLevel === level && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
            {!displayRole.isSystem && !editingRole && (
              <>
                <Button onClick={() => startEdit(displayRole)} size="sm">
                  Edit Role
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  className="text-red-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete Role
                </Button>
              </>
            )}
            {editingRole && !editingRole.isSystem && (
              <>
                <Button onClick={handleSave} size="sm">Save Changes</Button>
                <Button onClick={cancelEdit} variant="outline" size="sm" className="border-border">Cancel</Button>
              </>
            )}
          </div>
        </Card>
      )}

      {confirmDelete && selectedRole && (
        <ConfirmDialog
          open={true}
          title="Delete Role"
          description={`Delete the "${selectedRole.name}" role? Users assigned to this role will need to be reassigned.`}
          confirmLabel="Delete Role"
          confirmVariant="destructive"
          onConfirm={() => {
            onDeleteRole(selectedRole.id);
            setConfirmDelete(false);
            setEditingRole(null);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------
// Invitations Sub-tab
// ----------------------------------------------------------

function InvitationsTab({
  invitations,
  onResend,
  onCancel,
}: {
  invitations: Invitation[];
  onResend: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{invitations.length} invitations</div>
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Invited By</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invitations.map(inv => (
                <tr key={inv.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs text-foreground">{inv.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="text-xs border-0 bg-primary/10 text-primary">{inv.roleName}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.invitedBy}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.invitedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-xs border-0", INVITATION_STATUS_COLORS[inv.status])}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      {inv.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onResend(inv.id)}
                            className="h-7 px-2 text-xs text-blue-400 hover:text-blue-400 hover:bg-blue-400/10"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Resend
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCancel(inv.id)}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------
// Integrations & General remain unchanged
// ----------------------------------------------------------

const integrations = [
  {
    id: "i1",
    name: "LINE Official Account",
    description: "เชื่อมต่อ LINE OA สำหรับส่งแจ้งเตือนและรับ order จากลูกค้า",
    icon: MessageCircle,
    connected: true,
    accountName: "@printcrm_official",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    id: "i2",
    name: "Email (SMTP / SendGrid)",
    description: "ระบบส่งอีเมลอัตโนมัติสำหรับ quote, follow-up และแจ้งเตือน",
    icon: Mail,
    connected: true,
    accountName: "noreply@printcrm.co.th",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "i3",
    name: "n8n Automation",
    description: "เชื่อมต่อ n8n workflow automation สำหรับ automation ขั้นสูง",
    icon: Webhook,
    connected: false,
    accountName: null,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: "i4",
    name: "Google Workspace",
    description: "Sync กับ Google Calendar, Drive และ Sheets",
    icon: Globe,
    connected: false,
    accountName: null,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

// ----------------------------------------------------------
// Main Page
// ----------------------------------------------------------

export default function SettingsPage() {
  const { user } = useAuth();

  // Local state for users, roles, invitations
  const [users, setUsers] = useState<AuthUser[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // User actions
  const handleDisable = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'disabled' as const } : u));
    showToast('User disabled.');
  };
  const handleEnable = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' as const } : u));
    showToast('User enabled.');
  };
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User deleted.');
  };
  const handleResendInvite = (id: string) => {
    showToast('Invitation resent.');
  };
  const handleCancelInvite = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Invitation cancelled.');
  };

  // Role actions
  const handleSaveRole = (updated: Role) => {
    setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
    showToast('Role saved.');
  };
  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
    showToast('Role deleted.');
  };
  const handleCreateRole = () => {
    const newRole: Role = {
      id: `role-custom-${Date.now()}`,
      name: 'New Role',
      description: 'Custom role',
      permissions: {
        dashboard: 'none',
        clients: 'none',
        sales: 'none',
        production: 'none',
        inventory: 'none',
        automation: 'none',
        settings: 'none',
      },
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    setRoles(prev => [...prev, newRole]);
    showToast('New role created. Click Edit Role to configure permissions.');
  };

  // Invitation actions
  const handleInvited = (email: string, roleId: string, roleName: string, message: string) => {
    const newInv: Invitation = {
      id: `inv-${Date.now()}`,
      email,
      roleId,
      roleName,
      invitedBy: user?.email ?? 'admin@company.com',
      invitedAt: new Date().toISOString(),
      status: 'pending',
      token: `mock-token-${Date.now()}`,
    };
    setInvitations(prev => [newInv, ...prev]);
  };
  const handleResendInvitation = (id: string) => {
    showToast('Invitation resent.');
  };
  const handleCancelInvitation = (id: string) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'expired' as const } : inv));
    showToast('Invitation cancelled.');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-lg px-4 py-2.5 shadow-lg text-sm text-foreground flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่าระบบ</h1>
        <p className="text-sm text-muted-foreground mt-1">จัดการผู้ใช้งาน การเชื่อมต่อ และการตั้งค่าระบบ</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
          <TabsTrigger value="integrations">การเชื่อมต่อ</TabsTrigger>
          <TabsTrigger value="general">ทั่วไป</TabsTrigger>
        </TabsList>

        {/* Users tab — has sub-tabs: Users | Roles | Invitations */}
        <TabsContent value="users" className="mt-4">
          <Tabs defaultValue="users-list">
            <TabsList className="bg-secondary/50 border border-border mb-4">
              <TabsTrigger value="users-list" className="gap-2">
                <Shield className="w-3.5 h-3.5" />
                Users
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <Lock className="w-3.5 h-3.5" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="invitations" className="gap-2">
                <Mail className="w-3.5 h-3.5" />
                Invitations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users-list">
              <UsersTab
                users={users}
                currentUserId={user?.id ?? ''}
                onDisable={handleDisable}
                onEnable={handleEnable}
                onDelete={handleDeleteUser}
                onResendInvite={handleResendInvite}
                onCancelInvite={handleCancelInvite}
                onInvite={() => setInviteModalOpen(true)}
              />
            </TabsContent>

            <TabsContent value="roles">
              <RolesTab
                roles={roles}
                onSaveRole={handleSaveRole}
                onDeleteRole={handleDeleteRole}
                onCreateRole={handleCreateRole}
              />
            </TabsContent>

            <TabsContent value="invitations">
              <InvitationsTab
                invitations={invitations}
                onResend={handleResendInvitation}
                onCancel={handleCancelInvitation}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4 space-y-4">
          {integrations.map(integration => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="p-5 bg-card border-border">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", integration.bg)}>
                    <Icon className={cn("w-6 h-6", integration.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{integration.name}</h3>
                      <Badge className={cn("text-xs border-0", integration.connected ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-400/10 text-slate-400")}>
                        {integration.connected ? (
                          <><Check className="w-3 h-3 mr-1" />เชื่อมต่อแล้ว</>
                        ) : (
                          <><X className="w-3 h-3 mr-1" />ยังไม่เชื่อมต่อ</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                    {integration.connected && integration.accountName && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Key className="w-3 h-3" />
                        <span>{integration.accountName}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {integration.connected ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">ตั้งค่า</Button>
                        <Button variant="outline" size="sm" className="text-xs border-red-500/30 text-red-400 hover:bg-red-400/10">ยกเลิก</Button>
                      </div>
                    ) : (
                      <Button size="sm" className="text-xs">เชื่อมต่อ</Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">ข้อมูลบริษัท</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">ชื่อบริษัท</label>
                <Input defaultValue="MAllPrint - CRM Co., Ltd." className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เลขประจำตัวผู้เสียภาษี</label>
                <Input defaultValue="0105567890123" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">เบอร์โทรศัพท์</label>
                <Input defaultValue="02-123-4567" className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">อีเมล</label>
                <Input defaultValue="info@printcrm.co.th" className="bg-secondary border-border" />
              </div>
            </div>
            <Button className="mt-4">บันทึกการเปลี่ยนแปลง</Button>
          </Card>

          <Card className="p-5 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">การตั้งค่าระบบ</h3>
            <div className="space-y-4">
              {[
                { label: "ภาษาระบบ", value: "ภาษาไทย" },
                { label: "สกุลเงิน", value: "THB (บาท)" },
                { label: "รูปแบบวันที่", value: "DD/MM/YYYY" },
                { label: "Timezone", value: "Asia/Bangkok (UTC+7)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvited={handleInvited}
      />
    </div>
  );
}
