'use client'

import { Home, Settings, Users, HelpCircle, Menu, Icon, House } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup
} from '@/components/ui/sidebar';

export default function Navigation({ functionalities, onHelp }) {

  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger/>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {functionalities.map((functionality) => (
            <SidebarMenuItem key={functionality.id} className="list-none">
              <SidebarMenuButton asChild>
                <a href={`#functionality-${functionality.id}`}>
                  <span className="h-5 w-5" >
                    {functionality.id.toString().substring(0, 2)}
                  </span>
                  <span>{functionality.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#ayuda" onClick={onHelp}>
                <HelpCircle className="h-5 w-5" />
                <span>Ayuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
