import React from 'react'

// This mock provides the necessary props that your components expect
export const DragDropContext = ({ children }) => <>{children}</>
export const Droppable = ({ children }) => <>{children({})}</>
export const Draggable = ({ children }) => (
  <>
    {children(
      {
        draggableProps: {
          style: {},
        },
        dragHandleProps: {},
      },
      {}
    )}
  </>
)
