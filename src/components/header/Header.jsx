import React, { useState, useRef, useEffect } from 'react';
import { Moon, Settings, Sun, Copy, Check, FileArchive, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'; // Agrega Copy y Check
import toggleDarkMode from '../../utils/toggleDarkMode';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, updateProjectInfo, updateFunctionalities } from '../../slices/projectSlice';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'; // Añadir import de DropdownMenu
import { exportJSON, importJSON } from '../../utils/jsonHandler';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ProjectInfo from './ProjectInfo';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import useGemini from '../../hooks/useGemini';

const jsonStructure = JSON.stringify(initialState, null, 2); // JSON structure for import/export

export default function Header() {
  const dispatch = useDispatch();
  const project = useSelector(state => state.project);
  const {projectName} = project.projectInfo

  const fileInputRef = useRef();
  
  const [isDialogOpen, setDialogOpen] = useState(false); 
  const [copied, setCopied] = useState(false); 

  const { editProject, calculateProjectDifferences, calculateConfigurationDifferences } = useGemini();

  const [inputText, setInputText] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState(null);
  const [projectDifferences, setProjectDifferences] = useState([]);
  const [configDifferences, setConfigDifferences] = useState([]);

  useEffect(() => {
    if (isUpdateDialogOpen && updatedProject) {
        const projectDiffs = calculateProjectDifferences(project, updatedProject);
        const configDiffs = calculateConfigurationDifferences(project.projectInfo, updatedProject.projectInfo);
        setProjectDifferences(projectDiffs);
        setConfigDifferences(configDiffs);
    }
  }, [isUpdateDialogOpen, updatedProject]);

  const handleEditProject = () => {
    toast.promise(
      editProject(inputText, project)
        .then((newProject) => {
          console.log('sugerencia:', newProject);
          
          setUpdatedProject(newProject);
          setIsUpdateDialogOpen(true);
          setDialogOpen(false);
          
          
        })
        .catch((error) => {
          console.error('Error al actualizar el proyecto:', error);
        }),
      {
        pending: '✨ Generando cambios en el proyecto...',
        success: 'Proyecto actualizado con éxito 🚀',
        error: 'Ocurrió un error al actualizar el proyecto 😢',
      }
    );
  };

  const handleConfirmUpdate = () => {
    if (updatedProject) {
      dispatch(updateProjectInfo(updatedProject.projectInfo));
      dispatch(updateFunctionalities({ type: 'SET_ALL', payload: updatedProject.functionalities }));
      setIsUpdateDialogOpen(false);
    }
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

        {/* Botón IA*/}
        <Button onClick={() => setDialogOpen(true)} className="p-2">
          <Sparkles size={24} />
        </Button>

        {/* Diálogo para editar el proyecto */}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Proyecto</DialogTitle>
              <DialogDescription>
                ¿Qué deseas que la IA modifique del proyecto?
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingresa la descripción..."
            />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProject}>
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación para actualizar el proyecto */}
        <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <AlertDialogContent className="h-[90%] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Actualización</AlertDialogTitle>
              <AlertDialogDescription>
                Revisa los cambios y decide si deseas actualizar el proyecto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Tabla que muestra los cambios de funcionalidades */}
            <div className="flex flex-col mb-4">
              <div className="flex font-bold border-b">
                <div className="w-1/3 p-2">Type</div>
                <div className="w-2/3 p-2">Details</div>
              </div>
              {projectDifferences.map((diff, index) => (
                <div
                  key={index}
                  className={`flex border-l-4 p-2 ${
                    diff.type === 'added'
                      ? 'border-green-500'
                      : diff.type === 'removed'
                      ? 'border-red-500'
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
              ))}
            </div>
            
            {/* Nueva tabla para cambios de configuraciones */}
            <div className="flex flex-col">
              <div className="flex font-bold border-b">
                <div className="w-1/2 p-2">Configuration Name</div>
                <div className="w-1/2 p-2">New Value</div>
              </div>
              {configDifferences.map((diff, index) => (
                <div
                  key={index}
                  className={`flex border-l-4 p-2 ${
                    diff.type === 'added' || diff.type === 'edited'
                        ? 'border-blue-500'
                        : 'border-red-500'
                  }`}
                >
                  <div className="w-1/2">{diff.key}</div>
                  <div className="w-1/2">
                    {diff.newValue !== undefined ? diff.newValue.toString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsUpdateDialogOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmUpdate}>Actualizar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
