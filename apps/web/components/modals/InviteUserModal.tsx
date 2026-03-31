"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, UserPlus, Check } from "lucide-react"
import { mockRoles } from "@/lib/mock-data/users"
import { useAuth } from "@/lib/auth/AuthContext"

type Props = {
  open: boolean
  onClose: () => void
  onInvited: (email: string, roleId: string, roleName: string, message: string) => void
}

export function InviteUserModal({ open, onClose, onInvited }: Props) {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState("")

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

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const role = mockRoles.find(r => r.id === roleId)
    if (role) {
      onInvited(email, roleId, role.name, message)
      setSuccess(true)
    }
    setLoading(false)
  }

  const handleClose = () => {
    setEmail("")
    setRoleId("")
    setMessage("")
    setEmailError("")
    setSuccess(false)
    onClose()
  }

  const selectedRole = mockRoles.find(r => r.id === roleId)

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
                  {mockRoles.map(role => (
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
