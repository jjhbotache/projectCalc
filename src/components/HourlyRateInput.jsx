import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../slices/projectSlice';
import { Input } from '@/components/ui/input'; // Added import

export default function HourlyRateInput() {
  const hourlyRate = useSelector((state) => state.project.settings.hourlyRate);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(updateSettings({ hourlyRate: Number(e.target.value) }));
  };

  return (
    <div className="pb-4 ">
      <label className="block mb-2">Hourly Rate (USD)</label>
      <Input
        type="number"
        value={hourlyRate}
        onChange={handleChange}
        className="w-full max-w-xs p-2 border rounded "
      />
    </div>
  );
}
