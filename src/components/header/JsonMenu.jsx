import React, { useRef, useState } from 'react';
import { FileArchive } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { exportJSON, importJSON } from '../../utils/jsonHandler';
import { useDispatch, useSelector } from 'react-redux';

export default function JsonMenu({ project, setJsonStructureOpen }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FileArchive className="dark:bg-gray-950 bg-white p-2 rounded-full" size={24} />
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
