import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../slices/projectSlice';
import { Input } from '@/components/ui/input'; // Added import
import { Label } from '@/components/ui/label';

export default function HourlyRateInput() {
  const hourlyRate = useSelector((state) => state.project.settings.hourlyRate);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateSettings({ hourlyRate: Number(e.target.value) }));
  };

  return (
    <div className="">
      <Label className="block mb-2">Hourly Rate (USD)</Label>
      <Input
        type="number"
        value={hourlyRate}
        onChange={handleChange}
        className="w-full max-w-xs p-2 border rounded "
      />
    </div>
  );
}
