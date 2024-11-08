import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '../slices/projectSlice';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';

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
        <TableRow>
          <TableCell>
            <Input
              value={task.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              value={task.hours}
              onChange={(e) => handleChange('hours', Number(e.target.value))}
              className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </TableCell>
          <TableCell>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-600 hover:text-red-800">
                  <Trash size={24} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
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
          </TableCell>
        </TableRow>
  );
}