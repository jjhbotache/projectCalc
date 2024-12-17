import { useState } from 'react';
import Task from './Task';
import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '@/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Check, CircleDollarSign, ClipboardPlus, GripVertical, Move, TimerReset } from 'lucide-react';
import { Reorder } from 'framer-motion';

export default function TaskList({ tasks, sprintId }) {
  const dispatch = useDispatch();
  const [reorderingMode, setReorderingMode] = useState(false); // Add reordering mode state

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
      <div className="flex w-full mb-2 md:px-4 py-2 bg-muted font-medium text-sm relative">

        <div className="absolute left-0 top-0 h-full flex items-center transform -translate-x-1/2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReorderingMode(!reorderingMode)}            
            className="aspect-square shadow-2xl p-1"
          >
            {reorderingMode ? <Check size={18}/> : <ArrowDownUp size={18}/>}
          </Button>
        </div>

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

      {/* Conditionally render tasks */}
      {reorderingMode ? (
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={handleReorder}
          className="flex flex-col gap-2"
        >
          {tasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
            >
              <Task
                task={task}
                sprintId={sprintId}
                taskIndex={tasks.indexOf(task)}
                reorderingMode={reorderingMode}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              sprintId={sprintId}
              taskIndex={tasks.indexOf(task)}
              reorderingMode={reorderingMode}
            />
          ))}
        </div>
      )}

      <Button
        onClick={addTask}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 mt-4"
      >
        <ClipboardPlus className="mr-2" /> Add Task
      </Button>
    </div>
  );
}
