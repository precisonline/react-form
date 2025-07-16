'use client'

import React from 'react'
import { List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import { Note } from '../../../lib/types'

interface NoteListProps {
  notes: Note[]
  onUpdate: (note: Note) => void
  onDelete: (id: string) => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onUpdate, onDelete }) => {
  return (
    <List>
      {notes.map((note) => (
        <ListItem key={note.id}>
          <ListItemText primary={note.title} secondary={note.content} />

          <IconButton
            edge='end'
            aria-label='edit'
            onClick={() => onUpdate(note)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge='end'
            aria-label='delete'
            onClick={() => onDelete(note.id)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}

export default NoteList
