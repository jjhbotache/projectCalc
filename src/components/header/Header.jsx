import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles, MessageCircle, X, File, Undo, Redo, Move, Lock, ArrowUpDown } from 'lucide-react';
import toggleDarkMode from '../../utils/toggleDarkMode';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, updateProjectInfo, updateFunctionalities } from '../../slices/projectSlice';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ProjectInfo from './ProjectInfo';
import { toast } from 'react-toastify';
import useGemini from '../../hooks/useGemini';
import JsonMenu from './JsonMenu';
import EditProjectDialog from './EditProjectDialog';
import UpdateProjectDialog from './UpdateProjectDialog';
import JsonStructureDialog from './JsonStructureDialog';
import DownloadPDF from './DownloadPDF'; 
import ChatDialog from './ChatDialog'; 
import { calculateProjectDifferences } from '@/utils/calculate';
import { calculateConfigurationDifferences } from '@/utils/calculate';

const jsonStructure = JSON.stringify(initialState, null, 2);
const iconsSize = 22;
const btnsHeight = 10;

export default function Header({
  undo,
  redo,
  canUndo,
  canRedo,
  dragEnabled,
  setDragEnabled,
}) {
  const dispatch = useDispatch();
  const project = useSelector(state => state.project);
  const { projectName } = project.projectInfo;

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { editProject } = useGemini();
  const [errorToShow, setErrorToShow] = useState("");

  const [inputText, setInputText] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState(null);
  const [projectDifferences, setProjectDifferences] = useState([]);
  const [configDifferences, setConfigDifferences] = useState([]);
  const [jsonStructureOpen, setJsonStructureOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false); 
  const [isChatInHeader, setIsChatInHeader] = useState(false);

  

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
      editProject(inputText)
        .then((newProject) => {
          setUpdatedProject(newProject);
          setIsUpdateDialogOpen(true);
          setDialogOpen(false);
        })
        .catch((error) => {
          setErrorToShow(error);
          console.log(error);
          throw new Error(error)
        }),
      {
        pending: '✨ Generando cambios en el proyecto...',
        success: 'Sugerencias generadas con éxito 🎉',
        error: `${errorToShow}`,
      }
    );
  };

  const handleConfirmUpdate = () => {
    if (updatedProject) {
      dispatch(updateProjectInfo(updatedProject.projectInfo));
      dispatch(updateFunctionalities({ type: 'SET_ALL', payload: updatedProject.functionalities }));
      setIsUpdateDialogOpen(false);
      toast.success('Project updated successfully 🚀');
    }
  };

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <header className="flex  items-center justify-between p-4 py-2 shadow-xl dark:bg-gray-800 bg-slate-200 dark:text-white rounded-lg w-full flex-wrap gap-2 gap-y-1 sticky top-0 mt-4 z-20 pb-5">
      {/* sidebar  btn & logo */}
      <div className='flex items-center gap-4 text-4xl w-full'>
        <SidebarTrigger className="block" />
        <p className='truncate w-full block '>{projectName}</p>
      </div>

      {/* project data */}
      <ProjectInfo />

      {/* btns */}
      <div className="flex items-center gap-2">
        {/* Download PDF */}
        <DownloadPDF project={project}>
          <Button  className={`h-${btnsHeight} aspect-square p-0 rounded-full`} title="Export quotation">
            <File size={iconsSize} />
          </Button>
        </DownloadPDF>

        

        <JsonMenu
          project={project}
          setJsonStructureOpen={setJsonStructureOpen}
          displayData={{
            btnsHeight,
            iconsSize,
          }}
        />

        <Button onClick={() => setDialogOpen(true)} className={`h-${btnsHeight} aspect-square p-0 rounded-full`} title="Edit project with AI"> <Sparkles size={iconsSize} /> </Button>

        <Button onClick={toggleDarkMode} className={`h-${btnsHeight} aspect-square p-0 rounded-full bg-gray-800 text-yellow-400 dark:bg-yellow-400 dark:text-gray-800`} title="Toggle theme">
          <Moon size={iconsSize} className="dark:hidden" />
          <Sun size={iconsSize} className="hidden dark:block" />
        </Button>
        {/* Botón de Chat en el header */}
        {isChatInHeader && ( 
          <Button onClick={() => setIsChatDialogOpen(true)} className={`h-${btnsHeight} aspect-square p-0 rounded-full`} title="Chat about the project">
            <MessageCircle size={iconsSize} /> 
          </Button>
         )}

      </div>

      
      <div className="absolute bottom-0 -left-2 transform translate-y-1/2 flex gap-1">
        {/* Toggle Reordering */}
        <Button
            onClick={() => setDragEnabled(!dragEnabled)}
            className="p-0 h-6 shadow-2xl"
            variant="outline"
          >
            <ArrowUpDown className={
              (!dragEnabled ? "text-gray-700" : "text-white" )
            } />
        </Button>
        <Button onClick={undo} disabled={!canUndo} className="p-0 h-6 shadow-2xl" variant="outline" title="Undo">
          <Undo />
        </Button>
        <Button onClick={redo} disabled={!canRedo} className="p-0 h-6 shadow-2xl" variant="outline" title="Redo">
          <Redo />
        </Button>
      </div>



      

      {/* Botón de Chat Flotante */}
      {!isChatInHeader && (
        <div className='fixed bottom-4 right-4'>
          <X className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full shadow-lg' size={14} onClick={() => setIsChatInHeader(!isChatInHeader)} />
          <MessageCircle className=" p-3 bg-blue-500 text-white rounded-full shadow-lg" size={20} onClick={() => setIsChatDialogOpen(true)}/>
        </div>
      )}

      {/* dialogs */}
      <EditProjectDialog
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        inputText={inputText}
        setInputText={setInputText}
        handleEditProject={handleEditProject}
      />

      <UpdateProjectDialog
        isUpdateDialogOpen={isUpdateDialogOpen}
        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
        projectDifferences={projectDifferences}
        configDifferences={configDifferences}
        handleConfirmUpdate={handleConfirmUpdate}
      />

      <JsonStructureDialog
        jsonStructureOpen={jsonStructureOpen}
        setJsonStructureOpen={setJsonStructureOpen}
        jsonStructure={JSON.stringify(initialState, null, 2)}
        copyJsonStructure={copyJsonStructure}
        copied={copied}
      />
      <ChatDialog open={isChatDialogOpen} onClose={() => setIsChatDialogOpen(false)} />
    </header>
  );
}
