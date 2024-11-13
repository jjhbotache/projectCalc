import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Clipboard } from 'lucide-react';

export default function JsonStructureDialog({ jsonStructureOpen, setJsonStructureOpen, jsonStructure, copyJsonStructure, copied }) {
  return (
    <Dialog open={jsonStructureOpen} onOpenChange={setJsonStructureOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 dark:text-white max-h-[98%] overflow-y-auto">
        <DialogTitle>JSON Structure for Import/Export</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            Copy or view the JSON structure required for a project.
            Use it to ask to your preferred AI to generate a project for you.
          </DialogDescription>
        </DialogHeader>
        <div className="dialog-content mt-2">
          <pre className="p-2 rounded bg-gray-100 dark:bg-gray-700 relative">
            {jsonStructure}
            <Button onClick={copyJsonStructure} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 absolute top-2 right-2">
              {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
            </Button>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
