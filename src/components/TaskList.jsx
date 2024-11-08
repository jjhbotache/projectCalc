import Task from './Task';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { useDispatch } from 'react-redux';
import { updateFunctionalities } from '../slices/projectSlice';
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
    <div>
      <Table className="w-full mb-4">
        <TableHeader >
          <TableRow >
            <TableCell>Task</TableCell>
            <TableCell>Hours</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <Task
              key={index}
              task={task}
              sprintId={sprintId}
              taskIndex={index}
            />
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={addTask}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 dark:bg-green-600 dark:hover:bg-green-700"
      >
        <ClipboardPlus /> Add Task
      </Button>
    </div>
  );
}
