import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

function HelpContent({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent aria-describedby="help">
          <DialogTitle>Ayuda</DialogTitle>
        <DialogHeader>
        </DialogHeader>
        <DialogDescription>
          Esta es una calculadora para proyectos de programación, que calcula el tiempo y coste de desarrollo.
        </DialogDescription>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

export default HelpContent;
