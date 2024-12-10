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
import ProductRatingDialog from '@/components/modals/ProductRatingDialog'; // Import the new dialog
import { registerProject } from '@/slices/projectsSlice';
import { setCurrentProjectId, updateProject, loadProjectsFromLocalStorage } from './slices/projectsSlice';
import { setProjectState } from './slices/projectSlice';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const config = useSelector((state) => state.config);
  const projectsSlice = useSelector((state) => state.projectsSlice);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);
  const { undo, redo, canUndo, canRedo, history, currentIndex:currentHistoryIndex, loadHistoryAndIndex } = useHistory();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
   

  useEffect(() => {
    loadTheme();
    // load projects from LS
    dispatch(loadProjectsFromLocalStorage());
    
    if (projectsSlice.projects.length === 0 && localStorage.getItem('projects') === null) { 
      dispatch(
        registerProject({
          project: project,
          history:[]
          })
      )
      dispatch( setCurrentProjectId(
        project.projectInfo.id
      ))
    }
    

    const params = new URLSearchParams(window.location.search);
    if (params.get('thanks')) {
      setShowConfetti(true);
      setIsThanksModalOpen(true);
    }
    if (params.get('cancel')) {
      setIsCancelModalOpen(true);
    }
      
  },[]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'import' }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'import' }));

    // const savedProjectIds = localStorage.getItem('projectIds');
    // const savedCurrentProjectId = localStorage.getItem('currentProjectId');
    // if (savedProjectIds) dispatch(setProjectIds(JSON.parse(savedProjectIds)));
    // if (savedCurrentProjectId) dispatch(setCurrentProjectId(savedCurrentProjectId)); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'save' })); // close to delete
    
    dispatch(
      updateProject({
        project: project
      })
    )
  }, [project]);

  useEffect(() => {
    dispatch(
      updateProject({
        project,
        history,
        currentHistoryIndex
      })
    )
  }, [history]);

  useEffect(() => {
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' })); 
  }, [config]);

  useEffect(() => {
    if (projectsSlice.projects.length > 0 ) localStorage.setItem('projects', JSON.stringify(projectsSlice));
  }, [projectsSlice.projects]);

  useEffect(() => {
    if (projectsSlice.currentProjectId===null) return;    
    
    const projectToSet = projectsSlice.projects.find((p) => p.project.projectInfo.id === projectsSlice.currentProjectId);  
    
    
    loadHistoryAndIndex(projectToSet.history, projectToSet.currentHistoryIndex);

    dispatch(setProjectState(projectToSet.project));
  }, [projectsSlice.currentProjectId]);


  
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
      {showConfetti && createPortal(
        <ConfettiExplosion 
          zIndex={999999}
          className='*:z-[999999] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3'
          onComplete={() => setShowConfetti(false)} 
          duration={5000}
        />,
        document.body
      )}


      
      <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
      <ThanksModal open={isThanksModalOpen} onClose={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsThanksModalOpen(false)
      }} />
      <CancelModal open={isCancelModalOpen} onClose={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsCancelModalOpen(false)
      }} />
    </>
  );
}