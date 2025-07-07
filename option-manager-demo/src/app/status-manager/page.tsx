'use client'

import React, { useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
} from '@mui/material'
import { ArrowBack, Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { ChromePicker } from 'react-color'

interface Option {
  id: string
  name: string
  color: string
  order: number
  active: boolean
  type: 'status' | 'priority' | 'classification'
}

interface StatusFlowManagerProps {
  options: Option[]
  onSave: (options: Option[]) => Promise<void>
  onReorder: (startIndex: number, endIndex: number) => void
  onDelete: (id: string) => void
}

const EditStatusForm = ({
  status,
  onSave,
  onCancel,
  onDelete,
}: {
  status: Option
  onSave: (id: string, name: string, color: string) => void
  onCancel: () => void
  onDelete: (id: string) => void
}) => {
  const [editForm, setEditForm] = useState({
    name: status.name,
    color: status.color,
  })
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colorOptions = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
  ]

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSave(status.id, editForm.name, editForm.color)
  }

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel()
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(status.id)
  }

  return (
    <Box sx={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
      <TextField
        value={editForm.name}
        onChange={(e) =>
          setEditForm((prev) => ({ ...prev, name: e.target.value }))
        }
        size='small'
        fullWidth
        autoFocus
        sx={{ mb: 1, '& .MuiInputBase-root': { backgroundColor: 'white' } }}
        onKeyDown={(e) => {
          if (e.key === 'Enter')
            onSave(status.id, editForm.name, editForm.color)
          if (e.key === 'Escape') onCancel()
        }}
      />
      <Box display='flex' flexWrap='wrap' gap={0.5} my={1}>
        {colorOptions.map((color) => (
          <Box
            key={color}
            onClick={() => setEditForm((prev) => ({ ...prev, color }))}
            sx={{
              width: 20,
              height: 20,
              backgroundColor: color,
              borderRadius: '50%',
              cursor: 'pointer',
              border:
                editForm.color === color ? '2px solid white' : '1px solid grey',
            }}
          />
        ))}
      </Box>
      <Button size='small' onClick={() => setShowColorPicker((prev) => !prev)}>
        ⚙️ Custom Color
      </Button>
      {showColorPicker && (
        <Box sx={{ mt: 1, position: 'absolute', zIndex: 2, right: 0 }}>
          <ChromePicker
            color={editForm.color}
            onChange={(color) =>
              setEditForm((prev) => ({ ...prev, color: color.hex }))
            }
          />
        </Box>
      )}
      <Box
        display='flex'
        justifyContent='space-around'
        mt={showColorPicker ? 25 : 1}
      >
        <Button
          size='small'
          onClick={handleSaveClick}
          sx={{ color: 'lightgreen' }}
        >
          ✓
        </Button>
        <Button size='small' onClick={handleCancelClick} sx={{ color: 'pink' }}>
          ✕
        </Button>
        <Button size='small' onClick={handleDeleteClick} sx={{ color: 'pink' }}>
          🗑
        </Button>
      </Box>
    </Box>
  )
}

