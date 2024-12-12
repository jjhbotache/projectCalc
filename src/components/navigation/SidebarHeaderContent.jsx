import { SidebarMenu, SidebarMenuItem, SidebarMenuButton,SidebarTrigger } from '@/components/ui/sidebar';

export default function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div className='flex w-full box-border justify-between'>
            <div className='flex items-center gap-2'>
              <img src="/pngs/DevKalk.png" alt="DevKalk" className="h-7" />
              <h1 className="text-2xl font-bold ">DevKalk</h1>
            </div>

            <SidebarTrigger className="block md:hidden "/>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
