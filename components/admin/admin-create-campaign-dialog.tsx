'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type CampaignForAdmin = {
  id: string
  name?: string
  title?: string
  body?: string
  status?: string
  userId?: string
  userEmail?: string
  userName?: string
  createdAt?: string
  scheduledAt?: string
  sentAt?: string
  subscriberCount?: number
}

type AdminCreateCampaignDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: CampaignForAdmin | null
}

export function AdminCreateCampaignDialog({
  open,
  onOpenChange,
  campaign,
}: AdminCreateCampaignDialogProps) {
  const title = campaign?.title ?? campaign?.name ?? 'Sin título'
  const status = campaign?.status ?? '—'
  const statusVariant =
    status === 'sent' || status === 'enviada'
      ? 'default'
      : status === 'scheduled' || status === 'programada'
        ? 'secondary'
        : 'outline'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de campaña</DialogTitle>
          <DialogDescription>
            Vista de super admin: campaña de cualquier usuario.
          </DialogDescription>
        </DialogHeader>
        {campaign ? (
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-muted-foreground font-medium">Título</span>
              <p className="mt-1 font-medium">{title}</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Estado</span>
              <div className="mt-1">
                <Badge variant={statusVariant}>{status}</Badge>
              </div>
            </div>
            {campaign.userEmail != null && (
              <div>
                <span className="text-muted-foreground font-medium">Usuario</span>
                <p className="mt-1">
                  {campaign.userName ? `${campaign.userName} · ` : ''}
                  {campaign.userEmail}
                </p>
              </div>
            )}
            {campaign.userId != null && campaign.userEmail == null && (
              <div>
                <span className="text-muted-foreground font-medium">User ID</span>
                <p className="mt-1 font-mono text-xs">{campaign.userId}</p>
              </div>
            )}
            {campaign.body != null && campaign.body !== '' && (
              <div>
                <span className="text-muted-foreground font-medium">Mensaje</span>
                <p className="mt-1 rounded-md border bg-muted/50 p-3 text-muted-foreground">
                  {campaign.body}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-muted-foreground">
              {campaign.createdAt != null && (
                <div>
                  <span className="font-medium">Creada</span>
                  <p className="mt-0.5">{campaign.createdAt}</p>
                </div>
              )}
              {campaign.scheduledAt != null && (
                <div>
                  <span className="font-medium">Programada</span>
                  <p className="mt-0.5">{campaign.scheduledAt}</p>
                </div>
              )}
              {campaign.sentAt != null && (
                <div>
                  <span className="font-medium">Enviada</span>
                  <p className="mt-0.5">{campaign.sentAt}</p>
                </div>
              )}
              {campaign.subscriberCount != null && (
                <div>
                  <span className="font-medium">Suscriptores</span>
                  <p className="mt-0.5">{campaign.subscriberCount}</p>
                </div>
              )}
            </div>
            <div>
              <span className="text-muted-foreground font-medium">ID campaña</span>
              <p className="mt-1 font-mono text-xs">{campaign.id}</p>
            </div>
          </div>
        ) : (
          <p className={cn('text-muted-foreground text-sm')}>
            No hay campaña seleccionada.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
