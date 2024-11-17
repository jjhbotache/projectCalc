'use client'

import {  Bolt, HelpCircle,  Trash } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteAll } from '@/slices/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import HelpContent from './HelpContent';
import AppConfigs from './AppConfigs';
import { useState } from 'react';

export default function Navigation() {
  const dispatch = useDispatch();
  const functionalities = useSelector((state) => state.project.functionalities);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);


  const onDeleteAllProject = () => {
    dispatch(deleteAll());
    localStorage.removeItem('project');
  };

  const onHelp = () => { setIsHelpDialogOpen(true); };
  const onConfig = () => { setIsAppConfigsDialogOpen(true); };
  
  return <>
    <Sidebar collapsible="icon">

      <SidebarHeader>
      <SidebarTrigger className="block md:hidden"/>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className='flex w-full'>
                <img src="/pngs/DevKalk.png" alt="DevKalk" className="h-4" />
                <h1 className="text-2xl font-bold text-white">DevKalk</h1>
              </a>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
        
      </SidebarHeader>

      <SidebarContent>

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

      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#configuraciones" onClick={onConfig}>
                <Bolt className="h-5 w-5" />
                <span>Configuraciones</span>
              </a>
            </SidebarMenuButton>

          </SidebarMenuItem>

          <AlertDialog>
            <AlertDialogTrigger>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#borrar-proyecto">
                    <Trash className="h-5 w-5" />
                    <span>Borrar proyecto</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent >

              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete project.
              </AlertDialogDescription>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAllProject}>Delete the whole project</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


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
      
      <SidebarRail />
    </Sidebar>
    {/* modals */}
    <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
  </>
}
