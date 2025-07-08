'use client'

import React, { useState, useRef } from 'react'
import { Box, Typography, ThemeProvider, CssBaseline } from '@mui/material'
import { TaskCard } from './TaskCard'
import { ContextMenu } from './ContextMenu'
import { theme } from '@/theme/theme'
import type { Task, ContextMenuState } from '@/types'

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Design homepage mockup',
    description:
      'Create wireframes and high-fidelity mockups for the new homepage design.',
    priority: 'high',
    status: 'In Progress',
    assignee: 'John Doe',
    dueDate: '2025-07-15',
    completed: false,
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description:
      'Set up login/signup functionality with JWT tokens and password reset flow.',
    priority: 'medium',
    status: 'To Do',
    assignee: 'Jane Smith',
    dueDate: '2025-07-20',
    completed: false,
  },
  {
    id: 3,
    title: 'Write comprehensive unit tests',
    description:
      'Add test coverage for all API endpoints and critical user flows.',
    priority: 'low',
    status: 'Done',
    assignee: 'Mike Johnson',
    dueDate: '2025-07-10',
    completed: true,
  },
]

export default function ContextMenuDemo() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleToggleComplete = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleContextMenu = (
    e: React.MouseEvent,
    itemType: string,
    itemData: unknown
  ) => {
    e.preventDefault()
    setContextMenu({
      anchorPosition: { x: e.clientX, y: e.clientY },
      itemType,
      itemData,
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleContainerRightClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-id="task-card"]')) {
      handleContextMenu(e, 'container', { type: 'workspace' })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Typography
          variant='h4'
          gutterBottom
          sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
        >
          ClickUp-style Context Menu Demo
        </Typography>

        <Typography
          variant='body1'
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          Right-click on any task card to see task-specific actions, or
          right-click on the workspace for container actions.
        </Typography>

        <Box
          ref={containerRef}
          onContextMenu={handleContainerRightClick}
          sx={{
            width: '100%',
            maxWidth: 900,
            minHeight: 500,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onContextMenu={handleContextMenu}
              onToggleComplete={handleToggleComplete}
            />
          ))}
          <Box sx={{ height: 100, width: '100%' }} />
        </Box>

        {contextMenu && (
          <ContextMenu
            anchorPosition={contextMenu.anchorPosition}
            onClose={handleCloseContextMenu}
            itemType={contextMenu.itemType}
            itemData={contextMenu.itemData}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
