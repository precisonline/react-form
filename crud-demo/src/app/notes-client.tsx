'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/auth-helpers-nextjs'

import { createNote, deleteNote } from './actions'

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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

// Define types
type Note = {
  id: number
  title: string
  content: string
  user_id?: string
  tags?: string[]
  is_favorite?: boolean
  created_at?: string
  updated_at?: string
}

type NotesClientProps = {
  initialNotes: Note[]
  user: User
  schemaName: string
}

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

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleCreateNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreating(true)
    setError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createNote(formData)

      if (result.success) {
        // Reset form fields on success
        setTitle('')
        setContent('')
      } else {
        setError(`Failed to create note: ${result.error}`)
      }
    } catch (error: any) {
      setError(`Failed to create note: ${error.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    setIsDeleting(noteId)
    setError(null)

    try {
      const result = await deleteNote(noteId)

      if (!result.success) {
        setError(`Failed to delete note: ${result.error}`)
      }
    } catch (error: any) {
      setError(`Failed to delete note: ${error.message}`)
    } finally {
      setIsDeleting(null)
    }
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
          {initialNotes.length > 0 ? (
            initialNotes.map((note) => (
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
                    disabled={isDeleting === note.id}
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
    </>
  )
}
