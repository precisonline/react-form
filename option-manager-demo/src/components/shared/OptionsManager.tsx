'use client'

import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { ChromePicker } from 'react-color'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

// Import shared types
import {
  Option,
  OptionFormData,
  OptionFormSchema,
  OptionsManagerProps,
} from '../../app/types/options'

export const OptionsManager: React.FC<OptionsManagerProps> = ({
  title,
  options,
  type,
  onSave,
  onReorder,
  maxOptions = 20,
  allowReorder = true,
  allowDelete = true,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<Option | null>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<OptionFormData>({
    resolver: zodResolver(OptionFormSchema),
    defaultValues: {
      name: '',
      color: '#1976d2',
      active: true,
      type,
    },
  })

  const watchedColor = watch('color')

  const handleOpenDialog = useCallback(
    (option?: Option) => {
      if (option) {
        setEditingOption(option)
        reset({
          name: option.name,
          color: option.color,
          active: option.active,
          type: option.type,
          icon: option.icon,
        })
      } else {
        setEditingOption(null)
        reset({
          name: '',
          color: '#1976d2',
          active: true,
          type,
        })
      }
      setDialogOpen(true)
    },
    [reset, type]
  )

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false)
    setEditingOption(null)
    setColorPickerOpen(false)
    reset()
  }, [reset])

  const handleSubmitForm = useCallback(
    async (data: OptionFormData) => {
      setIsLoading(true)
      try {
        const newOption: Option = {
          ...data,
          id: editingOption?.id || `${type}_${Date.now()}`,
          order: editingOption?.order || options.length,
        }

        const updatedOptions = editingOption
          ? options.map((opt) =>
              opt.id === editingOption.id ? newOption : opt
            )
          : [...options, newOption]

        await onSave(updatedOptions)

        setSnackbar({
          open: true,
          message: `${
            editingOption ? 'Updated' : 'Created'
          } ${type} successfully`,
          severity: 'success',
        })
        handleCloseDialog()
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to ${editingOption ? 'update' : 'create'} ${type}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          severity: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingOption, options, onSave, type, handleCloseDialog]
  )

  const handleDelete = useCallback(
    async (optionId: string) => {
      if (!allowDelete) return

      setIsLoading(true)
      try {
        const updatedOptions = options.filter((opt) => opt.id !== optionId)
        await onSave(updatedOptions)

        setSnackbar({
          open: true,
          message: `Deleted ${type} successfully`,
          severity: 'success',
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to delete ${type}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          severity: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [allowDelete, options, onSave, type]
  )

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !allowReorder) return

      const { source, destination } = result
      if (source.index === destination.index) return

      onReorder(source.index, destination.index)
    },
    [allowReorder, onReorder]
  )

  const toggleActive = useCallback(
    async (optionId: string) => {
      setIsLoading(true)
      try {
        const updatedOptions = options.map((opt) =>
          opt.id === optionId ? { ...opt, active: !opt.active } : opt
        )
        await onSave(updatedOptions)
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to update ${type} status: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          severity: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [options, onSave, type]
  )

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>{title}</Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={options.length >= maxOptions || isLoading}
        >
          Add {type}
        </Button>
      </Box>

      <Card>
        <CardContent>
          {options.length === 0 ? (
            <Typography
              color='textSecondary'
              sx={{ textAlign: 'center', py: 4 }}
            >
              No {type}s configured yet. Click &quot;Add {type}&quot; to get
              started.
            </Typography>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`${type}-list`}>
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef}>
                    {options.map((option, index) => (
                      <Draggable
                        key={option.id}
                        draggableId={option.id}
                        index={index}
                        isDragDisabled={!allowReorder}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              mb: 1,
                              backgroundColor: snapshot.isDragging
                                ? 'action.hover'
                                : 'background.paper',
                            }}
                          >
                            {allowReorder && (
                              <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                <DragIcon color='action' />
                              </Box>
                            )}

                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: option.color,
                                borderRadius: '50%',
                                mr: 2,
                                flexShrink: 0,
                              }}
                            />

                            <ListItemText
                              primary={option.name}
                              secondary={`Order: ${option.order + 1}`}
                            />

                            <ListItemSecondaryAction>
                              <Box
                                display='flex'
                                alignItems='center'
                                sx={{ gap: 1 }}
                              >
                                <Tooltip
                                  title={option.active ? 'Active' : 'Inactive'}
                                >
                                  <Switch
                                    checked={option.active}
                                    onChange={() => toggleActive(option.id)}
                                    size='small'
                                    disabled={isLoading}
                                  />
                                </Tooltip>

                                <IconButton
                                  edge='end'
                                  onClick={() => handleOpenDialog(option)}
                                  disabled={isLoading}
                                >
                                  <EditIcon />
                                </IconButton>

                                {allowDelete && (
                                  <IconButton
                                    edge='end'
                                    onClick={() => handleDelete(option.id)}
                                    disabled={isLoading}
                                    color='error'
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog for Priority/Classification */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <DialogTitle>
            {editingOption ? `Edit ${type}` : `Add ${type}`}
          </DialogTitle>

          <DialogContent>
            <Box display='flex' flexDirection='column' sx={{ gap: 3, pt: 1 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Name'
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                  />
                )}
              />

              <Box>
                <Typography variant='subtitle2' gutterBottom>
                  Color
                </Typography>
                <Box display='flex' alignItems='center' sx={{ gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: watchedColor,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                  />
                  <Controller
                    name='color'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Hex Color'
                        size='small'
                        error={!!errors.color}
                        helperText={errors.color?.message}
                      />
                    )}
                  />
                </Box>

                {colorPickerOpen && (
                  <Box sx={{ mt: 2 }}>
                    <ChromePicker
                      color={watchedColor}
                      onChange={(color) =>
                        setValue('color', color.hex, { shouldDirty: true })
                      }
                    />
                  </Box>
                )}
              </Box>

              <Controller
                name='active'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label='Active'
                  />
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={isLoading || !isDirty}
              startIcon={<SaveIcon />}
            >
              {editingOption ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant='filled'
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
