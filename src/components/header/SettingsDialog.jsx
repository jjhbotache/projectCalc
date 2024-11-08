import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../ui/dialog';
import HourlyRateInput from '../settings/HourlyRateInput';
import HoursPerDayInput from '../settings/HoursPerDayInput';
import { Button } from '@/components/ui/button';  
import { Settings } from 'lucide-react';

export default function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings className='dark:bg-gray-950 bg-white p-2 rounded-full' size={24} />
      </DialogTrigger>
      <DialogContent aria-describedby="Settings">
        <DialogTitle className='text-3xl'>Settings</DialogTitle>
        <HourlyRateInput />
        <HoursPerDayInput /> 
        <DialogTrigger asChild className='w-14 ml-auto'>
          <Button>Close</Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
