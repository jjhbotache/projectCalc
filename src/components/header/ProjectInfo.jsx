import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectInfo } from '../../slices/projectSlice';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

export default function ProjectInfo() {
  const dispatch = useDispatch();
  const projectInfo = useSelector(state => state.project.projectInfo);
  console.log(projectInfo);
  
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const handleChange = (field, value) => {
    dispatch(updateProjectInfo({ [field]: value }));
  };

  const addTechnology = () => {
    dispatch(updateProjectInfo({
      technologiesUsed: [...projectInfo.technologiesUsed, ''],
    }));
  };

  const updateTechnology = (index, value) => {
    const newTechnologies = [...projectInfo.technologiesUsed];
    newTechnologies[index] = value;
    dispatch(updateProjectInfo({ technologiesUsed: newTechnologies }));
  };

  const removeTechnology = (index) => {
    const newTechnologies = projectInfo.technologiesUsed.filter((_, i) => i !== index);
    dispatch(updateProjectInfo({ technologiesUsed: newTechnologies }));
  };

  return (
    <div className="w-full rounded-md dark:bg-slate-900 text-center ">
      <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="my-1 border border-white">
            {isCollapsibleOpen ? <ChevronUp /> : <ChevronDown />} Project Info
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 px-2 py-4">
          <hr className="border-white" />
          <div className="space-y-4 py-2">
            {/* Project Name */}
            <div>
              <Label>Project Name</Label>
              <Input
                className="mt-2 border-white"
                value={projectInfo.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="Enter your project name..."
              />
            </div>
            {/* Project Description */}
            <div>
              <Label>Project Description</Label>
              <Textarea
                className="mt-2 border-white"
                value={projectInfo.projectDescription}
                rows={4}
                onChange={(e) => handleChange('projectDescription', e.target.value)}
                placeholder="Describe your project here..."
              />
            </div>

            {/* Technologies Used */}
            <div>
              <Label>Technologies Used</Label>
              {projectInfo.technologiesUsed.map((tech, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Technology eg: React"
                    value={tech}
                    onChange={(e) => updateTechnology(index, e.target.value)}
                  />
                  <Button variant="destructive" onClick={() => removeTechnology(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={addTechnology} className="mt-2 ms-4 text-xs">
                <Plus size={14} /> Add Technology
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
