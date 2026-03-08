import type { Role } from "@/types/database";
import {
  LayoutDashboard,
  Shield,
  Home,
  Table2,
  User,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Roles that can see this item. Empty = all authenticated. */
  roles?: Role[];
}

/**
 * Sidebar navigation config. Items are shown when user's role is in `roles`.
 * Omit `roles` to show to everyone (admin + user).
 */
export const sidebarNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    roles: ["admin", "user"],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "user"],
  },
  {
    label: "Table",
    href: "/dashboard/table",
    icon: Table2,
    roles: ["admin", "user"],
  },
  {
    label: "Admin",
    href: "/admin",
    icon: Shield,
    roles: ["admin"],
  },
];

export const sidebarNavFooter: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    roles: ["admin", "user"],
  },
];

export function getVisibleNavItems(
  items: NavItem[],
  userRole: Role
): NavItem[] {
  return items.filter(
    (item) => !item.roles || item.roles.length === 0 || item.roles.includes(userRole)
  );
}
