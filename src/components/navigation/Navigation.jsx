'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarRail } from '@/components/ui/sidebar';
// import { deleteAll } from '@/slices/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useRef } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { createPortal } from 'react-dom';
import { useSidebar } from "@/components/ui/sidebar"
import PopupDialog from '@/components/ui/PopupDialog';
import SidebarHeaderContent from './SidebarHeaderContent';
import SidebarFunctionalities from './SidebarFunctionalities';
import SidebarFooterContent from './SidebarFooterContent';
import HelpContent from './HelpContent';
import AppConfigs from './AppConfigs';
import SupportDialog from './SupportDialog';
import SidebarProjects from './SidebarProjects';
import { removeProject } from '@/slices/projectsSlice';
import { deleteAll } from '@/slices/projectSlice';

const randIntervalSegs = () => (Math.random() * (600 - 120) )+ 120;

export default function Navigation() {
  const dispatch = useDispatch();
  const functionalities = useSelector((state) => state.project.functionalities);
  const currentProjectId = useSelector((state) => state.projectsSlice.currentProjectId);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { open } = useSidebar();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasInteractedRef = useRef(false);

  const onDeleteAllProject = () => {
    dispatch(deleteAll());
    dispatch(removeProject(currentProjectId));
    localStorage.removeItem('project');
  };

  const onHelp = () => { 
    setIsHelpDialogOpen(true); 
    setHasInteractedWithSupport(true); // Set flag
    console.log('User has interacted with support');
    
  };

  const onConfig = () => { 
    setIsAppConfigsDialogOpen(true)
   };

  const onSupport = () => { 
    setIsSupportDialogOpen(true);
    setShowConfetti(true);
    setHasInteractedWithSupport(true); // Set flag
  };

  const showPopup = useCallback(() => {
    setIsPopupOpen(true);
    if (!hasInteractedRef.current) setTimeout(showPopup, randIntervalSegs() * 1000)
  }, [hasInteractedRef.current]);

  useEffect(() => {
    // set the first showPopup
    const timer = setTimeout(showPopup, randIntervalSegs() * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isSupportDialogOpen) {
      hasInteractedRef.current = true; 
    }
  }, [isSupportDialogOpen]);

  const handlePopupResponse = (response) => {
    setIsPopupOpen(false);
    if (response === 'yes') {
      hasInteractedRef.current = true;
      setIsSupportDialogOpen(true);
      setShowConfetti(true);
    }
  };

  
  
  return <>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger className="block md:hidden"/>
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent>
        <SidebarProjects />
        <SidebarFunctionalities functionalities={functionalities} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterContent 
          onConfig={onConfig} 
          onDeleteAllProject={onDeleteAllProject} 
          onHelp={onHelp} 
          onSupport={onSupport} 
          open={open} 
        />
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
    <PopupDialog 
      isOpen={isPopupOpen && !isSupportDialogOpen && !hasInteractedRef.current} 
      onClose={() => setIsPopupOpen(false)} 
      onResponse={handlePopupResponse} 
    />
    {/* modals */}
    <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
    <SupportDialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen} />
  </>
}
