import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { ContextMenu } from './ContextMenu'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/theme/theme'
import type { Task, ContextMenuItemData } from '@/types'

// --- Mocks ---
const mockOnClose = jest.fn()
const mockOnAction = jest.fn()

// Correctly typed mock data for a task
const mockTaskData: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  priority: 'high',
  status: 'To Do',
  assignee: 'John Doe',
  dueDate: '2025-07-09',
  completed: false,
}

// Mock data for a container
const mockContainerData: ContextMenuItemData = {
  type: 'workspace',
}

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('ContextMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render task-specific menu items correctly', () => {
    // This is the part that was missing
    renderWithTheme(
      <ContextMenu
        anchorPosition={{ x: 0, y: 0 }}
        onClose={mockOnClose}
        itemType='task'
        itemData={mockTaskData}
        onAction={mockOnAction}
      />
    )

    // Assert that task-specific items are present
    expect(screen.getByText('Mark Complete')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should render container-specific menu items correctly', () => {
    renderWithTheme(
      <ContextMenu
        anchorPosition={{ x: 0, y: 0 }}
        onClose={mockOnClose}
        itemType='container'
        itemData={mockContainerData}
        onAction={mockOnAction}
      />
    )

    // Assert that container-specific items are present
    expect(screen.getByText('Create Task')).toBeInTheDocument()
    // Assert that task-specific items are NOT present
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should call onAction with correct arguments when an item is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <ContextMenu
        anchorPosition={{ x: 0, y: 0 }}
        onClose={mockOnClose}
        itemType='task'
        itemData={mockTaskData}
        onAction={mockOnAction}
      />
    )

    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    // Check if the callback was triggered correctly
    expect(mockOnAction).toHaveBeenCalledTimes(1)
    expect(mockOnAction).toHaveBeenCalledWith('edit', mockTaskData)
  })
})
