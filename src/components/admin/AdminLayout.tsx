import { LogOut, LayoutDashboard, FolderKanban, Star } from "lucide-react";
import { DojLogo } from "@/components/DojLogo";
import { cn } from "@/lib/utils";

export type AdminTab = "dashboard" | "projects" | "reviews";

const NAV_ITEMS: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "reviews", label: "Reviews", icon: Star },
];

export function AdminLayout({
  tab,
  onTabChange,
  onLogout,
  children,
}: {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-wine">
            Admin
          </span>
          <DojLogo size={36} showText />
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:text-wine"
          >
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Sidebar navigation */}
          <nav className="flex shrink-0 flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onTabChange(item.key)}
                className={cn(
                  "inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  tab === item.key
                    ? "bg-wine/10 text-wine"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content area */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
