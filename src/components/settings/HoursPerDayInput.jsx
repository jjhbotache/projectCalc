import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../slices/projectSlice';
import { Input } from '@/components/ui/input'; // Added import

export default function HoursPerDayInput() {
  const dispatch = useDispatch();
  const hoursPerDay = useSelector(state => state.project.settings.hoursPerDay);

  const handleChange = (e) => {
    dispatch(updateSettings({ hoursPerDay: Number(e.target.value) }));
  };

  return (
    <div>
      <label>Hours Per Day:</label>
      <Input 
        type="number" 
        value={hoursPerDay} 
        min="1"
        max="24"
        onChange={handleChange} 
        className="w-full max-w-xs p-2 border rounded " 
      />
    </div>
  );
}
