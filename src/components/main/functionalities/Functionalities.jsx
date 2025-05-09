import { useState } from "react";
import ReorderFunctionalityItem from "./ReorderFunctionalityItem"; // Importar el nuevo componente
import { CirclePlus, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  updateFunctionalities,
  updateProjectInfo,
} from "@/slices/projectSlice";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import useGemini from "@/hooks/useGemini";
import { toast } from "react-toastify";
import { Reorder } from "framer-motion"; // Eliminar useDragControls de aquí
import { useIsMobile } from "@/hooks/use-mobile";

export default function Functionalities({ functionalities, dragEnabled }) {
  const [expandedFunctionalityId, setExpandedFunctionalityId] = useState(null);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAiFunctionalityAlertOpen, setIsAiFunctionalityAlertOpen] =
    useState(false);
  const [description, setDescription] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const { generateProjectFromDescription, addFunctionality } = useGemini();
  const [errorToShow, setErrorToShow] = useState("");
  const inInitialState =
    project.functionalities.length === 1 &&
    project.functionalities[0].name === "Default Functionality";

  const addFunctionalityManually = () => {
    console.log("Adding functionality");

    dispatch(
      updateFunctionalities({
        type: "ADD_FUNCTIONALITY",
        payload: {
          id:
            project.functionalities.length > 0
              ? Math.max(...project.functionalities.map((f) => f.id)) + 1
              : 1,
          name: "New Functionality",
          tasks: [],
          techCost: 0,
          laborCost: 0,
          duration: 0,
          monthlyCost: 0,
        },
      })
    );
  };

  const handleReorder = (newOrder) => {
    dispatch(updateFunctionalities({ type: "SET_ALL", payload: newOrder }));
  };

  const handleGenerate = () => {
    setIsAlertOpen(false);
    toast.promise(
      generateProjectFromDescription(description)
        .then((project) => {
          dispatch(
            updateFunctionalities({
              type: "SET_ALL",
              payload: project.functionalities,
            })
          );
          dispatch(updateProjectInfo(project.projectInfo));
        })
        .catch((error) => {
          setErrorToShow(error);
          console.log(error);
          throw new Error(error);
        }),
      {
        pending: "✨Generating project...",
        success: "Project generated successfully 🚀",
        error: `${errorToShow}`,
      }
    );
  };

  const handleAddAiFunctionality = () => {
    setIsAiFunctionalityAlertOpen(false);
    toast.promise(
      addFunctionality(aiDescription)
        .then((newFunctionality) => {
          if (newFunctionality) {
            dispatch(
              updateFunctionalities({
                type: "ADD_FUNCTIONALITY",
                payload: {
                  ...newFunctionality,
                  id:
                    project.functionalities.length > 0
                      ? Math.max(...project.functionalities.map((f) => f.id)) +
                        1
                      : 1,
                },
              })
            );
          }
        })
        .catch((error) => {
          setErrorToShow(error);
          console.log(error);
          throw new Error(error);
        }),
      {
        pending: "✨Generating AI functionality...",
        success: "AI functionality added successfully 🚀",
        error: `${errorToShow}`,
      }
    );
  };

  return (
    <>
      <Reorder.Group
        axis="y"
        values={functionalities}
        onReorder={handleReorder}
        className={`flex flex-col ${
          !dragEnabled ? "gap-3" : "gap-8"
        } w-full my-4`}
      >
        {functionalities.map((functionality) => (
          <ReorderFunctionalityItem
            key={functionality.id}
            functionality={functionality}
            isCollapsed={expandedFunctionalityId !== functionality.id}
            onToggle={() => {
              setExpandedFunctionalityId(
                expandedFunctionalityId === functionality.id
                  ? null
                  : functionality.id
              );
            }}
            dragEnabled={dragEnabled}
          />
        ))}
      </Reorder.Group>

      {(functionalities.length === 0 || inInitialState) && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-gray-500 text-center ">
            Create your project with Gemini
          </h1>
          <p className="text-gray-500 ">
            Use AI to create the proyect you have in mind{" "}
          </p>

          <Button
            onClick={() => setIsAlertOpen(true)}
            className="bg-blue-700 text-white hover:bg-blue-600 mb-10 rounded-full self-center text-2xl"
            size="lg"
          >
            <Sparkle size={24} />
            Generate
          </Button>
        </div>
      )}

      {functionalities.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-gray-500">
            No functionalities added
          </h1>
          <p className="text-gray-500">
            Click the button below to add a new functionality
          </p>
        </div>
      )}

      <div className="mb-11 flex gap-2 justify-center">
        <Button
          onClick={addFunctionalityManually}
          className="bg-blue-700 text-white hover:bg-blue-600 rounded-full self-center p-2 aspect-square"
          title="Add Functionality"
        >
          <CirclePlus />
        </Button>
        <Button
          onClick={() => setIsAiFunctionalityAlertOpen(true)}
          className="bg-white text-purple-600 rounded-full self-center p-2 aspect-square hover:bg-purple-300"
          title="Add a Functionality with AI"
        >
          <Sparkle />
        </Button>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project Description</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter a detailed description of your project to generate
              the functionalities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe your project..."
              rows={7}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerate}>
              Generate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isAiFunctionalityAlertOpen}
        onOpenChange={setIsAiFunctionalityAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Functionality Description</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter a detailed description of the functionality you want
              to create with AI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe the functionality..."
              rows={7}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddAiFunctionality}>
              Generate Functionality
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
