import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Summary from './components/Summary';
import Header from './components/Header';
import HourlyRateInput from './components/HourlyRateInput';
import Functionalities from './components/Functionalities';
import { updateSettings, updateFunctionalities, loadAndSaveProjectFromLocalStorage } from './slices/projectSlice';
import { CirclePlus } from 'lucide-react';
import { loadTheme } from './utils/toggleDarkMode';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navigation from './components/Navigation';
import HelpContent from './components/HelpContent';

export default function ProjectPlanner() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

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

  const addFunctionality = () => {  
    dispatch(updateFunctionalities({
      type: 'ADD_FUNCTIONALITY',
      payload: { 
        id: 
        (project.functionalities.length > 0 
          ? Math.max(...project.functionalities.map(f => f.id)) + 1 
          : 1),
        name: 'New Functionality', 
        tasks: [], // Initialize tasks array
        techCost: 0, 
        laborCost: 0, 
        duration: 0, 
        monthlyCost: 0 
      }
    }));
  }


  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-full w-full">
        {/* sidebar */}
        <Navigation functionalities={project.functionalities} onHelp={handleHelp} />

        <main className="flex-1 p-4 pb-0 bg-white dark:bg-slate-950 dark:text-white min-h-screen h-full flex flex-col items-center w-full gap-2 relative overflow-auto">
          <Header hourlyRate={project.settings.hourlyRate} setHourlyRate={(rate) => dispatch(updateSettings({ hourlyRate: rate }))} />
          <Functionalities functionalities={project.functionalities} />
          <Button onClick={addFunctionality} className="bg-blue-700 text-white hover:bg-blue-600 mb-10 rounded-full " >
            <CirclePlus size={64} />
          </Button>
          
          <Summary />
          <HelpContent open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
        </main>
      </div>
    </SidebarProvider>
  );
}