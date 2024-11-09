import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../ui/dialog';
import HourlyRateInput from '../settings/HourlyRateInput';
import HoursPerDayInput from '../settings/HoursPerDayInput';
import { Button } from '@/components/ui/button';  
import { Settings } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Label } from '@/components/ui/label';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../slices/projectSlice';

export default function SettingsDialog() {
  const dispatch = useDispatch();
  const projectDescription = useSelector(state => state.project.settings.projectDescription);

  const handleDescriptionChange = (e) => {
    dispatch(updateSettings({ projectDescription: e.target.value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings className='dark:bg-gray-950 bg-white p-2 rounded-full' size={24} />
      </DialogTrigger>
      <DialogContent aria-describedby="Settings" className='max-h-[98%] overflow-y-auto gap-6'>
        <DialogTitle className='text-3xl'>Settings</DialogTitle>
        <HourlyRateInput />
        <HoursPerDayInput /> 

        <div>
          <Label className="block mb-2">Project Description</Label>
          <Textarea 
            value={projectDescription} // Bind to Redux state
            onChange={handleDescriptionChange} // Dispatch on change
            placeholder='Describe your project' 
            rows={5} 
            className='resize-none' 
          />
        </div>

        <DialogTrigger asChild className='w-14 ml-auto'>
          <Button>Close</Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
