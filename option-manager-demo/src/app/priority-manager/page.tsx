'use client'

import React, { useState, useCallback } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from '@hello-pangea/dnd'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
} from '@mui/material'
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { ChromePicker } from 'react-color'
import { PriorityItem } from './types'
import Link from 'next/link'

// --- INITIAL DATA & CONFIGURATION ---

const initialItems: PriorityItem[] = [
  {
    id: 'item-1',
    title: 'Highest Priority',
    color: '#f44336',
    active: true,
    order: 0,
  },
  {
    id: 'item-2',
    title: 'Important Task',
    color: '#ff9800',
    active: true,
    order: 1,
  },
  {
    id: 'item-3',
    title: 'Standard Task',
    color: '#3f51b5',
    active: true,
    order: 2,
  },
  {
    id: 'item-4',
    title: 'Low Priority',
    color: '#4caf50',
    active: false,
    order: 3,
  },
]

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
]

export default function PriorityManagerPage() {
  const [items, setItems] = useState<PriorityItem[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    color: '',
    showColorPicker: false,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [newPriorityForm, setNewPriorityForm] = useState({
    title: '',
    color: '#2196f3',
    showColorPicker: false,
  })

  // --- Handlers ---

  const handleEditStart = useCallback((item: PriorityItem) => {
    setEditingId(item.id)
    setEditForm({
      title: item.title,
      color: item.color,
      showColorPicker: false,
    })
    setIsAdding(false)
  }, [])

  const handleEditSave = useCallback(() => {
    if (!editingId || !editForm.title.trim()) return
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editingId
          ? { ...item, title: editForm.title, color: editForm.color }
          : item
      )
    )
    setEditingId(null)
  }, [editingId, editForm])

  const handleEditCancel = useCallback(() => {
    setEditingId(null)
  }, [])

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (editingId && e.target === e.currentTarget) {
        handleEditCancel()
      }
    },
    [editingId, handleEditCancel]
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (items.length <= 1) {
        alert('Cannot delete the last priority. At least one is required.')
        return
      }
      if (window.confirm('Are you sure you want to delete this priority?')) {
        setItems((prevItems) => {
          const updated = prevItems.filter((item) => item.id !== id)
          return updated.map((item, index) => ({ ...item, order: index }))
        })
        setEditingId(null)
      }
    },
    [items.length]
  )

  const handleAddStart = () => {
    setEditingId(null)
    setIsAdding(true)
    setNewPriorityForm({ title: '', color: '#2196f3', showColorPicker: false })
  }

  const handleAddPriority = useCallback(() => {
    if (!newPriorityForm.title.trim()) return
    const newItem: PriorityItem = {
      id: `item_${Date.now()}`,
      title: newPriorityForm.title,
      color: newPriorityForm.color,
      order: items.length,
      active: true,
    }
    setItems((prevItems) => [...prevItems, newItem])
    setIsAdding(false)
  }, [newPriorityForm, items.length])

  const onDragEnd: OnDragEndResponder = useCallback((result) => {
    const { source, destination } = result
    if (!destination || source.index === destination.index) return
    setItems((prevItems) => {
      const reordered = Array.from(prevItems)
      const [removed] = reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, removed)
      return reordered.map((item, index) => ({ ...item, order: index }))
    })
  }, [])

  // --- MAIN RENDER ---

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button
          component={Link}
          href='/'
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant='h4' component='h1'>
            Priority Manager
          </Typography>
          <Button
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            onClick={handleAddStart}
            disabled={isAdding}
          >
            Add Priority
          </Button>
        </Box>

        <Typography color='text.secondary'>
          Drag to reorder • Click a card to edit
        </Typography>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='pyramid-droppable-area'>
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              onClick={handleContainerClick}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

                p: 2,
                minHeight: '200px',
              }}
            >
              {items
                .sort((a, b) => a.order - b.order)
                .map((item, index) => {
                  const isEditingThis = editingId === item.id
                  const pyramidWidth = 300 + index * 50

                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!!editingId || isAdding}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          <Box
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!snapshot.isDragging) handleEditStart(item)
                            }}
                            sx={{
                              width: `${pyramidWidth}px`,
                              p: 1.5,
                              mb: 1.5,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              borderRadius: 2,
                              backgroundColor: isEditingThis
                                ? editForm.color
                                : item.color,
                              color: 'white',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              transition: 'all 0.2s ease',
                              opacity: snapshot.isDragging
                                ? 0.9
                                : item.active || isEditingThis
                                ? 1
                                : 0.6,
                              transform: snapshot.isDragging
                                ? 'rotate(3deg)'
                                : 'none',
                              boxShadow: snapshot.isDragging ? 8 : 2,
                              '&:hover': {
                                transform: snapshot.isDragging
                                  ? 'rotate(3deg)'
                                  : 'translateY(-2px)',
                                boxShadow: snapshot.isDragging ? 8 : 4,
                              },
                            }}
                          >
                            {isEditingThis ? (
                              <Stack sx={{ width: '100%' }} spacing={1}>
                                <TextField
                                  value={editForm.title}
                                  onChange={(e) =>
                                    setEditForm((p) => ({
                                      ...p,
                                      title: e.target.value,
                                    }))
                                  }
                                  size='small'
                                  fullWidth
                                  autoFocus
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      backgroundColor: 'white',
                                    },
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditSave()
                                    if (e.key === 'Escape') handleEditCancel()
                                  }}
                                />
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
                                        setEditForm((p) => ({
                                          ...p,
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
                                <Box
                                  bgcolor='white'
                                  borderRadius={1}
                                  p={1}
                                  color='black'
                                >
                                  <Button
                                    size='small'
                                    fullWidth
                                    sx={{ fontSize: '0.7rem', color: 'black' }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditForm((p) => ({
                                        ...p,
                                        showColorPicker: !p.showColorPicker,
                                      }))
                                    }}
                                  >
                                    ⚙️ Custom Color
                                  </Button>
                                  {editForm.showColorPicker && (
                                    <Box
                                      onClick={(e) => e.stopPropagation()}
                                      pt={1}
                                    >
                                      <ChromePicker
                                        color={editForm.color}
                                        onChange={(c) =>
                                          setEditForm((p) => ({
                                            ...p,
                                            color: c.hex,
                                          }))
                                        }
                                      />
                                    </Box>
                                  )}
                                  <Box
                                    display='flex'
                                    gap={0.5}
                                    mt={1}
                                    justifyContent='center'
                                  >
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
                                      ✓ Save
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
                                      ✕ Cancel
                                    </Button>
                                    <Button
                                      size='small'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(item.id)
                                      }}
                                      sx={{
                                        color: 'red',
                                        minWidth: 'auto',
                                        p: 0.5,
                                      }}
                                    >
                                      🗑️ Delete
                                    </Button>
                                  </Box>
                                </Box>
                              </Stack>
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
                                  {item.id.slice(-1)}
                                </Box>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.2,
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  )
                })}
              {provided.placeholder}
              {isAdding && (
                <Box sx={{ width: `${300 + items.length * 50}px`, mt: 1 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: newPriorityForm.color,
                    }}
                  >
                    <Stack spacing={1}>
                      <TextField
                        placeholder='New priority title...'
                        value={newPriorityForm.title}
                        onChange={(e) =>
                          setNewPriorityForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        size='small'
                        fullWidth
                        autoFocus
                        sx={{
                          '& .MuiInputBase-root': { backgroundColor: 'white' },
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddPriority()
                          if (e.key === 'Escape') setIsAdding(false)
                        }}
                      />
                      <Box display='flex' flexWrap='wrap' gap={0.5}>
                        {colorOptions.map((color) => (
                          <Box
                            key={color}
                            onClick={() =>
                              setNewPriorityForm((p) => ({ ...p, color }))
                            }
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: color,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border:
                                newPriorityForm.color === color
                                  ? '2px solid white'
                                  : '1px solid rgba(255,255,255,0.3)',
                            }}
                          />
                        ))}
                      </Box>
                      <Box
                        display='flex'
                        justifyContent='flex-end'
                        gap={0.5}
                        mt={1}
                      >
                        <Button
                          size='small'
                          onClick={() => setIsAdding(false)}
                          sx={{ color: 'white' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size='small'
                          onClick={handleAddPriority}
                          sx={{
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.2)',
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  )
}
