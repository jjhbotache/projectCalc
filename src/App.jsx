import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Summary from './components/main/Summary';
import Header from './components/header/Header';
import Functionalities from './components/main/Functionalities';
import { updateFunctionalities, loadAndSaveProjectFromLocalStorage } from './slices/projectSlice';
import { loadTheme } from './utils/toggleDarkMode';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navigation from './components/navigation/Navigation';
import HelpContent from './components/navigation/HelpContent';
import useGemini from './hooks/useGemini';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const { generateProjectFromDescription } = useGemini();


  const handleHelp = () => {
    setIsHelpDialogOpen(true);
  };

  useEffect(() => {
    loadTheme();
    dispatch(loadAndSaveProjectFromLocalStorage({type: 'import'}));
  }, [dispatch]); // Run once on mount

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({type: 'save'}));
  }, [project]); // Save when project changes

  


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-full w-full">
        {/* sidebar */}
        <Navigation functionalities={project.functionalities} onHelp={handleHelp} />

        <main className="flex-1 p-4 pb<-0 bg-white dark:bg-slate-950 dark:text-white min-h-screen h-full flex flex-col items-center w-full gap-2 relative overflow-auto">
          <Header projectName="DevKalk"/>
          <Functionalities functionalities={project.functionalities} />
          
          
          <Summary />
          <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
        </main>
      </div>
    </SidebarProvider>
  );
}