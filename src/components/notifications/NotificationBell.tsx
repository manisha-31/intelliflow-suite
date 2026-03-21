import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const NotificationBell: React.FC = () => {
  const { profile } = useAuth();
  const { data: notifications = [] } = useNotifications(profile?.id);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();
  const unread = notifications.filter((n: any) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Bell className="w-5 h-5" />
          {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-heading text-foreground">Notifications</p>
          {unread > 0 && profile && (
            <Button size="sm" variant="ghost" className="text-xs gap-1 h-7" onClick={() => markAll.mutate(profile.id)}>
              <CheckCheck className="w-3 h-3" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No notifications</p>}
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
            >
              <div className="flex items-start gap-2">
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground font-body">{n.title || 'Notification'}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
