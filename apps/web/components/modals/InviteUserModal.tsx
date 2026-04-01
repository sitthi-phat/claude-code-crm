"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, UserPlus, Check } from "lucide-react"
import { Role, Invitation } from "@/lib/auth/types"
import { apiFetch } from "@/lib/api"

type Props = {
  open: boolean
  onClose: () => void
  onInvited: (invitation: Invitation) => void
  roles: Role[]
}

export function InviteUserModal({ open, onClose, onInvited, roles }: Props) {
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [submitError, setSubmitError] = useState("")

  const validateEmail = (val: string) => {
    if (!val) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Invalid email address"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }
    if (!roleId) return

    const selectedRole = roles.find(r => r.id === roleId)
    if (!selectedRole) return

    setLoading(true)
    setSubmitError("")
    try {
      const res = await apiFetch('/api/users/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role_id: roleId, role_name: selectedRole.name }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSubmitError((data as { error?: string }).error || 'Failed to send invitation. Please try again.')
        setLoading(false)
        return
      }

      const data = await res.json()
      const inv = data.invitation
      onInvited({
        id: inv.id,
        email: inv.email,
        roleId: inv.role_id,
        roleName: inv.role_name,
        invitedBy: inv.invited_by,
        invitedAt: inv.invited_at,
        status: inv.status,
        token: inv.token,
      })
      setSuccess(true)
    } catch {
      setSubmitError('Failed to send invitation. Please try again.')
    }
    setLoading(false)
  }

  const handleClose = () => {
    setEmail("")
    setRoleId("")
    setMessage("")
    setEmailError("")
    setSubmitError("")
    setSuccess(false)
    onClose()
  }

  const selectedRole = roles.find(r => r.id === roleId)

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose() }}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite User
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Invitation sent!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invitation sent to <span className="font-mono text-foreground">{email}</span>.<br />
                They will receive a link to accept.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-2">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Google Email
              </label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError("") }}
                className="bg-secondary border-border"
                required
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={roleId} onValueChange={(v) => setRoleId(v ?? '')} required>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <span>{role.name}</span>
                        {role.isSystem && (
                          <span className="text-xs text-muted-foreground">(system)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole && (
                <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Personal message{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Add a personal note to the invitation email..."
                rows={3}
                className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {submitError && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" disabled={loading || !roleId} className="flex-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Invitation
                  </span>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="border-border">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
