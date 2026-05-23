// @/components/notifications/NotificationItem.tsx
import { Check, Info, AlertTriangle, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export const NotificationItem = ({ n, onMarkRead, onDelete }: { n: Notification; onMarkRead: (id: string) => void; onDelete: (id: string) => void }) => {
  const Icon = n.type === "success" ? Check : n.type === "warning" ? AlertTriangle : Info;
  const colorClass = n.type === "success" ? "text-green-600 dark:text-green-400" : n.type === "warning" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400";

  return (
    <div onClick={() => !n.read && onMarkRead(n.id)} className={`group relative flex gap-3 p-3 border-b border-border last:border-0 transition-all cursor-pointer ${!n.read ? "bg-primary/8" : "hover:bg-accent/50 opacity-80"}`}>
      <div className={`mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center ${colorClass}`}>
        <Icon size={14} />
      </div>

      <div className="flex-1 pr-6">
        <div className="flex justify-between items-baseline">
          <p className={`text-[12px] leading-tight ${!n.read ? "font-bold text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
          <span className="text-[9px] text-muted-foreground/60 font-mono ml-2">{n.time}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{n.description}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(n.id);
        }}
        className="absolute right-2 top-3 p-1 text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>

      {!n.read && <div className="absolute right-1 bottom-3 w-1.5 h-1.5 bg-primary rounded-full" />}
    </div>
  );
};
