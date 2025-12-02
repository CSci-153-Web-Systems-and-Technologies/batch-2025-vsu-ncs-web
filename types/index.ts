import { LucideProps } from "lucide-react";

export interface SidebarProps {
  title: string;
  url: string;
  icon: React.ComponentType<LucideProps>;
}
