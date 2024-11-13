import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '../../slices/projectSlice';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Receipt, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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
    <div className="flex items-center w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex-1" title={task.name}>
        <Input
          value={task.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:text-white text-xs"
        />
      </div>
      <div className="w-16 px-2">
        <Input
          type="number"
          value={task.hours}
          onChange={(e) => handleChange('hours', Number(e.target.value))}
          className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="w-24 flex items-center justify-center gap-2">
        <Receipt size={24} opacity={task.billed ? 1 : 0.2} />
        <Checkbox
          checked={task.billed}
          onCheckedChange={(value) => handleChange('billed', value)}
        />
      </div>
      <div className="w-10 flex justify-center">
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