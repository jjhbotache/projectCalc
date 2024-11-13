import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function EditProjectDialog({ isDialogOpen, setDialogOpen, inputText, setInputText, handleEditProject }) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            ¿Qué deseas que la IA modifique del proyecto?
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ingresa la descripción..."
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEditProject}>
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
