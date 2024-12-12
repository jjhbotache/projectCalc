import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerProject } from '@/slices/projectsSlice';
import { initialState } from '@/slices/projectSlice';
import { setCurrentProjectId } from '../../slices/projectsSlice';

export default function SidebarProjects() {
  const {projects,currentProjectId} = useSelector((state) => state.projectsSlice);
  
  const dispatch = useDispatch();

  const handleCreateProject = () => {
    const newId = projects[projects.length - 1].project.projectInfo.id + 1;

    const newProject = {
      ...initialState,
      projectInfo: {
        ...initialState.projectInfo,
        id: newId,
      },
    };

    dispatch(
      registerProject({
        project: newProject,
        history: [],
      })
    );
  };

  const handleChangeProject = (projectId) => {
    dispatch(setCurrentProjectId(projectId));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton asChild>
          <div className='flex w-full' onClick={handleCreateProject}>
            <Plus /> <h1 className="text-md ">New project</h1>
          </div>
        </SidebarMenuButton>
        {projects.map((p) => (
          <SidebarMenuItem key={p.project.projectInfo.id} className="list-none">
            <SidebarMenuButton asChild >
              <div className='w-full flex items-center' onClick={()=>{
              handleChangeProject(p.project.projectInfo.id);
            }}>
                <strong className='mr-2'>
                  {p.project.projectInfo.id}
                </strong>
                {
                  currentProjectId == p.project.projectInfo.id 
                  ? <strong className='underline '>{p.project.projectInfo.projectName}</strong>  
                  : <span className='font-extralight'>{p.project.projectInfo.projectName}</span>
                }
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
