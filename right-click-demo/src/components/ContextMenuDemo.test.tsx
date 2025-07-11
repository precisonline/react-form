import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContextMenuDemo from './ContextMenuDemo'

describe('ContextMenuDemo Integration', () => {
  it('should open the task-specific context menu on right-clicking a task', async () => {
    const user = userEvent.setup()
    render(<ContextMenuDemo />)

    const firstTaskCard = screen.getByText(/Design homepage mockup/i)
    await user.pointer({ keys: '[MouseRight>]', target: firstTaskCard })

    const menu = screen.getByRole('menu')
    expect(within(menu).getByText('Delete')).toBeInTheDocument()
    expect(within(menu).queryByText('Create Task')).not.toBeInTheDocument()
  })

  it('should open the container-specific context menu on right-clicking the workspace', async () => {
    const user = userEvent.setup()
    render(<ContextMenuDemo />)

    const workspace = screen.getByTestId('workspace-container')
    await user.pointer({ keys: '[MouseRight>]', target: workspace })

    const menu = screen.getByRole('menu')
    expect(within(menu).getByText('Create Task')).toBeInTheDocument()
    expect(within(menu).queryByText('Delete')).not.toBeInTheDocument()
  })

  it('should mark a task as complete and update the UI when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(<ContextMenuDemo />)

    const taskTitle = 'Implement user authentication'
    const taskCard = screen
      .getByText(taskTitle)
      .closest('div[data-id="task-card"]')

    // Check for the initial "un-checked" icon
    expect(
      within(taskCard as HTMLElement).getByTestId('CircleIcon')
    ).toBeInTheDocument()

    const toggleButton = screen.getByRole('button', {
      name: `Toggle completion for ${taskTitle}`,
    })
    await user.click(toggleButton)

    // Assert that the UI has updated
    expect(
      within(taskCard as HTMLElement).queryByText('CircleIcon')
    ).not.toBeInTheDocument()
    expect(
      within(taskCard as HTMLElement).getByTestId('CheckCircleIcon')
    ).toBeInTheDocument()

    const titleElement = screen.getByText(taskTitle)
    expect(titleElement).toHaveStyle('text-decoration: line-through')
  })

  it('should show the edit form when "Edit" is clicked in the context menu', async () => {
    const user = userEvent.setup()
    render(<ContextMenuDemo />)

    const taskTitle = 'Implement user authentication'
    const taskCard = screen.getByText(taskTitle)

    // Right-click the task to open the menu
    await user.pointer({ keys: '[MouseRight>]', target: taskCard })

    // Click the "Edit" option in the menu
    const menu = screen.getByRole('menu')
    await user.click(within(menu).getByText('Edit'))

    // Assert that the input field for editing is now visible
    expect(screen.getByLabelText(/edit task title/i)).toBeInTheDocument()

    // Assert that the original task card text is no longer visible
    expect(screen.queryByText(taskTitle)).not.toBeInTheDocument()
  })
})
