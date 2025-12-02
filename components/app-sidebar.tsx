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
      collapsible="offcanvas"
      className="h-screen flex flex-col border-r border-gray-300 w-64 max-w-64"
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
                <SidebarMenuButton asChild>
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
        {" "}
        <div className="w-full">
          <Card className="h-fit py-3">
            <CardHeader>
              <CardTitle>{profile}</CardTitle>
              <CardDescription>{role}</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <SidebarMenuItem className="w-full">
          <SidebarMenuButton asChild>
            <LogoutButton />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
