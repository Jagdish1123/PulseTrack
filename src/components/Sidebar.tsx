
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Activity,
  CheckSquare,
  Home,
  Settings,
  Watch,
  BrainCircuit,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
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
      icon: BrainCircuit, 
      label: "AI Coach", 
      href: "/ai-coach" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/settings" 
    },
  ];

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="h-screen w-64 border-r flex flex-col bg-card/80 backdrop-blur-sm dark:bg-card/30"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="h-16 flex items-center px-6 border-b">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PulseTrack
          </span>
        </motion.div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none">
        {menuItems.map((item, index) => (
          <motion.div 
            key={item.href} 
            variants={itemVariants}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  "hover:bg-accent/20",
                  isActive ? "bg-accent/20 text-accent font-medium shadow-sm" : "text-muted-foreground"
                )
              }
              end
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
      <motion.div 
        className="p-4 border-t"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Heart className="h-3 w-3 text-red-400" />
          <span>PulseTrack © {new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
