'use client'

import {  Bolt, GithubIcon, HeartHandshake, HelpCircle,  Trash } from 'lucide-react';
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
import SupportDialog from './SupportDialog';
import { useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { createPortal } from 'react-dom';
import { useSidebar } from "@/components/ui/sidebar"
import { AnimatePresence, motion } from 'framer-motion'


export default function Navigation() {
  const dispatch = useDispatch();
  const functionalities = useSelector((state) => state.project.functionalities);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { open } = useSidebar();
  

  const onDeleteAllProject = () => {
    dispatch(deleteAll());
    localStorage.removeItem('project');
  };

  const onHelp = () => { setIsHelpDialogOpen(true); };
  const onConfig = () => { setIsAppConfigsDialogOpen(true); };
  const onSupport = () => { 
    setIsSupportDialogOpen(true);
    setShowConfetti(true);
  };
  
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
              <a href="#settings" onClick={onConfig}>
                <Bolt className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <AlertDialog>
            <AlertDialogTrigger>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#delete-project">
                    <Trash className="h-5 w-5" />
                    <span>Delete project</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
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
              <a href="#help" onClick={onHelp}>
                <HelpCircle className="h-5 w-5" />
                <span>Help</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#support" onClick={onSupport}>
                <HeartHandshake className="h-5 w-5" />
                <span>Support me!</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* New menu item for creator text */}

            
          <AnimatePresence>
          {
            open &&
            <SidebarMenuItem className="mt-auto">
              <motion.p
                className="text-xs text-gray-400 pl-3 pt-3 w-full "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-gray-500 mb-1 block">Created by:</span>
                <a className='underline hover:cursor-pointer' target="_blank" href="https://juanjosehuertas.vercel.app" >Juan Jose Huertas Botache</a>
                <a href="https://github.com/jjhbotache" target="_blank" className=" ml-1 inline-grid place-items-end
                hover:cursor-pointer hover:text-gray-500
                ">
                  <i className="fi fi-brands-github"></i>
                </a>
              </motion.p>
            </SidebarMenuItem>
          }
          </AnimatePresence>
            
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>


    {showConfetti && createPortal(
      <ConfettiExplosion 
        zIndex={999999}
        className='*:z-[999999] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3'
        onComplete={() => setShowConfetti(false)} 
        duration={5000}
      />,
      document.body
    )}
    {/* modals */}
    <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
    <SupportDialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen} />
  </>
}
