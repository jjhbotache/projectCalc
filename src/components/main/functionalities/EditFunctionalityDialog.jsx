import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import useGemini from '@/hooks/useGemini';
import { Sparkles } from 'lucide-react';

export default function EditFunctionalityDialog({ functionality, setUpdatedFunctionality, setIsUpdateDialogOpen, disabled }) {
  const { editFunctionality } = useGemini();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [errorToShow, setErrorToShow] = useState("");

  const handleEditFunctionality = () => {
    toast.promise(
      editFunctionality(inputText, functionality)
        .then((newFunctionality) => {
          setUpdatedFunctionality(newFunctionality);
          setIsUpdateDialogOpen(true);
          setIsDialogOpen(false);
          setInputText('');
        })
        .catch((error) => {
          setErrorToShow(error);
          console.log(error);
          throw new Error(error);
          
        }),
      {
        pending: '✨ Generating functionality...',
        success: 'Functionality generated successfully 🚀',
        error: `${errorToShow}`,
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="p-2" disabled={disabled}>
        <Sparkles size={12} />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Functionality</DialogTitle>
            <DialogDescription>
              What do you want the AI to edit?
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the description..."
          />
          <DialogFooter className="gap-2">
            <Button onClick={handleEditFunctionality}>
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
