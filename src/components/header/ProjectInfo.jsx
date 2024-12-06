import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectInfo } from '../../slices/projectSlice';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Wrench } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import ExpandibleInput from '../global/ExpandibleInput';

export default function ProjectInfo() {
  const dispatch = useDispatch();
  const projectInfo = useSelector(state => state.project.projectInfo);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const addDeliverable = () => {
    dispatch(updateProjectInfo({
      deliverables: [...projectInfo.deliverables, ''],
    }));
  };

  const updateDeliverable = (index, value) => {
    const newDeliverables = [...projectInfo.deliverables];
    newDeliverables[index] = value;
    dispatch(updateProjectInfo({ deliverables: newDeliverables }));
  };

  const removeDeliverable = (index) => {
    const newDeliverables = projectInfo.deliverables.filter((_, i) => i !== index);
    dispatch(updateProjectInfo({ deliverables: newDeliverables }));
  };

  return (
    <div className="rounded-md text-center ">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div>
            <Button variant="outline" size="sm" >
              <Wrench size={16}/>
              Project Info
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className=" px-2 py-4 max-h-[95%] overflow-y-auto">
          <DialogTitle>Project Info</DialogTitle>
          <DialogDescription asChild>
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

              {/* Technologies Used Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="technologies">
                  <AccordionTrigger>Technologies Used</AccordionTrigger>
                  <AccordionContent className="px-1" >
                      {projectInfo.technologiesUsed.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <ExpandibleInput
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Deliverables Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="deliverables">
                  <AccordionTrigger>Deliverables</AccordionTrigger>
                  <AccordionContent className="px-1" >
                      {projectInfo.deliverables.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <ExpandibleInput
                            type="text"
                            placeholder="Deliverable e.g.: Project Report"
                            value={item}
                            onChange={(e) => updateDeliverable(index, e.target.value)}
                          />
                          <Button variant="destructive" onClick={() => removeDeliverable(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addDeliverable} className="mt-2 ms-4 text-xs">
                        <Plus size={14} /> Add Deliverable
                      </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
