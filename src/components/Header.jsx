import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { toggleDarkMode } from '../slices/themeSlice';

export default function Header() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Project Planner</h2>
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-800' : 'bg-gray-800 text-yellow-400'}`}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
}
