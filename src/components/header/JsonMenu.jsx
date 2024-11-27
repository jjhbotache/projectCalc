import React, { useRef } from 'react';
import {  FileJson } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { exportJSON, importJSON } from '../../utils/jsonHandler';
import { useDispatch, } from 'react-redux';

export default function JsonMenu({ project, setJsonStructureOpen,displayData }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className={`dark:bg-gray-950 bg-white h-${displayData.btnsHeight} aspect-square p-0 rounded-full grid place-items-center`} title="JSON options">
        <FileJson className=" dark:text-white text-gray-950" size={displayData.iconsSize} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportJSON(project)}>
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => fileInputRef.current.click()}>
          Import JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setJsonStructureOpen(true)}>
          JSON Structure
        </DropdownMenuItem>
      </DropdownMenuContent>
      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        onChange={(e) => importJSON(e, dispatch)}
        accept=".json"
      />
    </DropdownMenu>
  );
}
