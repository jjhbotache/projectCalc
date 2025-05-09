import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectState, initialState } from '@/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { AlertCircle, Save } from 'lucide-react';
import { validateProjectData } from '@/utils/ProjectValidationUtil';

export default function JsonEditorMode() {
  const dispatch = useDispatch();
  const project = useSelector(state => state.project);
  const [jsonValue, setJsonValue] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonError, setJsonError] = useState('');
  
  useEffect(() => {
    try {
      setJsonValue(JSON.stringify(project, null, 2));
      setIsValidJson(true);
      setJsonError('');
    } catch (error) {
      console.error('Error stringifying project data:', error);
      setIsValidJson(false);
      setJsonError('Error processing project data');
    }
  }, [project]);
  
  const onChange = React.useCallback((value) => {
    setJsonValue(value);
    
    try {
      JSON.parse(value);
      setIsValidJson(true);
      setJsonError('');
    } catch (error) {
      setIsValidJson(false);
      setJsonError(error.message);
    }
  }, []);
  
  const handleSaveJson = () => {
    try {
      const parsedJson = JSON.parse(jsonValue);
      
      // Use the validation context to validate the project structure
      const validationResult = validateProjectData(parsedJson);
      
      if (!validationResult.valid) {
        // Show the first error in toast, but log all errors
        console.error('JSON validation errors:', validationResult.errors);
        toast.error(validationResult.errors[0]);
        return;
      }
      
      dispatch(setProjectState(parsedJson));
      toast.success('Project JSON updated successfully');
    } catch (error) {
      toast.error('Failed to save: ' + error.message);
    }
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          {!isValidJson && (
            <div className="text-red-500 flex items-center mr-2">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">
                {jsonError ? `JSON Error: ${jsonError}` : 'Invalid JSON format'}
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={handleSaveJson}
          disabled={!isValidJson}
          className="flex items-center"
        >
          <Save size={16} className="mr-1" />
          Save Changes
        </Button>
      </div>
      
      <div className="h-[calc(100vh-220px)]">
        <CodeMirror
          value={jsonValue}
          height="100%"
          theme={vscodeDark}
          extensions={[json()]}
          onChange={onChange}
          className="border rounded-md overflow-hidden"
        />
      </div>
    </div>
  );
}