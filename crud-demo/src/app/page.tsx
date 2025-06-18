'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

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
  CircularProgress,
  Stack,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

type Note = { id: number; title: string; content: string }

export default function HomePage() {
  const router = useRouter()
  // This is the generic client, used for auth purposes only
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [user, setUser] = useState<User | null>(null)
  const [schemaName, setSchemaName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Notes state
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // ===================================================================
  // ========= KEY CHANGE: Create a Schema-Specific Client =========
  // ===================================================================
  // We use useMemo to create a new Supabase client instance only when the
  // schemaName changes. This new client is configured to ONLY work
  // with the user's private schema.
  const supabaseTenantClient = useMemo(() => {
    if (!schemaName) return null

    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: {
          // This sets the schema for all queries from this client
          schema: schemaName,
        },
      }
    )
  }, [schemaName])
  // ===================================================================

  const fetchNotes = useCallback(async () => {
    // We must use the new, schema-specific client for data operations
    if (!supabaseTenantClient) return

    const { data, error } = await supabaseTenantClient
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching notes:', error)
    else setNotes(data as Note[])
  }, [supabaseTenantClient]) // Depends on the memoized client

  const handleCreateNote = async (e: React.FormEvent) => {
    console.log('Schema Name on click:', schemaName)
    e.preventDefault()
    if (!supabaseTenantClient) return

    await supabaseTenantClient.from('notes').insert({ title, content })
    setTitle('')
    setContent('')
    fetchNotes()
  }

  const handleDeleteNote = async (id: number) => {
    if (!supabaseTenantClient) return
    await supabaseTenantClient.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  // --- Auth and Session Handling ---

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        setSchemaName(session.user.user_metadata.schema_name)
      }
      setLoading(false)
    }
    getSession()
  }, [supabase.auth])

  // Fetch notes once the schema-specific client is ready
  useEffect(() => {
    if (supabaseTenantClient) {
      fetchNotes()
    }
  }, [supabaseTenantClient, fetchNotes])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  // --- Render Logic ---

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    )
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

        <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant='h5' component='h2' gutterBottom>
              Add a New Note
            </Typography>
            <Box component='form' onSubmit={handleCreateNote}>
              <Stack spacing={2}>
                <TextField
                  label='Title'
                  variant='outlined'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label='Content'
                  variant='outlined'
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  fullWidth
                />
              </Stack>
              <Button
                type='submit'
                variant='contained'
                startIcon={<AddCircleOutlineIcon />}
                sx={{ mt: 2 }}
              >
                Add Note
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
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size='small'
                    color='secondary'
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
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
