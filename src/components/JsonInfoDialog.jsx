import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Check } from 'lucide-react';

const jsonStructure = `{
  "hourlyRate": number,
  "maintenanceCost": number,
  "sprints": [
    {
      "id": number,
      "name": string,
      "tasks": [
        {
          "name": string,
          "time": number
        }
      ],
      "techCost": number,
      "laborCost": number,
      "duration": number
    }
  ]
}`;

export default function JsonInfoDialog({ darkMode, copied, setCopied }) {
  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          JSON Info
        </button>
      </DialogTrigger>
      <DialogContent className={darkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
        <DialogHeader>
          <DialogTitle>JSON Structure for Import/Export</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p>The JSON file for import/export follows this structure:</p>
          <div className="relative">
            <pre className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {jsonStructure}
            </pre>
            <button
              onClick={copyJsonStructure}
              className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="mt-2">This structure allows for easy import and export of your project planning data, including maintenance costs.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}