import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export default function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#" className='flex w-full'>
            <img src="/pngs/DevKalk.png" alt="DevKalk" className="h-4" />
            <h1 className="text-2xl font-bold ">DevKalk</h1>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
