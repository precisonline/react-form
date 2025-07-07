import React from 'react'

export const DragDropContext = ({ children }) => <div>{children}</div>
export const Droppable = ({ children }) => children({}, {})
export const Draggable = ({ children }) => children({}, {})
