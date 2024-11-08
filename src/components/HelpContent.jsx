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
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Ayuda</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Aquí va el contenido de ayuda.
        </DialogDescription>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

export default HelpContent;
