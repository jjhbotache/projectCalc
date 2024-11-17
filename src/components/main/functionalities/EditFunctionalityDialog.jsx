import { useState } from 'react';
import { Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import useGemini from '@/hooks/useGemini';
import { Sparkles } from 'lucide-react';

export default function EditFunctionalityDialog({ functionality, setUpdatedFunctionality, setIsUpdateDialogOpen }) {
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
      <Button onClick={() => setIsDialogOpen(true)} className="p-2">
        <Sparkles size={12} />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionalidad</DialogTitle>
            <DialogDescription>
              Que quieres que la IA edite?
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ingresa la descripción..."
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditFunctionality}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
