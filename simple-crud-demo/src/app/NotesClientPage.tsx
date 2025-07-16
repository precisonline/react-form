'use client'

import { useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Types file
import { Note } from '../../lib/types'

// Material-UI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Alert } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

// Component Imports
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import EditNoteModal from './components/EditNoteModal'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function NotesClientPage({
  initialNotes,
}: {
  initialNotes: Note[]
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // Client for interactive Supabase actions
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // This function re-fetches data after an action
  const getNotes = useCallback(async () => {
    console.log('Fetching notes...')
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      setError(error.message)
    } else {
      console.log('Notes fetched:', data)
      setNotes((data as Note[]) || [])
    }
  }, [supabase])

  const handleCreateNote = async (newNote: Omit<Note, 'id' | 'created_at'>) => {
    setError(null)
    console.log('Creating note:', newNote)

    const { data, error: insertError } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      setError(insertError.message)
    } else {
      console.log('Note created successfully:', data)
      await getNotes()
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
      setError(updateError.message)
    } else {
      await getNotes()
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
      setError(deleteError.message)
    } else {
      await getNotes()
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
