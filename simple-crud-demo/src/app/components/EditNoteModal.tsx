'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Box, TextField, Button, Typography } from '@mui/material'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

interface EditNoteModalProps {
  open: boolean
  onClose: () => void
  note: Note | null
  onUpdate: (note: Note) => void
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  open,
  onClose,
  note,
  onUpdate,
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    }
  }, [note])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (note) {
      onUpdate({ ...note, title, content })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='edit-note-modal'
      aria-describedby='edit-note-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id='edit-note-modal' variant='h6' component='h2'>
          Edit Note
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label='Title'
            variant='outlined'
            fullWidth
            margin='normal'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label='Content'
            variant='outlined'
            fullWidth
            margin='normal'
            required
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type='submit' variant='contained' color='primary'>
            Update Note
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditNoteModal
