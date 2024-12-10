import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectState } from '@/slices/projectSlice';

export default function useHistory() {
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('projectHistory') || '[]'));
  const [currentIndex, setCurrentIndex] = useState(JSON.parse(localStorage.getItem('historyIndex') || '-1'));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Save current project state to history whenever it changes
  useEffect(() => {

    const selectedProjectId = projectState.projectInfo.id;
    const lastHistoryProjectId = history[history.length-1]?.projectInfo.id;
    const itsChangingProject = lastHistoryProjectId!=undefined ?
      lastHistoryProjectId !== selectedProjectId
      : false;
    // console.log('itsChangingProject', itsChangingProject);
    // console.log('currentProjectId', selectedProjectId);
    // console.log('lastHistoryProjectId', lastHistoryProjectId);
    // console.log('history', history);
    
    
    
    if ( 
      JSON.stringify(history[currentIndex]) !== JSON.stringify(projectState) //only save if the state has changed
      &&
      (!itsChangingProject)
    ) {
      console.log('saving history');
      
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(projectState);
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }
  }, [projectState]);

  useEffect(() => {
    if (history.length > 0) {
      saveHistoryInLS();
    }else{
      localStorage.removeItem('projectHistory');
      localStorage.removeItem('historyIndex');
    }
  }, [history]);

  useEffect(() => {
    setCanUndo(currentIndex > 0);
    setCanRedo(currentIndex < history.length - 1);
  }, [currentIndex, history]);

  const saveHistoryInLS = () => {
    localStorage.setItem('projectHistory', JSON.stringify(history));
    localStorage.setItem('historyIndex', JSON.stringify(currentIndex));
  };

  const undo = () => {
    if (currentIndex > 0) {
      const prevState = history[currentIndex - 1];
      dispatch(setProjectState(prevState));
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      dispatch(setProjectState(nextState));
      setCurrentIndex(currentIndex + 1);
    }
  };
  return { undo, redo, canUndo, canRedo,history, setHistory, currentIndex, setCurrentIndex };
}
