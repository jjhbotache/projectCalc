import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Trash, GripVertical, Copy } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import ExpandibleInput from '@/components/global/ExpandibleInput';

export default function Task({ task, sprintId, taskIndex, reorderingMode }) {
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    console.log('field', field, 'value', value);
    
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

  const handleCloneTask = () => {
    dispatch(updateFunctionalities({
      type: 'CLONE_TASK',
      payload: {
        functionalityId: sprintId,
        taskIndex: taskIndex,
      },
    }));
  };

  return (
    <div className="flex items-center w-full md:px-4 py-2 bg-white dark:bg-gray-800 md:rounded-lg shadow-sm">
      {reorderingMode && (
        <div className="cursor-grab">
          <GripVertical size={16} />
        </div>
      )}
      <div className="w-8/12 sm:w-9/12" title={task.name}>
        <ExpandibleInput
          value={task.name}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={reorderingMode} 
        />
      </div>
      <div className="w-2/12 sm:w-1/12">
        <Input
          type="number"
          value={task.hours}
          onChange={(e) => handleChange('hours', parseInt(e.target.value))}
          className="w-full p-1 border md:rounded bg-white dark:bg-gray-700 dark:text-white"
          disabled={reorderingMode} 
        />
      </div>
      <div className="w-1/12 flex items-center justify-center gap-1">
        <Checkbox
          checked={task.billed}
          onCheckedChange={(value) => handleChange('billed', value)}
          disabled={reorderingMode} 
        />
      </div>
      <div className="w-2/12 sm:w-1/12 flex justify-center gap-3">
        {/* Clone button */}
        <button 
          onClick={handleCloneTask} 
          className="text-green-600 hover:text-green-800"
          title="Clone task"
          disabled={reorderingMode}
        >
          <Copy size={19} />
        </button>

        {/* Delete button */}
        <button className="text-red-600 hover:text-red-800" onClick={handleDelete}>
          <Trash size={19} />
        </button>
      </div>
    </div>
  );
}