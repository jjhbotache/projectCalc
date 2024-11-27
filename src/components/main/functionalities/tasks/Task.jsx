import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Receipt, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import ExpandibleInput from '@/components/global/ExpandibleInput';

export default function Task({ task, sprintId, taskIndex }) {
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(updateFunctionalities({
      type: 'UPDATE_TASK',
      payload: {
        functionalityId: sprintId,
        taskIndex: taskIndex,
        updates: { [field]: value },
      },
    }));
  };

  const handleDelete = () => {
    dispatch(updateFunctionalities({
      type: 'REMOVE_TASK',
      payload: {
        functionalityId: sprintId,
        taskIndex: taskIndex,
      },
    }));
  };

  return (
    <div className="flex items-center w-full md:px-4 py-2 bg-white dark:bg-gray-800 md:rounded-lg shadow-sm">
      <div className="w-9/12" title={task.name}>
        <ExpandibleInput
          value={task.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className="w-2/12">
        <Input
          type="number"
          value={task.hours}
          onChange={(e) => handleChange('hours', Number(e.target.value))}
          className="w-full p-1 border md:rounded bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="w-1/12 flex items-center justify-center gap-1">
        <Receipt size={24} opacity={task.billed ? 1 : 0.2} className='hidden lg:block'/>
        <Checkbox
          checked={task.billed}
          onCheckedChange={(value) => handleChange('billed', value)}
        />
      </div>
      <div className="w-1/12 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-600 hover:text-red-800">
              <Trash size={24} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent >
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}