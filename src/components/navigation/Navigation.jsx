'use client'

import { Home, Settings, Users, HelpCircle, Menu, Icon, House, Trash } from 'lucide-react';
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { updateFunctionalities, updateSettings, deleteAll } from '../../slices/projectSlice';
import { useDispatch } from 'react-redux';

export default function Navigation({ functionalities, onHelp }) {
  const dispatch = useDispatch();


  const onDeleteAllProject = () => {
    dispatch(deleteAll());
    localStorage.removeItem('project');
    console.log("deleted");
  };

  
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
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete project.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
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
  );
}
