import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAndSaveProjectFromLocalStorage } from '@/slices/projectSlice';
import { loadAndSaveConfigFromLocalStorage } from '@/slices/configSlice'; // Import the action
import Navigation from '@/components/navigation/Navigation';
import AppConfigs from '@/components/navigation/AppConfigs';
import Summary from '@/components/main/Summary';
import Header from '@/components/header/Header';
import Functionalities from './components/main/functionalities/Functionalities';
import { SidebarProvider } from '@/components/ui/sidebar';
import { loadTheme } from '@/utils/toggleDarkMode';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const config = useSelector((state) => state.config);
  const [isAppConfigsDialogOpen, setIsAppConfigsDialogOpen] = useState(false);



  useEffect(() => {
    loadTheme();

  },[]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'import' }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'import' }));
    // You may need to dispatch an action to set configurations in the global state here
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAndSaveProjectFromLocalStorage({ type: 'save' }));
  }, [project]);

  useEffect(() => {
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' })); // Save configurations
  }, [config]);

  

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-full">
          <Navigation
          />
          <main className="flex-1 p-4 pb-0 bg-white dark:bg-slate-950 dark:text-white min-h-screen flex flex-col items-center w-full gap-2 relative">
            <Header />
            <Functionalities functionalities={project.functionalities} />
            <Summary />
          </main>
        </div>
      </SidebarProvider>
      <AppConfigs open={isAppConfigsDialogOpen} onOpenChange={setIsAppConfigsDialogOpen} />
    </>
  );
}