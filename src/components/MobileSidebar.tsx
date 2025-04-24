
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Activity,
  CheckSquare,
  Home,
  Settings,
  Watch,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileSidebarProps {
  onClose: () => void;
}

const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  const menuItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      href: "/" 
    },
    { 
      icon: CheckSquare, 
      label: "To-Do", 
      href: "/todo" 
    },
    { 
      icon: Watch, 
      label: "Watch", 
      href: "/watch" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/settings" 
    },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PulseTrack</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md transition-all",
                  "hover:bg-accent/10",
                  isActive ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground"
                )
              }
              onClick={onClose}
              end
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          PulseTrack © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
