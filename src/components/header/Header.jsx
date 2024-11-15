import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Sparkles, ReceiptText, MessageCircle, X } from 'lucide-react';
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
import DownloadPDF from './DownloadPDF'; // Import the updated component
import ChatDialog from '../ChatDialog'; // Import the ChatDialog component

const jsonStructure = JSON.stringify(initialState, null, 2);

export default function Header() {
  const dispatch = useDispatch();
  const project = useSelector(state => state.project);
  const { projectName } = project.projectInfo;

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { editProject, calculateProjectDifferences, calculateConfigurationDifferences } = useGemini();

  const [inputText, setInputText] = useState('');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState(null);
  const [projectDifferences, setProjectDifferences] = useState([]);
  const [configDifferences, setConfigDifferences] = useState([]);
  const [jsonStructureOpen, setJsonStructureOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false); // State for ChatDialog
  const [isChatInHeader, setIsChatInHeader] = useState(false); // Estado para controlar la posición del botón de Chat

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
          setUpdatedProject(newProject);
          setIsUpdateDialogOpen(true);
          setDialogOpen(false);
        })
        .catch((error) => {
          console.error('Error al actualizar el proyecto:', error);
        }),
      {
        pending: '✨ Generando cambios en el proyecto...',
        success: 'Sugerencias generadas con éxito 🎉',
        error: 'Ocurrió un error al actualizar el proyecto 😢',
      }
    );
  };

  const handleConfirmUpdate = () => {
    if (updatedProject) {
      dispatch(updateProjectInfo(updatedProject.projectInfo));
      dispatch(updateFunctionalities({ type: 'SET_ALL', payload: updatedProject.functionalities }));
      setIsUpdateDialogOpen(false);
      toast.success('Proyecto actualizado con éxito 🚀');
    }
  };

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportQuotation = () => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.json`;
    a.click();
  };

  return (
    <header className="flex items-center justify-between p-4 py-2 dark:bg-gray-800 bg-slate-200 dark:text-white rounded-lg w-full flex-wrap gap-2 sticky top-0 z-20 ">
      {/* sidebar  btn & logo */}
      <div className='flex items-center gap-4 text-4xl'>
        <SidebarTrigger className="block" />
        
        {projectName}
      </div>

      {/* project data */}
      <ProjectInfo />

      {/* btns */}
      <div className="flex items-center gap-2">
        {/* Download PDF */}
        <DownloadPDF project={project}>
          <Button onClick={handleExportQuotation} className="p-2 rounded-full" title="Export quotation">
            <ReceiptText size={20} />
          </Button>
        </DownloadPDF>

        

        <JsonMenu
          project={project}
          setJsonStructureOpen={setJsonStructureOpen}
        />
        <Button onClick={() => setDialogOpen(true)} className="p-2 rounded-full">
          <Sparkles size={20} />
        </Button>
        <Button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-800 text-yellow-400 dark:bg-yellow-400 dark:text-gray-800" >
          <Moon size={20} className="dark:hidden" />
          <Sun size={20} className="hidden dark:block" />
        </Button>
        {/* Botón de Chat en el header */}
        {isChatInHeader && ( <MessageCircle className=" p-3 bg-blue-500 text-white rounded-full shadow-lg" size={20} onClick={() => setIsChatDialogOpen(true)}/> )}

        
      </div>

      {/* Botón de Chat Flotante */}
      {/* onClick={() => setIsChatInHeader(!isChatInHeader)} */}
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
