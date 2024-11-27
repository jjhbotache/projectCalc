import Task from './Task';
import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, ClipboardPlus, TimerReset } from 'lucide-react';
import { Reorder } from 'framer-motion';

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

  const handleReorder = (newOrder) => {
    dispatch(updateFunctionalities({
      type: 'SET_TASKS_ORDER',
      payload: {
        functionalityId: sprintId,
        newTasks: newOrder,
      },
    }));
  };

  return (
    <div className="w-full">
      <div className="flex w-full mb-2 md:px-4 py-2 bg-muted font-medium text-sm">
        <div className="w-9/12 text-center flex justify-center items-center">Task</div>
        <div className="w-2/12 text-center flex justify-center items-center">
          <TimerReset/>
          <span className='hidden lg:block'>Hours</span>
        </div>
        <div className="w-1/12 text-center flex justify-center items-center">
          <CircleDollarSign/>
          <span className='hidden lg:block'>Billed</span>
        </div>
        <div className="w-1/12 text-center flex justify-center items-center">
          <span className='hidden lg:block'>Actions</span>
        </div>
      </div>
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={handleReorder}
        className="flex flex-col gap-2"
      >
        {tasks.map((task, index) => (
          <Reorder.Item key={task.name} value={task}>
            <Task
              task={task}
              sprintId={sprintId}
              taskIndex={index}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button
        onClick={addTask}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 mt-4 dark:bg-green-600 dark:hover:bg-green-700"
      >
        <ClipboardPlus className="mr-2" /> Add Task
      </Button>
    </div>
  );
}
