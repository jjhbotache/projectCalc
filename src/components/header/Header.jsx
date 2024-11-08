import React, { useState, useRef } from 'react';
import { Moon, Settings, Sun, Copy, Check, FileArchive } from 'lucide-react'; // Agrega Copy y Check
import toggleDarkMode from '../../utils/toggleDarkMode';
import { Button } from '@/components/ui/button';
import HourlyRateInput from '../settings/HourlyRateInput';
import HoursPerDayInput from '../settings/HoursPerDayInput';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings, updateFunctionalities, initialState } from '../../slices/projectSlice';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'; // Añadir import de DropdownMenu
import { exportJSON, importJSON } from '../../utils/jsonHandler';
import { Input } from '@/components/ui/input';
import SettingsDialog from './SettingsDialog';

const jsonStructure = JSON.stringify(initialState, null, 2); // JSON structure for import/export

export default function Header({ projectName }) {
  const dispatch = useDispatch();
  const project = useSelector(state => state.project);
  
  const fileInputRef = useRef();
  
  const [isDialogOpen, setDialogOpen] = useState(false); 
  const [copied, setCopied] = useState(false); 
  
  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between p-4 dark:bg-gray-800 bg-slate-200 dark:text-white rounded-lg w-full">
      <div className='flex items-center gap-4 '>
        <img src="/pngs/DevKalk.png" alt="DevKalk" className="h-10" />
        <h1 className="text-4xl font-thin">{projectName}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                importJSON(e, dispatch)
              }}
              accept=".json"
            />
        {/* Botones de importar y exportar JSON */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FileArchive className="dark:bg-gray-950 bg-white p-2 rounded-full" size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportJSON(project)}>
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current.click()} >
              Import JSON
            </DropdownMenuItem>

            {/* Dialog para información de JSON */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  JSON Structure
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800 dark:text-white max-h-[98%] overflow-y-auto" aria-describedby="">
                <DialogHeader>
                  <DialogTitle>JSON Structure for Import/Export</DialogTitle>
                  <DialogDescription>
                    Copy or view the JSON structure required for this component.
                  </DialogDescription>
                </DialogHeader>
                <div className="dialog-content mt-2">
                  <pre className="p-2 rounded bg-gray-100 dark:bg-gray-700 relative">
                    {jsonStructure}
                    <button onClick={copyJsonStructure} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 absolute top-2 right-2">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* settings */}
        <SettingsDialog />

        {/* theme icon */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-800 text-yellow-400 dark:bg-yellow-400 dark:text-gray-800"
        >
          <Moon size={24} className="dark:hidden" />
          <Sun size={24} className="hidden dark:block" />
        </button>
      </div>
    </header>
  );
}