const StatusFlowManager: React.FC<StatusFlowManagerProps> = ({
  options,
  onSave,
  onReorder,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newStatusForm, setNewStatusForm] = useState({
    name: '',
    color: '#2196f3',
  })

  const sortedOptions = [...options].sort((a, b) => a.order - b.order)

  const handleEditSave = useCallback(
    async (id: string, name: string, color: string) => {
      const updatedOptions = options.map((opt) =>
        opt.id === id ? { ...opt, name, color } : opt
      )
      await onSave(updatedOptions)
      setEditingId(null)
    },
    [options, onSave]
  )

  const handleAddStatus = useCallback(async () => {
    if (!newStatusForm.name.trim()) return
    const newStatus: Option = {
      id: `status_${Date.now()}`,
      name: newStatusForm.name,
      color: newStatusForm.color,
      order: options.length,
      active: true,
      type: 'status',
    }
    await onSave([...options, newStatus])
    setNewStatusForm({ name: '', color: '#2196f3' })
    setIsAdding(false)
  }, [newStatusForm, options, onSave])

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return
      onReorder(result.source.index, result.destination.index)
    },
    [onReorder]
  )

  return (
    <Card>
      <CardContent>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h6'>Task Status Flow</Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setIsAdding(true)}
            size='small'
          >
            Add Status
          </Button>
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='status-flow' direction='horizontal'>
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {sortedOptions.map((status, index) => (
                    <React.Fragment key={status.id}>
                      <Draggable draggableId={status.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: status.color,
                              color: 'white',
                              minWidth: 140,
                              cursor: 'grab',
                              position: 'relative',
                            }}
                            onClick={() =>
                              !snapshot.isDragging && setEditingId(status.id)
                            }
                          >
                            {editingId === status.id ? (
                              <EditStatusForm
                                status={status}
                                onSave={handleEditSave}
                                onCancel={() => setEditingId(null)}
                                onDelete={onDelete}
                              />
                            ) : (
                              <>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 1,
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {status.name}
                                </Typography>
                              </>
                            )}
                          </Box>
                        )}
                      </Draggable>
                      {index < sortedOptions.length - 1 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 3,
                            borderRadius: 1,
                            backgroundColor: 'grey.300',
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                  {isAdding && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: newStatusForm.color,
                        minWidth: 140,
                      }}
                    >
                      <TextField
                        value={newStatusForm.name}
                        onChange={(e) =>
                          setNewStatusForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder='Status name'
                        size='small'
                        fullWidth
                        autoFocus
                        sx={{
                          mb: 1,
                          '& .MuiInputBase-root': { backgroundColor: 'white' },
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddStatus()
                          if (e.key === 'Escape') setIsAdding(false)
                        }}
                      />
                      <Box display='flex' justifyContent='space-around'>
                        <Button
                          size='small'
                          onClick={handleAddStatus}
                          sx={{ color: 'lightgreen' }}
                        >
                          ✓
                        </Button>
                        <Button
                          size='small'
                          onClick={() => setIsAdding(false)}
                          sx={{ color: 'pink' }}
                        >
                          ✕
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}

export default function StatusManagerPage() {
  const [statuses, setStatuses] = useState<Option[]>([
    {
      id: '1',
      name: 'OPEN',
      color: '#2196f3',
      order: 0,
      active: true,
      type: 'status',
    },
    {
      id: '2',
      name: 'IN PROGRESS',
      color: '#ff9800',
      order: 1,
      active: true,
      type: 'status',
    },
    {
      id: '3',
      name: 'REVIEW',
      color: '#9c27b0',
      order: 2,
      active: true,
      type: 'status',
    },
    {
      id: '4',
      name: 'DONE',
      color: '#4caf50',
      order: 3,
      active: true,
      type: 'status',
    },
  ])

  const handleSave = useCallback(async (updatedStatuses: Option[]) => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    setStatuses(updatedStatuses)
  }, [])

  const handleReorder = useCallback((startIndex: number, endIndex: number) => {
    setStatuses((prevStatuses) => {
      const reordered = Array.from(prevStatuses)
      const [removed] = reordered.splice(startIndex, 1)
      reordered.splice(endIndex, 0, removed)
      return reordered.map((status, index) => ({ ...status, order: index }))
    })
  }, [])

  const handleDelete = useCallback((statusId: string) => {
    setStatuses((prevStatuses) => {
      if (prevStatuses.length <= 1) {
        alert('Cannot delete the last status. At least one status is required.')
        return prevStatuses
      }
      if (window.confirm('Are you sure you want to delete this status?')) {
        const updatedOptions = prevStatuses.filter((opt) => opt.id !== statusId)
        return updatedOptions.map((opt, index) => ({ ...opt, order: index }))
      }
      return prevStatuses
    })
  }, [])

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={4}>
        <Button component={Link} href='/' startIcon={<ArrowBack />}>
          Back to Home
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          Status Manager
        </Typography>
        <Typography variant='body1' color='textSecondary' paragraph>
          Drag status cards to reorder • Click status to edit • Click + to add
          new status
        </Typography>
      </Box>
      <StatusFlowManager
        options={statuses}
        onSave={handleSave}
        onReorder={handleReorder}
        onDelete={handleDelete}
      />
    </Container>
  )
}
