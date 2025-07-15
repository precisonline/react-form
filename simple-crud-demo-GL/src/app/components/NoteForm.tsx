'use client'

import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

interface NoteFormProps {
  onCreate: (note: { title: string; content: string }) => void
}

const NoteForm: React.FC<NoteFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({ title, content })
    setTitle('')
    setContent('')
  }

  return (
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
        Create Note
      </Button>
    </Box>
  )
}

export default NoteForm
