import type { ReactNode } from 'react';

export type SidebarNavItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: boolean;
};

export type SidebarProps = {
  primaryNav: SidebarNavItem[];
  secondaryNav?: SidebarNavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  footerTitle?: string;
  footerName?: string;
  footerAvatarSrc?: string;
  className?: string;
};
