'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/auth-helpers-nextjs'

import { createNote, deleteNote, updateNote } from './actions'

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Card,
  CardContent,
  CardActions,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Modal,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EditIcon from '@mui/icons-material/Edit'

// Define types
type Note = {
  id: number
  title: string
  content: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

type NotesClientProps = {
  initialNotes: Note[]
  user: User
  schemaName: string
}

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
} as const

export default function NotesClient({
  initialNotes,
  user,
  schemaName,
}: NotesClientProps) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // --- STATE MANAGEMENT ---
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // State for editing a note
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // --- AUTH HANDLER ---
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth') // No need for router.refresh() here
  }

  // --- CRUD HANDLERS ---
  const handleCreateNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreating(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await createNote(formData)

    if (result.success && result.data) {
      // Add the new note to the top of the client-side list
      setNotes((prevNotes) => [result.data as Note, ...prevNotes])
      setNewTitle('')
      setNewContent('')
    } else {
      setError(result.error || 'Failed to create note.')
    }
    setIsCreating(false)
  }

  const handleDeleteNote = async (noteId: number) => {
    // Optimistic UI: Remove note from UI immediately
    const originalNotes = notes
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
    setIsDeleting(noteId)
    setError(null)

    const result = await deleteNote(noteId)

    if (!result?.success) {
      // If the deletion fails, revert the change and show an error
      setError(result?.error || 'Failed to delete the note.')
      setNotes(originalNotes)
    }
    setIsDeleting(null)
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return

    setIsUpdating(true)
    setError(null)

    const result = await updateNote(
      editingNote.id,
      editingNote.title,
      editingNote.content
    )

    if (result.success && result.data) {
      // Update the note in the client-side list
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNote.id ? (result.data as Note) : note
        )
      )
      setEditingNote(null) // Close the modal
    } else {
      setError(result.error || 'Failed to update note.')
    }
    setIsUpdating(false)
  }

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            My Private Notes
          </Typography>
          <Typography
            variant='body2'
            sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
          >
            {user?.email}
          </Typography>
          <Button color='inherit' onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography
          variant='caption'
          color='text.secondary'
          gutterBottom
          component='div'
        >
          Your data is stored in private schema:{' '}
          <code
            style={{
              background: '#333',
              padding: '2px 4px',
              borderRadius: '4px',
            }}
          >
            {schemaName}
          </code>
        </Typography>

        {error && (
          <Alert severity='error' sx={{ my: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant='h5' component='h2' gutterBottom>
              Add a New Note
            </Typography>
            <Box component='form' onSubmit={handleCreateNote}>
              <Stack spacing={2}>
                <TextField
                  name='title'
                  label='Title'
                  variant='outlined'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  fullWidth
                  disabled={isCreating}
                />
                <TextField
                  name='content'
                  label='Content'
                  variant='outlined'
                  multiline
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  fullWidth
                  disabled={isCreating}
                />
              </Stack>
              <Button
                type='submit'
                variant='contained'
                startIcon={
                  isCreating ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <AddCircleOutlineIcon />
                  )
                }
                sx={{ mt: 2 }}
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Note'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant='h4' component='h2' gutterBottom>
          Your Notes
        </Typography>
        <Stack spacing={2}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id} sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant='h6'>{note.title}</Typography>
                  <Typography
                    color='text.secondary'
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {note.content}
                  </Typography>
                  {note.created_at && (
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Created: {new Date(note.created_at).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => setEditingNote(note)}
                    disabled={isDeleting !== null}
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    size='small'
                    color='secondary'
                    startIcon={
                      isDeleting === note.id ? (
                        <CircularProgress size={16} color='inherit' />
                      ) : (
                        <DeleteIcon />
                      )
                    }
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={isDeleting !== null}
                  >
                    {isDeleting === note.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography>You have no notes yet. Add one above!</Typography>
          )}
        </Stack>
      </Container>

      {/* Edit Note Modal */}
      <Modal open={editingNote !== null} onClose={() => setEditingNote(null)}>
        <Box sx={modalStyle}>
          <Typography variant='h6' component='h2'>
            Edit Note
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label='Title'
              variant='outlined'
              value={editingNote?.title || ''}
              onChange={(e) =>
                setEditingNote((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              fullWidth
            />
            <TextField
              label='Content'
              variant='outlined'
              multiline
              rows={4}
              value={editingNote?.content || ''}
              onChange={(e) =>
                setEditingNote((prev) =>
                  prev ? { ...prev, content: e.target.value } : null
                )
              }
              fullWidth
            />
          </Stack>
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            <Button onClick={() => setEditingNote(null)} color='secondary'>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateNote}
              variant='contained'
              disabled={isUpdating}
              startIcon={isUpdating ? <CircularProgress size={20} /> : null}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
