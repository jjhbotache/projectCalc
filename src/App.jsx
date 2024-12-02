import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAndSaveProjectFromLocalStorage } from '@/slices/projectSlice';
import { loadAndSaveConfigFromLocalStorage } from '@/slices/configSlice'; // Import the action
import Navigation from '@/components/navigation/Navigation';
import AppConfigs from '@/components/navigation/AppConfigs';
import Summary from '@/components/main/Summary';
import Header from '@/components/header/Header';
import Functionalities from '@/components/main/functionalities/Functionalities';
import { SidebarProvider } from '@/components/ui/sidebar';
import { loadTheme } from '@/utils/toggleDarkMode';
import useHistory from '@/hooks/useHistory';
import ConfettiExplosion from 'react-confetti-explosion';
import { createPortal } from 'react-dom';
import ThanksModal from '@/components/modals/ThanksModal';
import CancelModal from '@/components/modals/CancelModal';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const config = useSelector((state) => state.config);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);
  const { undo, redo, canUndo, canRedo } = useHistory();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    loadTheme();

  },[]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'import' }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'import' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'save' }));
  }, [project]);

  useEffect(() => {
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' })); 
  }, [config]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('thanks')) {
      setShowConfetti(true);
      setIsThanksModalOpen(true);
    }
    if (params.get('cancel')) {
      setIsCancelModalOpen(true);
    }
  }, []);

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-full">
          <Navigation />
          <main className="flex-1 p-4 pb-0 bg-white dark:bg-slate-950 dark:text-white min-h-screen flex flex-col items-center w-full gap-2 relative">
            <Header 
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}   />
            <Functionalities functionalities={project.functionalities} />
            <Summary />
          </main>
        </div>
      </SidebarProvider>
      <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
      {showConfetti && createPortal(
        <ConfettiExplosion 
          zIndex={999999}
          className='*:z-[999999] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3'
          onComplete={() => setShowConfetti(false)} 
          duration={5000}
        />,
        document.body
      )}
      
      <ThanksModal open={isThanksModalOpen} onClose={() => setIsThanksModalOpen(false)} />
      <CancelModal open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} />
    </>
  );
}