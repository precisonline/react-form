import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

const mockTask: Task = {
  id: 1,
  title: 'Test Task Title',
  description: 'This is a test description.',
  priority: 'high',
  status: 'In Progress',
  assignee: 'Test User',
  dueDate: '2025-01-01',
  completed: false,
}

const mockOnContextMenu = jest.fn()
const mockOnToggleComplete = jest.fn()

describe('TaskCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the task title and description correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={mockOnContextMenu}
        onToggleComplete={mockOnToggleComplete}
      />
    )
    expect(screen.getByText('Test Task Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test description.')).toBeInTheDocument()
  })

  it('should call onToggleComplete with the correct task ID when the checkmark is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={mockOnContextMenu}
        onToggleComplete={mockOnToggleComplete}
      />
    )
    const checkbox = screen.getByRole('button', {
      name: /toggle completion for test task title/i,
    })
    await user.click(checkbox)
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1)
    expect(mockOnToggleComplete).toHaveBeenCalledWith(mockTask.id)
  })

  it('should show a line-through decoration when the task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    render(
      <TaskCard
        task={completedTask}
        onContextMenu={mockOnContextMenu}
        onToggleComplete={mockOnToggleComplete}
      />
    )
    const title = screen.getByText('Test Task Title')
    expect(title).toHaveStyle('text-decoration: line-through')
  })

  it('should call onContextMenu when the card is right-clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={mockOnContextMenu}
        onToggleComplete={mockOnToggleComplete}
      />
    )

    const card = screen
      .getByText('Test Task Title')
      .closest('div[data-id="task-card"]')
    await user.pointer({ keys: '[MouseRight>]', target: card! })

    expect(mockOnContextMenu).toHaveBeenCalledTimes(1)
  })

  it('should not render avatar or due date when they are not provided', () => {
    const taskWithoutExtras = { ...mockTask, assignee: null, dueDate: null }
    render(
      <TaskCard
        task={taskWithoutExtras}
        onContextMenu={mockOnContextMenu}
        onToggleComplete={mockOnToggleComplete}
      />
    )

    const avatar = screen.queryByText('T')
    const dueDateChip = screen.queryByText(/due/i)

    expect(avatar).not.toBeInTheDocument()
    expect(dueDateChip).not.toBeInTheDocument()
  })
})
