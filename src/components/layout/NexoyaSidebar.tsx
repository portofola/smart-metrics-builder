import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  FileText,
  BarChart3,
  GitBranch,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  {
    label: 'Portfolios',
    icon: LayoutGrid,
    href: '/',
    isActive: true,
    children: [
      { label: 'jackpots.ch - Acquisi...', href: '/' },
      { label: 'jackpots.ch - Acquisi...', href: '/' },
      { label: 'jackpots.ch - Retentio...', href: '/' },
    ],
  },
  { label: 'Reports', icon: FileText, href: '/reports' },
  { label: 'Metrics', icon: BarChart3, href: '/metrics' },
  { label: 'Correlations', icon: GitBranch, href: '/correlations' },
];

const bottomNavItems = [
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help', icon: HelpCircle, href: '/help' },
];

export function NexoyaSidebar() {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-[200px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="3" fill="hsl(149, 60%, 52%)" />
            <circle cx="6" cy="6" r="2" fill="hsl(149, 60%, 52%)" opacity="0.7" />
            <circle cx="18" cy="6" r="2" fill="hsl(149, 60%, 52%)" opacity="0.7" />
            <circle cx="6" cy="18" r="2" fill="hsl(149, 60%, 52%)" opacity="0.7" />
            <circle cx="18" cy="18" r="2" fill="hsl(149, 60%, 52%)" opacity="0.7" />
          </svg>
          <span className="text-lg font-semibold">nexoya</span>
        </div>
      </div>

      {/* Team Selector */}
      <div className="border-b border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2 text-left transition-colors hover:bg-sidebar-accent/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive text-sm font-bold text-destructive-foreground">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">Team name</p>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  item.isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      item.isActive && "rotate-180"
                    )}
                  />
                )}
              </Link>
              {item.children && item.isActive && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children.map((child, index) => (
                    <Link
                      key={index}
                      to={child.href}
                      className="block truncate rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 underline decoration-sidebar-foreground/30 underline-offset-2 hover:text-sidebar-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-3">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-sidebar-accent/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            BB
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">Ben Bruton</p>
            <p className="truncate text-xs text-sidebar-foreground/50">ben.bruton@nex...</p>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
        </button>
      </div>
    </aside>
  );
}
