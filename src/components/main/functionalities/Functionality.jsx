import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '@/utils/format';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter, 
  AlertDialogCancel,
  AlertDialogAction, 
} from '@/components/ui/alert-dialog';
import { ArrowDownFromLine, ArrowUpFromLine, Sparkles, TimerReset, Trash, GripVertical, Copy, MoreVertical } from 'lucide-react';
import { calculateFunctionTotalPrices } from '@/utils/calculate';
import TaskList from './tasks/TaskList';
import { useState, useEffect } from 'react';
import EditFunctionalityDialog from './EditFunctionalityDialog'; // Import new component
import ConfirmUpdateDialog from './ConfirmUpdateDialog'; // Import new component
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import { calculateTaskDifferences } from '@/utils/calculate';
import ExpandibleInput from '../../global/ExpandibleInput';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Functionality({ functionality, isCollapsed, onToggle, dragEnabled }) {
  if (!functionality) return null;
  
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config); 
  const project = useSelector((state) => state.project);
  const isMobile = useIsMobile();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedFunctionality, setUpdatedFunctionality] = useState(null);
  const [taskDifferences, setTaskDifferences] = useState([]);

  useEffect(() => {
    if (isUpdateDialogOpen && updatedFunctionality) {
      const differences = calculateTaskDifferences(functionality.tasks, updatedFunctionality.tasks);
      setTaskDifferences(differences);
    }
  }, [isUpdateDialogOpen, updatedFunctionality]);

  const durationInDays = functionality.tasks.reduce((sum, task) => sum + task.hours, 0) / config.hoursPerDay;
  const formattedDuration = durationInDays > 0
    ? Number.isInteger(durationInDays)
      ? `${durationInDays}`
      : durationInDays - Math.floor(durationInDays) < 0.5
        ? `${Math.floor(durationInDays)}+`
        : `${Math.ceil(durationInDays)}-`
    : '0';

  const handleFieldChange = (field, value) => {
    dispatch(updateFunctionalities({
      type: 'UPDATE_ONE',
      payload: {
        id: functionality.id,
        updates: { [field]: value },
      },
    }));
  };

  const removeFunctionality = (functionalityId) => {
    dispatch(updateFunctionalities({
      type: 'REMOVE_FUNCTIONALITY',
      payload: { id: functionalityId },
    }));
  };

  const handleConfirmUpdate = () => {
    dispatch(updateFunctionalities({
      type: 'UPDATE_ONE',
      payload: {
        id: functionality.id,
        updates: updatedFunctionality,
      },
    }));
    setIsUpdateDialogOpen(false);
  };

  const cloneFunctionality = (functionalityId) => {
    dispatch(updateFunctionalities({
      type: 'CLONE_FUNCTIONALITY',
      payload: {
        functionalityId: functionalityId
      }
    }));
  };

  const {totalPrice, laborCost} = calculateFunctionTotalPrices(functionality, config.hourlyRate);

  return (
    <motion.div
      className=" border px-1 sm:px-4  py-4 rounded-md border-gray-300 bg-slate-100 dark:border-gray-600 dark:bg-slate-800 gap-2 flex flex-col align-center "
      id={`functionality-${functionality.id}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* sticky header */}
      <div className="flex items-center sticky top-[8rem] z-10 p-4 bg-white shadow-sm dark:bg-gray-900 rounded-xl gap-2 dark:bg-opacity-95 bg-opacity-bg-opacity-85">
        {/* drag handle */}
        {dragEnabled  && (
          <div
            className="reorder-handle cursor-grab"
          >
            <GripVertical size={16} />
          </div>
        )}

        {/* functionality name */}
        <Label className="block text-gray-800 dark:text-gray-200">{functionality.id})</Label>
        <ExpandibleInput
          value={functionality.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          disabled={dragEnabled}
        />

        {/* Hidden AI edit button for dropdown menu reference */}
        <div className="hidden">
          <EditFunctionalityDialog
            functionality={functionality}
            setUpdatedFunctionality={setUpdatedFunctionality}
            setIsUpdateDialogOpen={setIsUpdateDialogOpen}
            disabled={dragEnabled}
            data-functionality-id={functionality.id}
          />
        </div>

        {/* expand button - always visible */}
        <Button
          onClick={onToggle}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 grid place-items-center"
          disabled={dragEnabled}
        >
          {isCollapsed ? <ArrowDownFromLine size={12} /> : <ArrowUpFromLine size={12} />}
        </Button>

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => cloneFunctionality(functionality.id)}>
                <Copy size={16} className="mr-2" />
                Clone
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault(); // Prevent closing the dropdown
                  document.querySelector(`button[data-functionality-id="${functionality.id}"]`)?.click();
                }}
              >
                <Sparkles size={16} className="mr-2" />
                Edit with AI
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {removeFunctionality(functionality.id)}} 
              >
                <span className="flex items-center text-red-600" ><Trash size={16} className="mr-2" />Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            

            {/* edit with AI */}
            <EditFunctionalityDialog
              functionality={functionality}
              setUpdatedFunctionality={setUpdatedFunctionality}
              setIsUpdateDialogOpen={setIsUpdateDialogOpen}
              disabled={dragEnabled}
            />
            
            {/* clone functionality */}
            <Button
              onClick={() => cloneFunctionality(functionality.id)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 grid place-items-center"
              disabled={dragEnabled}
              title="Clone functionality"
            >
              <Copy size={12} />
            </Button>

            {/* delete */}
            <Button variant="destructive" className="p-2" disabled={dragEnabled} title="Delete functionality" onClick={() => removeFunctionality(functionality.id)}>
              <Trash size={12} />
            </Button>
          </>
        )}
      </div>

      {/* details */}
      <div className="flex justify-between text-xl">

        <span className="text-gray-500 flex items-center">
          <TimerReset size={24} />
          <span>{formattedDuration}</span>
          <small className='self-end text-xs ml-1'>days</small> 
        </span>

        <span className="text-gray-500">
          Total Price: {formatCurrency(totalPrice)}
        </span>
      </div>

      {/* expand btn */}
      
      <AnimatePresence>
        {!isCollapsed && !dragEnabled  && (
          <motion.div
            className='bg-gray-950 bg-opacity-20 md:rounded-xl md:p-2'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TaskList
              tasks={functionality.tasks}
              sprintId={functionality.id}
            />

            <hr className="w-11/12 mx-auto my-4 border-white" />

            {/* functionality summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2 text-gray-800 dark:text-gray-200">Tech Cost (USD)</Label>
                <Input
                  type="number"
                  min="0"
                  value={functionality.techCost}
                  onChange={(e) => handleFieldChange('techCost', Number(e.target.value))}
                  className="w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label className="block mb-2 text-gray-800 dark:text-gray-200">Labor Cost (USD)</Label>
                <Input
                  type="number"
                  value={(laborCost || 0).toFixed(2)}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <Label className="block mb-2 text-gray-800 dark:text-gray-200">Monthly Cost (USD)</Label>
                <Input
                  type="number"
                  value={functionality.monthlyCost}
                  onChange={(e) => handleFieldChange('monthlyCost', Number(e.target.value))}
                  className="w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AlertDialog for comparing functionalities */}
      <ConfirmUpdateDialog
        isOpen={isUpdateDialogOpen}
        setIsOpen={setIsUpdateDialogOpen}
        taskDifferences={taskDifferences}
        handleConfirmUpdate={handleConfirmUpdate}
      />
    </motion.div>
  );
}
