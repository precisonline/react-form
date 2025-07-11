import React, { useState } from 'react'
import { Box, TextField, Button, Paper } from '@mui/material'
import type { Task } from '@/types'

type EditTaskFormProps = {
  task: Task
  onSave: (updatedTask: Task) => void
  onCancel: () => void
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(task.title)

  const handleSave = () => {
    // Only save if the title has changed and isn't empty
    if (title.trim() && title.trim() !== task.title) {
      onSave({ ...task, title: title.trim() })
    } else {
      // If no changes, just cancel
      onCancel()
    }
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        bgcolor: 'primary.lighter',
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <Box
        component='form'
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <TextField
          fullWidth
          variant='outlined'
          label='Edit Task Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel} variant='text' color='secondary'>
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={handleSave}
            variant='contained'
            color='primary'
          >
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
