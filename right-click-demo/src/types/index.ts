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

export type TaskCardProps = {
  task: Task
  onContextMenu: (e: React.MouseEvent, itemType: string, itemData: Task) => void
  onToggleComplete: (taskId: number) => void
}

export type ContextMenuProps = {
  anchorPosition: { x: number; y: number }
  onClose: () => void
  itemType: string
  itemData: any
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
  itemData: any
} | null
