import { updateFunctionalities, updateProjectInfo } from '../slices/projectSlice';

export const importJSON = (event, dispatch) => {
  
  const file = event.target.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const parsedContent = JSON.parse(content);
      console.log("Imported JSON file:", parsedContent);

      if (parsedContent.functionalities && Array.isArray(parsedContent.functionalities)) {
        dispatch(updateFunctionalities({ type: 'SET_ALL', payload: parsedContent.functionalities }));
      } else {
        console.error("functionalities not found or not an array in JSON");
      }

      if (parsedContent.projectInfo) {
        dispatch(updateProjectInfo(parsedContent.projectInfo));
      } else {
        console.error("projectInfo not found in JSON");
      }
    } catch (error) {
      console.error("Error parsing JSON file:", error);
    }
  };

  reader.onerror = (error) => {
    console.error("Error reading file:", error);
  };

  reader.readAsText(file);
};

export const exportJSON = (project) => {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `${sanitizeFileName(project.projectInfo.projectName)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};