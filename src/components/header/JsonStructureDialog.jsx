import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
        <div className="dialog-content mt-2 relative max-w-full  overflow-x-auto">
          <JSONPretty data={jsonStructure} theme={JSONPretty.monikai} className='text-xs p-1 border border-white rounded-lg' >
          </JSONPretty>
          <Button onClick={copyJsonStructure} className="absolute top-2 right-2">
            {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}