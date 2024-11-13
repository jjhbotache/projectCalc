import { useState } from 'react';
import ReorderFunctionalityItem from './ReorderFunctionalityItem'; // Importar el nuevo componente
import { CirclePlus, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { updateFunctionalities, updateProjectInfo } from '@/slices/projectSlice';
import { useSelector } from 'react-redux';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import useGemini from '@/hooks/useGemini';
import { toast } from 'react-toastify';
import { Reorder } from 'framer-motion'; // Eliminar useDragControls de aquí

export default function Functionalities({ functionalities }) {
  const [expandedFunctionalityId, setExpandedFunctionalityId] = useState(null);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [description, setDescription] = useState('');
  const { generateProjectFromDescription } = useGemini();

  const inInitialState = project.functionalities.length === 1 && project.functionalities[0].name === 'Default Functionality';

  const addFunctionality = () => {  
    console.log('Adding functionality');
    
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
  };

  const handleReorder = (newOrder) => {
    dispatch(updateFunctionalities({ type: 'SET_ALL', payload: newOrder }));
  };

  const handleGenerate = () => {
    setIsAlertOpen(false);
    toast.promise(
      generateProjectFromDescription(description).then((project) => {
        dispatch(updateFunctionalities({ type: 'SET_ALL', payload: project.functionalities }));
        dispatch(updateProjectInfo(project.projectInfo));
      })
      .catch((error) => {
        console.error('Error generating project:', error);
      })
      ,
      {
        pending: '✨Generating project...',
        success: 'Project generated successfully 🚀',
        error: 'An error occurred while generating the project 😢'
      }
    );
  };

  return (
    <>
      <Reorder.Group
        axis="y"
        values={functionalities}
        onReorder={handleReorder}
        className='flex flex-col gap-8 w-full my-4'
      >
        {functionalities.map((functionality) => (
          <ReorderFunctionalityItem
            key={functionality.id}
            functionality={functionality}
            isCollapsed={expandedFunctionalityId !== functionality.id}
            onToggle={() => {
              setExpandedFunctionalityId(
                expandedFunctionalityId === functionality.id ? null : functionality.id
              );
            }}
          />
        ))}
      </Reorder.Group>
      
      {
        (functionalities.length===0 || inInitialState) && (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-gray-500 text-center ">Create your project with Gemini</h1>
            <p className="text-gray-500 ">Use AI to create the proyect you have in mind  </p>

            <Button onClick={()=>setIsAlertOpen(true)} className="bg-blue-700 text-white hover:bg-blue-600 mb-10 rounded-full self-center text-2xl" size="lg" >
              <Sparkle size={24} />
              Generate
            </Button>
          </div>
        )
      }

      {
        functionalities.length===0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-gray-500">No functionalities added</h1>
            <p className="text-gray-500">Click the button below to add a new functionality</p>
          </div>
        )
      }

      <Button onClick={addFunctionality} className="bg-blue-700 text-white hover:bg-blue-600 mb-10 rounded-full self-center p-2" >
        <CirclePlus size={18} />
      </Button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project Description</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter a detailed description of your project to generate the functionalities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-2 border rounded"
              placeholder="Describe your project..."
              rows={7}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerate}>Generate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
