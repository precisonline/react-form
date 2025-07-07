import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PriorityManagerPage from '../page'
import {
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'

// Mock the dnd library
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode
    onDragEnd: (result: DropResult) => void
  }) => (
    <div
      onMouseUp={() =>
        onDragEnd({
          source: { index: 0 },
          destination: { index: 1 },
        } as DropResult)
      }
    >
      {children}
    </div>
  ),
  Droppable: ({
    children,
  }: {
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactNode
  }) => (
    <div>
      {children(
        {
          innerRef: jest.fn(),
          droppableProps: { style: {} },
          placeholder: null,
        } as unknown as DroppableProvided,
        { isDraggingOver: false } as DroppableStateSnapshot
      )}
    </div>
  ),
  Draggable: ({
    children,
  }: {
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => React.ReactNode
  }) => (
    <div>
      {children(
        {
          innerRef: jest.fn(),
          draggableProps: { style: {} },
          dragHandleProps: {},
        } as unknown as DraggableProvided,
        { isDragging: false } as DraggableStateSnapshot
      )}
    </div>
  ),
}))

describe('PriorityManagerPage', () => {
  beforeEach(() => {
    // Mock window.confirm to always return true
    window.confirm = jest.fn(() => true)
  })

  it('renders the page with the correct title', () => {
    render(<PriorityManagerPage />)
    expect(screen.getByText('Priority Manager')).toBeInTheDocument()
  })

  it('renders the initial list of priorities', () => {
    render(<PriorityManagerPage />)
    expect(screen.getByText('Highest Priority')).toBeInTheDocument()
    expect(screen.getByText('Important Task')).toBeInTheDocument()
  })

  it('allows adding a new priority', async () => {
    render(<PriorityManagerPage />)
    fireEvent.click(screen.getByRole('button', { name: /add priority/i }))
    fireEvent.change(screen.getByPlaceholderText('New priority title...'), {
      target: { value: 'New Priority' },
    })
    fireEvent.keyDown(screen.getByPlaceholderText('New priority title...'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(screen.getByText('New Priority')).toBeInTheDocument()
    })
  })

  it('allows editing a priority', async () => {
    render(<PriorityManagerPage />)
    fireEvent.click(screen.getByText('Highest Priority'))
    fireEvent.change(screen.getByDisplayValue('Highest Priority'), {
      target: { value: 'Updated Priority' },
    })
    fireEvent.keyDown(screen.getByDisplayValue('Updated Priority'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(screen.getByText('Updated Priority')).toBeInTheDocument()
    })
  })

  it('allows deleting a priority', async () => {
    render(<PriorityManagerPage />)
    fireEvent.click(screen.getByText('Highest Priority'))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.queryByText('Highest Priority')).not.toBeInTheDocument()
    })
  })
})
