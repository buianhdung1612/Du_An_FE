import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Tiptap } from '../../../shared/components/layouts/titap/Tiptap';

interface NoteEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent: string;
}

export const NoteEditorDialog = ({ open, onClose, onSave, initialContent }: NoteEditorDialogProps) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (open) {
      setContent(initialContent);
    }
  }, [open, initialContent]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{
        sx: { borderRadius: '24px' }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Ghi chú chi tiết</DialogTitle>
      <DialogContent sx={{ minHeight: '150px', pt: '8px !important' }}>
        <Tiptap 
          value={content}
          onChange={(newHtml) => setContent(newHtml)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: '8px' }}>Hủy</Button>
        <Button variant="contained" onClick={handleSave} sx={{ borderRadius: '8px' }}>Lưu ghi chú</Button>
      </DialogActions>
    </Dialog>
  );
};
