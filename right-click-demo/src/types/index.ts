import React from 'react'

export type Task = {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'To Do' | 'In Progress' | 'Done'
  assignee: string | null
  dueDate: string | null
  completed: boolean
}

// Define the shape for workspace-related data
type WorkspaceData = {
  type: 'workspace'
}

// Create a union type for all possible item data shapes
export type ContextMenuItemData = Task | WorkspaceData

export type TaskCardProps = {
  task: Task
  onContextMenu: (e: React.MouseEvent, itemType: string, itemData: Task) => void
  onToggleComplete: (taskId: number) => void
}

export type ContextMenuProps = {
  anchorPosition: { x: number; y: number }
  onClose: () => void
  itemType: string
  itemData: ContextMenuItemData // Use the specific union type
  onAction: (action: string, itemData: ContextMenuItemData) => void // Use the specific union type
}

export type MenuItemType = {
  icon: React.ReactNode
  text: string
  action: string
  destructive?: boolean
}

export type ContextMenuState = {
  anchorPosition: { x: number; y: number }
  itemType: string
  itemData: ContextMenuItemData // Use the specific union type
} | null

export type EditTaskFormProps = {
  task: Task
  onSave: (updatedTask: Task) => void
  onCancel: () => void
}
