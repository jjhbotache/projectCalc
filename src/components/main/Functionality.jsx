import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Task from './Task';
import { formatCurrency } from '../../utils/format';
import { updateFunctionalities } from '../../slices/projectSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
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
import { ArrowDownFromLine, ArrowUpFromLine, ClipboardPlus, Expand, TimerReset, Trash } from 'lucide-react';
import { calculateFunctionTotalPrices } from '../../utils/calculateTotalPrices';
import TaskList from './TaskList';

export default function Functionality({ functionality, isCollapsed, onToggle }) {
  if (!functionality) return null;
  
  const dispatch = useDispatch();
  const {settings} = useSelector((state) => state.project);

  const durationInDays = functionality.tasks.reduce((sum, task) => sum + task.hours, 0) / settings.hoursPerDay;
  const formattedDuration = durationInDays > 0
    ? Number.isInteger(durationInDays)
      ? `${durationInDays}`
      : durationInDays - Math.floor(durationInDays) < 0.5
        ? `${Math.floor(durationInDays)}+`
        : `${Math.ceil(durationInDays)}-`
    : 'No tasks';

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

  const {totalPrice, laborCost} = calculateFunctionTotalPrices(functionality,settings.hourlyRate);

  

  return (
    <div
      className=" border p-4 rounded-md border-gray-300 bg-slate-100 dark:border-gray-600 dark:bg-slate-800 gap-2 flex flex-col align-center"
      id={`functionality-${functionality.id}`}
    >
      {/* sticky header */}
      <div className="flex  items-center sticky top-0 z-10 p-4 bg-white shadow-sm  dark:bg-gray-900 rounded-xl gap-2 dark:bg-opacity-55  bg-opacity-5">
        <Label className="block text-gray-800 dark:text-gray-200">#{functionality.id}</Label>
        <Input
          value={functionality.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="text-xl font-bold w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="p-2">
              <Trash size={12} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this sprint?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeFunctionality(functionality.id)}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
        onClick={onToggle}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 grid place-items-center"
      >{isCollapsed ? <ArrowDownFromLine size={12} /> : <ArrowUpFromLine size={12} />}</Button>
      </div>

      {/* details */}
      <div className="flex justify-between text-2xl">

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
      
      {!isCollapsed &&
       (
        <div className='bg-gray-950 bg-opacity-20 rounded-xl p-2'>
          <TaskList
            tasks={functionality.tasks}
            sprintId={functionality.id}
          />

          <hr className="m-4 border-white" />

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
        </div>
      )}
    </div>
  );
}
