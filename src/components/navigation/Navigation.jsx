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
} from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteAll } from '../../slices/projectSlice';
import { useDispatch } from 'react-redux';
import { DialogTitle } from '@/components/ui/dialog';
import HelpContent from './HelpContent';
import AppConfigs from './AppConfigs';
import { useState } from 'react';

export default function Navigation({ functionalities}) {
  const dispatch = useDispatch();
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);


  const onDeleteAllProject = () => {
    dispatch(deleteAll());
    localStorage.removeItem('project');
  };

  const onHelp = () => { setIsHelpDialogOpen(true); };
  const onConfig = () => { setIsAppConfigsDialogOpen(true); };
  
  return <>
    <Sidebar aria-describedby="sidebar">

      <SidebarHeader>
        <SidebarTrigger className="block md:hidden"/>
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
    </Sidebar>
    {/* modals */}
    <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
  </>
}
