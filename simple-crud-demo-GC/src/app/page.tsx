'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Alert } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import EditNoteModal from './components/EditNoteModal'
import Stack from '@mui/material/Stack'
import { Note } from '../../lib/types'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // getNotes now fetches from your API
  const getNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(data)
    } catch (err: any) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  // handleCreateNote now uses fetch with a POST request
  const handleCreateNote = async (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    setError(null)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      })
      if (!response.ok) throw new Error('Failed to create note')
      await getNotes() // Refetch notes
    } catch (err: any) {
      setError(err.message)
    }
  }

  // handleUpdateNote now uses fetch with a PUT request
  const handleUpdateNote = async (updatedNote: Note) => {
    setError(null)
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      })
      if (!response.ok) throw new Error('Failed to update note')
      await getNotes() // Refetch notes
      setOpenModal(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // handleDeleteNote now uses fetch with a DELETE request
  const handleDeleteNote = async (id: number) => {
    setError(null)
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete note')
      await getNotes() // Refetch notes
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleOpenModal = (note: Note) => {
    setSelectedNote(note)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setSelectedNote(null)
    setOpenModal(false)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth='md'>
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant='h4' component='h1' sx={{ py: 3 }}>
            Notes
          </Typography>

          {error && (
            <Alert severity='error' onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <NoteForm onCreate={handleCreateNote} />
          <NoteList
            notes={notes}
            onUpdate={handleOpenModal}
            onDelete={handleDeleteNote}
          />
        </Stack>
        <EditNoteModal
          open={openModal}
          onClose={handleCloseModal}
          note={selectedNote}
          onUpdate={handleUpdateNote}
        />
      </Container>
    </ThemeProvider>
  )
}
