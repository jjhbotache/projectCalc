import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export default function SidebarFunctionalities({ functionalities }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Functionalities</SidebarGroupLabel>
      <SidebarMenu>
        {functionalities.map((functionality) => (
          <SidebarMenuItem key={functionality.id} className="list-none">
            <SidebarMenuButton asChild>
              <a href={`#functionality-${functionality.id}`}>
                <span className="h-4 w-4" >
                  {functionality.id.toString().substring(0, 2)}
                </span>
                <span>{functionality.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
