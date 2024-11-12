import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useSelector, useDispatch } from 'react-redux';
import { loadAndSaveConfigFromLocalStorage, updateConfig } from '../../slices/configSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
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

export default function AppConfigs({ open, onOpenChange }) {
  const config = useSelector((state) => state.config);
  
  const dispatch = useDispatch();

  const [hoursPerDay, setHoursPerDay] = useState(config.hoursPerDay);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(config.workingDaysPerWeek);
  const [hourlyRate, setHourlyRate] = useState(config.hourlyRate);
  const [geminiApiKey, setGeminiApiKey] = useState(config.geminiApiKey);

  useEffect(() => {
    setHoursPerDay(config.hoursPerDay);
    setWorkingDaysPerWeek(config.workingDaysPerWeek);
    setHourlyRate(config.hourlyRate);
    setGeminiApiKey(config.geminiApiKey);
  }, [config]);

  const handleSave = () => {
    dispatch(
      updateConfig({
        hoursPerDay,
        workingDaysPerWeek,
        hourlyRate,
        geminiApiKey,
      })
    );
    dispatch(loadAndSaveConfigFromLocalStorage({ type: 'save' }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent aria-describedby="settings" className="h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurations</DialogTitle>
          <DialogDescription>
            Configure your project settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Hourly Rate</Label>
            <Input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <Label>Hours per Day</Label>
            <Input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              min={1}
              max={24}
            />
          </div>
          <div>
            <Label>Working Days per Week</Label>
            <Input
              type="number"
              value={workingDaysPerWeek}
              onChange={(e) => setWorkingDaysPerWeek(Number(e.target.value))}
              min={1}
              max={7}
            />
          </div>
          <div>
            <Label>Gemini API Key</Label>
            <Input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

