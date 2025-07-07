import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusManagerPage from '../page'
import {
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'

// Mock the dnd library
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dnd-context'>{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactNode
  }) => {
    const mockProvided: DroppableProvided = {
      innerRef: jest.fn(),
      droppableProps: { 'data-testid': 'dnd-droppable' },
      placeholder: null,
    } as unknown as DroppableProvided

    const mockSnapshot: DroppableStateSnapshot = {
      isDraggingOver: false,
    } as DroppableStateSnapshot

    return <div>{children(mockProvided, mockSnapshot)}</div>
  },
  Draggable: ({
    children,
    draggableId,
  }: {
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => React.ReactNode
    draggableId: string
  }) => {
    const mockProvided: DraggableProvided = {
      innerRef: jest.fn(),
      draggableProps: {},
      dragHandleProps: {},
    } as unknown as DraggableProvided

    const mockSnapshot: DraggableStateSnapshot = {
      isDragging: false,
    } as DraggableStateSnapshot

    return (
      <div data-testid={`draggable-${draggableId}`}>
        {children(mockProvided, mockSnapshot)}
      </div>
    )
  },
}))

beforeEach(() => {
  window.confirm = jest.fn(() => true)
  window.alert = jest.fn()
})

describe('StatusManagerPage', () => {
  it('renders the page with the correct title', () => {
    render(<StatusManagerPage />)
    expect(
      screen.getByRole('heading', { name: /status manager/i })
    ).toBeInTheDocument()
  })

  it('renders the initial list of statuses', () => {
    render(<StatusManagerPage />)
    expect(screen.getByText(/open/i)).toBeInTheDocument()
    expect(screen.getByText(/in progress/i)).toBeInTheDocument()
  })

  it('allows adding a new status and saves on Enter', async () => {
    render(<StatusManagerPage />)
    fireEvent.click(screen.getByRole('button', { name: /add status/i }))
    const input = await screen.findByPlaceholderText(/status name/i)
    fireEvent.change(input, { target: { value: 'QA Testing' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(await screen.findByText(/qa testing/i)).toBeInTheDocument()
  })

  it('allows editing a status', async () => {
    render(<StatusManagerPage />)
    fireEvent.click(screen.getByText(/open/i))
    const input = await screen.findByDisplayValue(/open/i)
    fireEvent.change(input, { target: { value: 'Updated Status' } })
    const statusCard = screen.getByTestId('draggable-1')
    const saveButton = within(statusCard).getByRole('button', { name: '✓' })
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(screen.getByText(/updated status/i)).toBeInTheDocument()
    })
    expect(screen.queryByText(/open/i)).not.toBeInTheDocument()
  })

  it('allows deleting a status', async () => {
    render(<StatusManagerPage />)
    fireEvent.click(screen.getByText(/open/i))
    const statusCard = screen.getByTestId('draggable-1')
    const deleteButton = await within(statusCard).findByRole('button', {
      name: '🗑',
    })
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(screen.queryByText(/open/i)).not.toBeInTheDocument()
    })
  })

  it('prevents deleting the last remaining status', async () => {
    render(<StatusManagerPage />)

    fireEvent.click(screen.getByText(/^OPEN$/i))
    const deleteBtn1 = await screen.findByRole('button', { name: '🗑' })
    fireEvent.click(deleteBtn1)
    await waitFor(() =>
      expect(screen.queryByText(/^OPEN$/i)).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(/^IN PROGRESS$/i))
    const deleteBtn2 = await screen.findByRole('button', { name: '🗑' })
    fireEvent.click(deleteBtn2)
    await waitFor(() =>
      expect(screen.queryByText(/^IN PROGRESS$/i)).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(/^REVIEW$/i))
    const deleteBtn3 = await screen.findByRole('button', { name: '🗑' })
    fireEvent.click(deleteBtn3)
    await waitFor(() =>
      expect(screen.queryByText(/^REVIEW$/i)).not.toBeInTheDocument()
    )

    expect(screen.getByText(/DONE/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/DONE/i))
    const finalDeleteBtn = await screen.findByRole('button', { name: '🗑' })
    fireEvent.click(finalDeleteBtn)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Cannot delete the last status. At least one status is required.'
      )
    })
    expect(screen.getByText(/DONE/i)).toBeInTheDocument()
  })
})
