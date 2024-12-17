import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectState } from '@/slices/projectSlice';

export default function useHistory() {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.project);
  const [history, setHistory] = useState( 
    localStorage.getItem('projectHistory') || [currentProject]
  );
  const [currentIndex, setCurrentIndex] = useState( 
    localStorage.getItem('historyIndex') || 0
   );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  
  // Save current project state to history whenever it changes
  useEffect(() => {

    const selectedProjectId = currentProject.projectInfo.id;
    
    const lastHistoryProjectId =  history.length==0
      ? undefined
      : history[history.length-1].projectInfo?.id;

    const itsChangingBetweenProject = !(selectedProjectId === lastHistoryProjectId);
    const currentHistoryState = JSON.stringify(history[currentIndex]);
    const serializedProjectState = JSON.stringify(currentProject);
    const differentThanBefore = currentHistoryState !== serializedProjectState;
    
    
    

    
    if (differentThanBefore && (!itsChangingBetweenProject)) {
      
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(currentProject);
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }

  }, [currentProject]);

  
  useEffect(() => {
    if (history.length > 0) {
      saveHistoryInLS();
    }else{
      // localStorage.removeItem('projectHistory');
      // localStorage.removeItem('historyIndex');
    }

    if (! (currentIndex===null)){
      setCanUndo(currentIndex > 0);
      setCanRedo(currentIndex < history.length - 1);
    }
  }, [currentIndex, history]);

  const loadHistoryAndIndex = (history, index) => {
    setHistory(history);
    setCurrentIndex(index);
  }

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
  return { undo, redo, canUndo, canRedo,history, currentIndex, loadHistoryAndIndex };
}
