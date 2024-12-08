import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerProject } from '@/slices/projectsSlice';
import { initialState } from '@/slices/projectSlice';
export default function SidebarProjects() {
  const projects = useSelector((state) => state.projects.projects);
  const dispatch = useDispatch();

  const handleCreateProject = () => {
    dispatch(
      registerProject(initialState)
    )
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton asChild>
          <div  className='flex w-full' onClick={handleCreateProject}>
            <Plus  />
            <h1 className="text-md font-bold ">New project</h1>
          </div>
        </SidebarMenuButton>
        {projects.map((p) => (
          <SidebarMenuItem key={p.projectInfo.id} className="list-none">
            <SidebarMenuButton asChild>
              <a href={`#project-${p.projectInfo.id}`}>
                <span className="h-4 w-4">
                  {p.projectInfo.id.toString().substring(0, 2)}
                </span>
                <span>{p.projectInfo.projectName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
