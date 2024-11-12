import React, { useState, useRef, useEffect } from 'react';
import { Moon, Settings, Sun, Copy, Check, FileArchive, Plus, ChevronDown, ChevronUp } from 'lucide-react'; // Agrega Copy y Check
import toggleDarkMode from '../../utils/toggleDarkMode';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, updateProjectInfo } from '../../slices/projectSlice';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'; // Añadir import de DropdownMenu
import { exportJSON, importJSON } from '../../utils/jsonHandler';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ProjectInfo from './ProjectInfo';

const jsonStructure = JSON.stringify(initialState, null, 2); // JSON structure for import/export

export default function Header() {
  const dispatch = useDispatch();
  const projectName = useSelector(state => state.project.projectInfo.projectName);
  
  const fileInputRef = useRef();
  
  const [isDialogOpen, setDialogOpen] = useState(false); 
  const [copied, setCopied] = useState(false); 

  const handleProjectNameChange = (e) => {
    dispatch(updateProjectInfo({ projectName: e.target.value }));
  };

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  
  return (
    <header className="flex items-center justify-between p-4 dark:bg-gray-800 bg-slate-200 dark:text-white rounded-lg w-full flex-wrap gap-2 sticky top-0 z-20 ">
      {/* logo */}
      <div className='flex items-center gap-4 '>
        <SidebarTrigger className="block"/> 
        
        <img src="/pngs/DevKalk.png" alt="DevKalk" className="h-10" />
        {projectName}
      </div>

      {/* actions */}
      <div className="flex items-center gap-2">
        
        

        {/* Botones de importar y exportar JSON */}
        <Input className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                importJSON(e, dispatch)
              }}
              accept=".json"
            />
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
              <DialogContent aria-describedby="import and export json" className="bg-white dark:bg-gray-800 dark:text-white max-h-[98%] overflow-y-auto">
                <DialogTitle>JSON Structure for Import/Export</DialogTitle>
                <DialogHeader>
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


        {/* theme icon */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-800 text-yellow-400 dark:bg-yellow-400 dark:text-gray-800"
        >
          <Moon size={24} className="dark:hidden" />
          <Sun size={24} className="hidden dark:block" />
        </button>
      </div>

      <ProjectInfo />
    </header>
  );
}
