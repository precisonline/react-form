'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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
  const [openModal, setOpenModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getNotes() {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes((data as Note[]) || [])
      }
    }

    getNotes()
  }, [supabase])

  const handleCreateNote = async (newNote: Omit<Note, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
    } else {
      setNotes([...notes, data])
    }
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ title: updatedNote.title, content: updatedNote.content })
      .eq('id', updatedNote.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating note:', error)
    } else {
      setNotes(notes.map((note) => (note.id === updatedNote.id ? data : note)))
      setOpenModal(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) {
      console.error('Error deleting note:', error)
    } else {
      setNotes(notes.filter((note) => note.id !== id))
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
