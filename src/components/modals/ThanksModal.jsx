import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

export default function ThanksModal({ open, onClose }) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¡Gracias! :D</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          ¡Gracias por tu apoyo!
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Cerrar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
