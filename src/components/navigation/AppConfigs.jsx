import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useSelector, useDispatch } from 'react-redux';
import { loadAndSaveConfigFromLocalStorage, updateConfig, importConfig, exportConfig } from '@/slices/configSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { DialogDescription } from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';
import { Import, SquareArrowUpRight } from 'lucide-react';
import useGemini from '@/hooks/useGemini';

export default function AppConfigs({ open, onOpenChange }) {
  const config = useSelector((state) => state.config);
  
  const dispatch = useDispatch();

  const [newTechName, setNewTechName] = useState('');
  const [newTechExpertise, setNewTechExpertise] = useState('beginner');
  const [isGeminiDialogOpen, setIsGeminiDialogOpen] = useState(false);
  const [newGeminiApiKey, setNewGeminiApiKey] = useState('');
  const fileInputRef = useRef(null);
  const [models, setModels] = useState([]);
  const { listModels } = useGemini();

  useEffect(() => {
    listModels().then((models) => {
      setModels(models); 
    });
  }, []);

  const handleAddTechnology = () => {
    if (newTechName.trim()) {
      const updatedTechnologies = [
        ...config.technologiesKnown,
        { name: newTechName.trim(), expertise: newTechExpertise },
      ];
      dispatch(updateConfig({ technologiesKnown: updatedTechnologies }));
      dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
      setNewTechName('');
      setNewTechExpertise('beginner');
    }
  };
  
  const handleRemoveTechnology = (index) => {
    const updatedTechnologies = config.technologiesKnown.filter((_, i) => i !== index);
    dispatch(updateConfig({ technologiesKnown: updatedTechnologies }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
  };

  const handleSaveGeminiApiKey = () => {
    dispatch(updateConfig({ geminiApiKey: newGeminiApiKey }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
    setIsGeminiDialogOpen(false);
    toast.success('Gemini API Key updated successfully');
  };

  const handleImportConfig = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const importedConfig = JSON.parse(e.target.result);
      dispatch(importConfig(importedConfig));
      dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
      toast.success('Configuration imported successfully');
      event.target.value = null;
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const handleExportConfig = () => {
    dispatch(exportConfig());
    toast.success('Configuration exported successfully');
    // si la config tiene la geminiApiKey, se advierte al usuario que tenga cuidado con la API Key
    config.geminiApiKey && toast.warning('Remember to keep your Gemini API Key safe',{ autoClose: 10000, });
  };

  const handleImportButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChangeModel = (value) => {
    const cleanValue = value.startsWith('models/') ? value.replace('models/', '') : value;
    dispatch(updateConfig({ model: cleanValue }));
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent aria-describedby="settings" className="h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurations</DialogTitle>
            <DialogDescription>
              Configure your project settings
            </DialogDescription>
            <div className="flex justify-end gap-1 items-center">
              <span>Import/Export Config</span>

              <Button className="p-1 h-7" onClick={handleExportConfig}>
                <SquareArrowUpRight size={16} />
              </Button>

              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className='hidden'
                ref={fileInputRef}
              />
              <Button className="p-1 h-7" onClick={handleImportButtonClick}>
                <Import size={16} />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Hourly Rate</Label>
              <Input
                type="number"
                value={config.hourlyRate}
                onChange={(e) => {
                  dispatch(updateConfig({ hourlyRate: Number(e.target.value) }));
                  dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
                }}
                min={0}
              />
            </div>
            <div>
              <Label>Hours per Day</Label>
              <Input
                type="number"
                value={config.hoursPerDay}
                onChange={(e) => {
                  dispatch(updateConfig({ hoursPerDay: Number(e.target.value) }));
                  dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
                }}
                min={1}
                max={24}
              />
            </div>
            <div>
              <Label>Working Days per Week</Label>
              <Input
                type="number"
                value={config.workingDaysPerWeek}
                onChange={(e) => {
                  dispatch(updateConfig({ workingDaysPerWeek: Number(e.target.value) }));
                  dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
                }}
                min={1}
                max={7}
              />
            </div>
            <div>
              <Label>Model</Label>
              <Select value={"models/"+config.model} onValueChange={handleChangeModel}>
                <SelectTrigger >
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.displayName || m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Gemini API Key</Label>
              <span>
              {
                  config.geminiApiKey 
                  ? config.geminiApiKey.slice(0, 4) + "*************"
                  : "No API Key"
                }
              </span>
              <Button onClick={() => setIsGeminiDialogOpen(true)}>Update Gemini API Key</Button>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"><small className="text-gray-500 underline">
                Get your Gemini API Key here
              </small></a>
            </div>
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Technology name"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                />
                <Select value={newTechExpertise} onValueChange={setNewTechExpertise}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expertise level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTechnology}>Add</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technology</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.technologiesKnown.map((tech, index) => (
                    <TableRow key={index}>
                      <TableCell>{tech.name}</TableCell>
                      <TableCell className="capitalize">{tech.expertise}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveTechnology(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
          </div>
          <DialogClose />
        </DialogContent>
      </Dialog>
      

      
      <Dialog open={isGeminiDialogOpen} onOpenChange={setIsGeminiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Gemini API Key</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter your new Gemini API Key below.
          </DialogDescription>
          <Input
            type="text"
            value={newGeminiApiKey}
            onChange={(e) => setNewGeminiApiKey(e.target.value)}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsGeminiDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGeminiApiKey}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

