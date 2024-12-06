'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PopupDialog({ isOpen, onClose, onResponse }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you like it?</DialogTitle>
          <DialogDescription>
            Is Devkalk being useful to you?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onResponse('no')}>Not at all</Button>
          <Button onClick={() => onResponse('yes')}>Yes!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
