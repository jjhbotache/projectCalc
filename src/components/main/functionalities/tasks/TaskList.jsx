import Task from './Task';
import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { ClipboardPlus } from 'lucide-react';

export default function TaskList({ tasks, sprintId }) {
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(updateFunctionalities({
      type: 'ADD_TASK',
      payload: {
        functionalityId: sprintId,
        task: { name: 'New Task', hours: 0 },
      },
    }));
  };

  return (
    <div className="w-full">
      <div className="flex w-full mb-2 px-4 py-2 bg-muted font-medium text-sm">
        <div className="flex-1">Task</div>
        <div className="w-16 text-center">Hours</div>
        <div className="w-24 text-center">Billed</div>
        <div className="w-10 text-center">Actions</div>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            sprintId={sprintId}
            taskIndex={index}
          />
        ))}
      </div>
      <Button
        onClick={addTask}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 mt-4 dark:bg-green-600 dark:hover:bg-green-700"
      >
        <ClipboardPlus className="mr-2" /> Add Task
      </Button>
    </div>
  );
}
