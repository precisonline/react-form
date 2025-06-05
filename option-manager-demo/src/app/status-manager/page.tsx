// src/app/status-manager/page.tsx
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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { ChromePicker } from 'react-color'

// Import shared types
import { Option, StatusFlowManagerProps } from '../types/options'

const StatusFlowManager: React.FC<StatusFlowManagerProps> = ({
  options,
  onSave,
  onReorder,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    color: '',
    showColorPicker: false,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [newStatusForm, setNewStatusForm] = useState({
    name: '',
    color: '#2196f3',
    showColorPicker: false,
  })

  const sortedOptions = [...options].sort((a, b) => a.order - b.order)

  // Extended color palette
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
    '#424242',
    '#000000',
  ]

  const handleEditStart = useCallback((option: Option) => {
    setEditingId(option.id)
    setEditForm({
      name: option.name,
      color: option.color,
      showColorPicker: false,
    })
  }, [])

  const handleEditSave = useCallback(async () => {
    if (!editingId) return

    const updatedOptions = options.map((opt) =>
      opt.id === editingId
        ? { ...opt, name: editForm.name, color: editForm.color }
        : opt
    )

    await onSave(updatedOptions)
    setEditingId(null)
  }, [editingId, editForm, options, onSave])

  const handleEditCancel = useCallback(() => {
    setEditingId(null)
    setEditForm({ name: '', color: '', showColorPicker: false })
  }, [])

  const handleDelete = useCallback(
    async (statusId: string) => {
      if (options.length <= 1) {
        alert('Cannot delete the last status. At least one status is required.')
        return
      }

      if (window.confirm('Are you sure you want to delete this status?')) {
        const updatedOptions = options.filter((opt) => opt.id !== statusId)
        // Reorder the remaining options
        const reorderedOptions = updatedOptions.map((opt, index) => ({
          ...opt,
          order: index,
        }))
        await onSave(reorderedOptions)
      }
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
    setNewStatusForm({ name: '', color: '#2196f3', showColorPicker: false })
    setIsAdding(false)
  }, [newStatusForm, options, onSave])

  const handleDragEnd = useCallback(
    (result: import('@hello-pangea/dnd').DropResult) => {
      if (!result.destination) return

      const { source, destination } = result
      if (source.index === destination.index) return

      onReorder(source.index, destination.index)
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
            {(provided, snapshot) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  pb: 2,
                  backgroundColor: snapshot.isDraggingOver
                    ? 'action.hover'
                    : 'transparent',
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                }}
              >
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
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 2,
                              backgroundColor:
                                editingId === status.id
                                  ? editForm.color
                                  : status.color,
                              color: 'white',
                              minWidth: 140,
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: snapshot.isDragging
                                ? 'rotate(5deg)'
                                : 'none',
                              boxShadow: snapshot.isDragging ? 4 : 1,
                              '&:hover': {
                                transform: snapshot.isDragging
                                  ? 'rotate(5deg)'
                                  : 'translateY(-2px)',
                                boxShadow: snapshot.isDragging ? 4 : 3,
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!snapshot.isDragging) {
                                handleEditStart(status)
                              }
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault()
                              handleDelete(status.id)
                            }}
                          >
                            {/* Drag Handle */}
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                width: 24,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'grab',
                                borderRadius: 1,
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                opacity: 0.7,
                                fontSize: '10px',
                                lineHeight: 1,
                                '&:hover': {
                                  opacity: 1,
                                  backgroundColor: 'rgba(0,0,0,0.4)',
                                },
                                '&:active': {
                                  cursor: 'grabbing',
                                },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⋮⋮
                            </Box>

                            {editingId === status.id ? (
                              <Box sx={{ width: '100%' }}>
                                <TextField
                                  value={editForm.name}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  size='small'
                                  fullWidth
                                  sx={{
                                    mb: 1,
                                    '& .MuiInputBase-root': {
                                      backgroundColor: 'white',
                                    },
                                  }}
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditSave()
                                    if (e.key === 'Escape') handleEditCancel()
                                  }}
                                />

                                {/* Color Selection */}
                                <Box sx={{ mb: 1 }}>
                                  <Box
                                    display='flex'
                                    flexWrap='wrap'
                                    gap={0.5}
                                    mb={1}
                                  >
                                    {colorOptions.map((color) => (
                                      <Box
                                        key={color}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setEditForm((prev) => ({
                                            ...prev,
                                            color,
                                            showColorPicker: false,
                                          }))
                                        }}
                                        sx={{
                                          width: 16,
                                          height: 16,
                                          backgroundColor: color,
                                          borderRadius: '50%',
                                          cursor: 'pointer',
                                          border:
                                            editForm.color === color
                                              ? '2px solid white'
                                              : '1px solid rgba(255,255,255,0.3)',
                                        }}
                                      />
                                    ))}
                                  </Box>

                                  {/* White background only for custom color section and below */}
                                  <Box
                                    sx={{
                                      backgroundColor: 'white',
                                      borderRadius: 1,
                                      p: 1,
                                      color: 'black',
                                    }}
                                  >
                                    <Button
                                      size='small'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setEditForm((prev) => ({
                                          ...prev,
                                          showColorPicker:
                                            !prev.showColorPicker,
                                        }))
                                      }}
                                      sx={{
                                        color: 'black',
                                        fontSize: '0.7rem',
                                        p: 0.5,
                                        mb: 1,
                                      }}
                                    >
                                      ⚙️ Custom Color
                                    </Button>
                                    {editForm.showColorPicker && (
                                      <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{ mb: 1 }}
                                      >
                                        <ChromePicker
                                          color={editForm.color}
                                          onChange={(color) =>
                                            setEditForm((prev) => ({
                                              ...prev,
                                              color: color.hex,
                                            }))
                                          }
                                        />
                                      </Box>
                                    )}

                                    <Box display='flex' gap={0.5}>
                                      <Button
                                        size='small'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditSave()
                                        }}
                                        sx={{
                                          color: 'green',
                                          minWidth: 'auto',
                                          p: 0.5,
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        ✓
                                      </Button>
                                      <Button
                                        size='small'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditCancel()
                                        }}
                                        sx={{
                                          color: 'red',
                                          minWidth: 'auto',
                                          p: 0.5,
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        ✕
                                      </Button>
                                      <Button
                                        size='small'
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDelete(status.id)
                                        }}
                                        sx={{
                                          color: 'red',
                                          minWidth: 'auto',
                                          p: 0.5,
                                        }}
                                      >
                                        🗑
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
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
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.2,
                                    color: 'white',
                                  }}
                                >
                                  {status.name}
                                </Typography>
                                {/* Delete button on hover */}
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(status.id)
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    fontSize: '0.8rem',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255,0,0,0.7)',
                                    },
                                    '.MuiBox-root:hover &': {
                                      opacity: 1,
                                    },
                                  }}
                                >
                                  🗑
                                </Box>
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

                  {/* Add New Status Inline */}
                  {isAdding && (
                    <>
                      {sortedOptions.length > 0 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 3,
                            borderRadius: 1,
                            backgroundColor: 'grey.300',
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: newStatusForm.color,
                          color: 'white',
                          minWidth: 140,
                          position: 'relative',
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
                          sx={{
                            mb: 1,
                            '& .MuiInputBase-root': {
                              backgroundColor: 'white',
                            },
                          }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddStatus()
                            if (e.key === 'Escape') setIsAdding(false)
                          }}
                        />

                        {/* Color Selection for New Status */}
                        <Box sx={{ mb: 1 }}>
                          <Box display='flex' flexWrap='wrap' gap={0.5} mb={1}>
                            {colorOptions.map((color) => (
                              <Box
                                key={color}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNewStatusForm((prev) => ({
                                    ...prev,
                                    color,
                                    showColorPicker: false,
                                  }))
                                }}
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: color,
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border:
                                    newStatusForm.color === color
                                      ? '2px solid white'
                                      : '1px solid rgba(255,255,255,0.3)',
                                }}
                              />
                            ))}
                          </Box>
                          <Button
                            size='small'
                            onClick={(e) => {
                              e.stopPropagation()
                              setNewStatusForm((prev) => ({
                                ...prev,
                                showColorPicker: !prev.showColorPicker,
                              }))
                            }}
                            sx={{ color: 'white', fontSize: '0.7rem', p: 0.5 }}
                          >
                            🎨 Custom Color
                          </Button>
                          {newStatusForm.showColorPicker && (
                            <Box
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                mt: 1,
                                position: 'absolute',
                                zIndex: 1000,
                                top: '100%',
                                left: 0,
                              }}
                            >
                              <ChromePicker
                                color={newStatusForm.color}
                                onChange={(color) =>
                                  setNewStatusForm((prev) => ({
                                    ...prev,
                                    color: color.hex,
                                  }))
                                }
                              />
                            </Box>
                          )}
                        </Box>

                        <Box display='flex' gap={0.5}>
                          <Button
                            size='small'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddStatus()
                            }}
                            sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                          >
                            ✓
                          </Button>
                          <Button
                            size='small'
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsAdding(false)
                            }}
                            sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                          >
                            ✕
                          </Button>
                        </Box>
                      </Box>
                    </>
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatuses(updatedStatuses)
  }, [])

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const reorderedStatuses = Array.from(statuses)
      const [removed] = reorderedStatuses.splice(startIndex, 1)
      reorderedStatuses.splice(endIndex, 0, removed)

      // Update order values
      const updatedStatuses = reorderedStatuses.map((status, index) => ({
        ...status,
        order: index,
      }))

      setStatuses(updatedStatuses)
    },
    [statuses]
  )

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          component={Link}
          href='/'
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          Status Manager
        </Typography>
        <Typography variant='body1' color='textSecondary' paragraph>
          Drag status cards to reorder • Click status to edit • Right-click to
          delete • Click + to add new status
        </Typography>
      </Box>
      <StatusFlowManager
        options={statuses}
        onSave={handleSave}
        onReorder={handleReorder}
      />
    </Container>
  )
}
