import React from 'react'
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
} from '@hello-pangea/dnd'

// This is the entire content of the new file
export const DragDropContext = ({
  children,
}: {
  children: React.ReactNode
}) => <>{children}</>

export const Droppable = ({
  children,
}: {
  children: (provided: DroppableProvided) => React.ReactNode
}) =>
  children({
    droppableProps: {
      'data-rfd-droppable-context-id': '1',
      'data-rfd-droppable-id': '1',
    },
    innerRef: jest.fn(),
    placeholder: null,
  })

export const Draggable = ({
  children,
}: {
  children: (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => React.ReactNode
}) =>
  children(
    {
      draggableProps: {
        'data-rfd-draggable-context-id': '1',
        'data-rfd-draggable-id': '1',
        style: {},
      },
      dragHandleProps: {
        'data-rfd-drag-handle-draggable-id': '1',
        'data-rfd-drag-handle-context-id': '1',
        'aria-describedby': 'id',
        role: 'button',
        tabIndex: 0,
        draggable: true,
        onDragStart: jest.fn(),
      },
      innerRef: jest.fn(),
    },
    {
      isDragging: false,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: null,
      draggingOver: null,
      combineWith: null,
      combineTargetFor: null,
      mode: null,
    }
  )
