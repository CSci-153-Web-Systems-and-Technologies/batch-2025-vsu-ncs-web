import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarProps } from "@/types";
import { BriefcaseMedical } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

type AppSidebarProps = {
  items: SidebarProps[];
  profile: string;
  role: string;
};

export default function AppSidebar({ items, profile, role }: AppSidebarProps) {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="h-screen flex flex-col border-r border-gray-300 w-64 max-w-64 "
    >
      <SidebarHeader className="p-5 border-b border-gray-300">
        {" "}
        <div className="flex flex-row text-3xl items-center gap-2">
          <div>
            <BriefcaseMedical className="h-10 w-10" />
          </div>
          <h1>VSU NCS</h1>
        </div>
        <span className="text-sm text-muted-foreground">{`${role} Portal`}</span>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {items.map(({ title, url, icon: Icon }) => (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  asChild
                  className="h-10 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 ease-in-out group"
                >
                  <Link href={url} className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="text-[16px]">{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="w-full p-4 flex flex-col gap-4 border-t border-gray-300">
        <SidebarMenu>
          {" "}
          <div className="w-full">
            <Card className="h-fit py-0 group transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/40 cursor-pointer">
              <CardHeader>
                <CardTitle className="transition-colors duration-300 group-hover:text-emerald-700">
                  {profile}
                </CardTitle>
                <CardDescription className="transition-colors duration-300 group-hover:text-emerald-600/80">
                  {role}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarMenuItem className="w-full flex flex-col border-t border-gray-300">
        <SidebarMenuButton asChild>
          <LogoutButton />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </Sidebar>
  );
}
