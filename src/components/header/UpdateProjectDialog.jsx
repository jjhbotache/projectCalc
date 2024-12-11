import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function UpdateProjectDialog({ isUpdateDialogOpen, setIsUpdateDialogOpen, projectDifferences, configDifferences, handleConfirmUpdate }) {
  return (
    <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      <AlertDialogContent className="h-[90%] overflow-y-auto  *:break-all">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Update</AlertDialogTitle>
          <AlertDialogDescription>
            Review the changes and decide if you want to update the project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col mb-4  ">
          <div className="flex font-bold border-b">
            <div className="w-1/3 p-2">Type</div>
            <div className="w-2/3 p-2">Details</div>
          </div>
          {projectDifferences.map((diff, index) => (
            diff.functionality && (diff.type === 'added' || diff.type === 'edited') ? (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className={`flex border-l-4 p-2  ${
                    diff.type === 'added'
                      ? 'border-green-500'
                      : diff.type === 'edited'
                      ? 'border-yellow-500'
                      : 'border-transparent'
                  }`}>
                    <div className="w-1/3 capitalize">{diff.type}</div>
                    <div className="w-2/3">Functionality: {diff.functionality.name}</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {diff.taskDifferences && diff.taskDifferences.map((taskDiff, idx) => (
                      <div
                        key={idx}
                        className={`flex border-l-4 p-2 ml-4 ${
                          taskDiff.status === 'added'
                            ? 'border-green-500'
                            : taskDiff.status === 'removed'
                            ? 'border-red-500'
                            : taskDiff.status === 'edited'
                            ? 'border-yellow-500'
                            : 'border-gray-400'
                        }`}
                      >
                        <div className="w-1/5 capitalize text-xs">{taskDiff.status}</div>
                        <div className="w-3/5">Task: {taskDiff.name}</div>
                        <div className="w-1/5 ps-2">{taskDiff.hours}hrs</div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div
                key={index}
                className={`flex border-l-4 p-2 ${
                  diff.type === 'removed'
                    ? 'border-red-500'
                    : diff.type === 'not modified'
                    ? 'border-gray-400'
                    : 'border-yellow-500'
                }`}
              >
                <div className="w-1/3 capitalize">{diff.type}</div>
                <div className="w-2/3">
                  {diff.functionality
                    ? `Functionality: ${diff.functionality.name}`
                    : `Configuration: ${diff.key}`}
                  {diff.oldValue !== undefined && ` (from: ${diff.oldValue})`}
                  {diff.newValue !== undefined && ` (to: ${diff.newValue})`}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="flex flex-col ">
          <div className="flex font-bold border-b ">
            <div className="w-1/2 p-2">Configuration Name</div>
            <div className="w-1/2 p-2">New Value</div>
          </div>
          {configDifferences.map((diff, index) => (
            <div
              key={index}
              className={`flex border-l-4 p-2  ${
                diff.type === 'added' || diff.type === 'edited'
                    ? 'border-blue-500'
                    : diff.type === 'not modified'
                    ? 'border-gray-400'
                    : 'border-red-500'
              }`}
            >
              <div className="w-1/2">{diff.key}</div>
              <div className="w-1/2 ">
                {diff.newValue !== undefined ? diff.newValue.toString() : 'N/A'}
              </div>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsUpdateDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmUpdate}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
