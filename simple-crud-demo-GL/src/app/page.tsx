'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Alert } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import EditNoteModal from './components/EditNoteModal'
import Stack from '@mui/material/Stack'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

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
  const supabase = createClientComponentClient()

  const getNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      setError(error.message)
    } else {
      setNotes((data as Note[]) || [])
    }
  }, [supabase])

  useEffect(() => {
    getNotes()
  }, [getNotes])

  const handleCreateNote = async (newNote: Omit<Note, 'id' | 'created_at'>) => {
    setError(null)

    const { error: insertError } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating note:', insertError)
      setError(insertError.message)
    } else {
      await getNotes() // Refetch notes to get the latest list
    }
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    setError(null)
    const { error: updateError } = await supabase
      .from('notes')
      .update({ title: updatedNote.title, content: updatedNote.content })
      .eq('id', updatedNote.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating note:', updateError)
      setError(updateError.message)
    } else {
      await getNotes() // Refetch notes to get the latest list
      setOpenModal(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    setError(null)
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting note:', deleteError)
      setError(deleteError.message)
    } else {
      await getNotes() // Refetch notes to get the latest list
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
          <Typography
            variant='h4'
            component='h1'
            sx={{
              py: 3,
            }}
          >
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
