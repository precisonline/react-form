import React from 'react'
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Avatar,
} from '@mui/material'
import { CheckCircle, Circle, MoreVert, Schedule } from '@mui/icons-material'
import type { Task, TaskCardProps } from '@/types'

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'default'
  }
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'Done':
      return 'success'
    case 'In Progress':
      return 'info'
    case 'To Do':
      return 'default'
    default:
      return 'default'
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onContextMenu,
  onToggleComplete,
}) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(e, 'task', task)
  }

  return (
    <Paper
      data-id='task-card'
      elevation={1}
      onContextMenu={handleRightClick}
      sx={{
        p: 3,
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <IconButton
          size='small'
          onClick={() => onToggleComplete(task.id)}
          aria-label={`Toggle completion for ${task.title}`}
          sx={{ mt: -0.5, '&:hover': { bgcolor: 'action.hover' } }}
        >
          {task.completed ? (
            <CheckCircle color='success' />
          ) : (
            <Circle sx={{ color: 'grey.300' }} />
          )}
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 1,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              fontSize: '1.1rem',
              lineHeight: 1.4,
            }}
          >
            {task.title}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 2, lineHeight: 1.5, opacity: task.completed ? 0.7 : 1 }}
          >
            {task.description}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              size='small'
              label={task.priority.toUpperCase()}
              color={getPriorityColor(task.priority)}
              variant='outlined'
              sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24 }}
            />
            <Chip
              size='small'
              label={task.status}
              color={getStatusColor(task.status)}
              variant='filled'
              sx={{ fontWeight: 500, fontSize: '0.7rem', height: 24 }}
            />

            {task.assignee && (
              <Tooltip title={`Assigned to ${task.assignee}`} arrow>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    bgcolor: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  {task.assignee.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            )}

            {task.dueDate && (
              <Tooltip title={`Due on ${task.dueDate}`} arrow>
                <Chip
                  size='small'
                  icon={
                    <Schedule
                      sx={{ fontSize: 14, ml: 1, color: 'text.secondary' }}
                    />
                  }
                  label={task.dueDate}
                  variant='outlined'
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    color: 'text.secondary',
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        <IconButton
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            onContextMenu(e, 'task', task)
          }}
          sx={{
            opacity: 0.6,
            transition: 'all 0.2s',
            '&:hover': { opacity: 1, bgcolor: 'action.hover' },
          }}
        >
          <MoreVert fontSize='small' />
        </IconButton>
      </Box>
    </Paper>
  )
}
