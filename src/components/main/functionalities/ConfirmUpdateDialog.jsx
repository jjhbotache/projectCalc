import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function ConfirmUpdateDialog({ isOpen, setIsOpen, taskDifferences, handleConfirmUpdate }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="h-[90%] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Update</AlertDialogTitle>
          <AlertDialogDescription>
            Review the changes in tasks and decide whether to update.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col">
          <div className="flex font-bold border-b">
            <div className="w-1/2 p-2">Task</div>
            <div className="w-1/2 p-2">Hours</div>
          </div>
          {taskDifferences.map((task) => (
            <div
              key={task.id || task.name}
              className={`flex border-l-4 p-2 ${
                task.status === 'added'
                  ? 'border-green-500'
                  : task.status === 'removed'
                  ? 'border-red-500'
                  : task.status === 'edited'
                  ? 'border-yellow-500'
                  : 'border-gray-400'
              }`}
            >
              <div className="w-1/2">{task.name}</div>
              <div className="w-1/2">{task.hours}</div>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmUpdate}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
