import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await base44.entities.Notification.filter({ read: false });
        setNotifications(notifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const unsubscribe = base44.entities.Notification.subscribe((event) => {
      if (event.type === "create") {
        setNotifications((prev) => [event.data, ...prev]);
      }
    });

    return () => unsubscribe();
  }, []);

  const dismiss = async (id) => {
    await base44.entities.Notification.update(id, { read: true });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "phase_status_changed":
      case "milestone_completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "dependency_blocked":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "bg-red-900/20 border-red-800";
      case "warning":
        return "bg-yellow-900/20 border-yellow-800";
      case "success":
        return "bg-green-900/20 border-green-800";
      default:
        return "bg-blue-900/20 border-blue-800";
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className={`border rounded-lg p-4 flex gap-3 items-start ${getSeverityColor(notif.severity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{notif.title}</h3>
              <p className="text-sm text-gray-300">{notif.message}</p>
            </div>
            {notif.dismissible && (
              <button
                onClick={() => dismiss(notif.id)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}