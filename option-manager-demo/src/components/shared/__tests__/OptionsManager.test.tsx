import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { OptionsManager } from '../OptionsManager'
import { Option } from '../../../app/types/options'
import {
  DropResult,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'

// Mock the drag and drop library
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode
    onDragEnd: (result: DropResult) => void
  }) => (
    <div
      data-testid='dnd-context'
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

// Mock data
const mockOptions: Option[] = [
  {
    id: '1',
    name: 'Option 1',
    color: '#ff0000',
    order: 0,
    active: true,
    type: 'classification',
  },
  {
    id: '2',
    name: 'Option 2',
    color: '#00ff00',
    order: 1,
    active: true,
    type: 'classification',
  },
]

const mockOnSave = jest.fn()
const mockOnReorder = jest.fn()

const renderComponent = (props = {}) => {
  const defaultProps = {
    title: 'Test Manager',
    options: mockOptions,
    type: 'classification' as const,
    onSave: mockOnSave,
    onReorder: mockOnReorder,
  }
  return render(<OptionsManager {...defaultProps} {...props} />)
}

describe('OptionsManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with the correct title', () => {
    renderComponent()
    expect(screen.getByText('Test Manager')).toBeInTheDocument()
  })

  it('renders the list of options', () => {
    renderComponent()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('opens the dialog when the "Add" button is clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /add classification/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('Add classification')).toBeInTheDocument()
  })

  it('adds a new option', async () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /add classification/i }))

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Option' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'New Option' }),
        ])
      )
    })
  })

  it('opens the dialog in edit mode when the "Edit" button is clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('edit-option-1'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Edit classification')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
  })

  it('updates an existing option', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('edit-option-1'))

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Updated Option' },
    })
    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Updated Option' }),
        ])
      )
    })
  })

  it('deletes an option', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('delete-option-1'))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.not.arrayContaining([expect.objectContaining({ id: '1' })])
      )
    })
  })

  it('toggles the active state of an option', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('toggle-active-1'))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1', active: false }),
        ])
      )
    })
  })

  it('reorders options on drag and drop', () => {
    renderComponent()
    const dndContext = screen.getByTestId('dnd-context')
    fireEvent.mouseUp(dndContext)
    expect(mockOnReorder).toHaveBeenCalledWith(0, 1)
  })
})
