import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

export default function CancelModal({ open, onClose }) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¡Oh, no! :C</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Has cancelado la acción.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Cerrar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
