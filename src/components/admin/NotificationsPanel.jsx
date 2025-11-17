/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin Notifications Panel                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPanel() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => base44.asServiceRole.entities.Notification.list('-created_date', 50),
    refetchInterval: 15000,
    initialData: [],
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.asServiceRole.entities.Notification.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.asServiceRole.entities.Notification.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] }),
  });

  const typeConfig = {
    info: { color: "bg-blue-100 text-blue-700", icon: Info },
    success: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    warning: { color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
    error: { color: "bg-red-100 text-red-700", icon: XCircle },
    system: { color: "bg-purple-100 text-purple-700", icon: Bell }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-bold text-xl">Notifications</h3>
            <p className="text-sm text-slate-600">
              {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white">
            {unreadCount}
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {notifications.map((notif, idx) => {
            const TypeIcon = typeConfig[notif.type]?.icon || Info;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card className={`p-4 ${notif.read ? 'opacity-60' : 'border-l-4 border-purple-500'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeConfig[notif.type]?.color}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 mb-1">{notif.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                        <div className="text-xs text-slate-500">
                          {new Date(notif.created_date).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notif.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutate(notif.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(notif.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Aucune notification</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}