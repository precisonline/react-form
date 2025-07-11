import React from 'react'
import {
  Box,
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Edit,
  Delete,
  ContentCopy,
  Share,
  Archive,
  Star,
  Schedule,
  Person,
  Flag,
  Assignment,
  CheckCircle,
} from '@mui/icons-material'
import type { ContextMenuProps, MenuItemType } from '@/types'

export const ContextMenu: React.FC<ContextMenuProps> = ({
  anchorPosition,
  onClose,
  itemType,
  itemData,
  onAction,
}) => {
  const getMenuItems = (): (MenuItemType | 'divider')[] => {
    const commonItems: MenuItemType[] = [
      { icon: <Edit fontSize='small' />, text: 'Edit', action: 'edit' },
      {
        icon: <ContentCopy fontSize='small' />,
        text: 'Duplicate',
        action: 'duplicate',
      },
      { icon: <Share fontSize='small' />, text: 'Share', action: 'share' },
    ]
    const taskItems: MenuItemType[] = [
      {
        icon: <CheckCircle fontSize='small' />,
        text: 'Mark Complete',
        action: 'complete',
      },
      {
        icon: <Person fontSize='small' />,
        text: 'Assign to...',
        action: 'assign',
      },
      {
        icon: <Schedule fontSize='small' />,
        text: 'Set Due Date',
        action: 'due-date',
      },
      {
        icon: <Flag fontSize='small' />,
        text: 'Set Priority',
        action: 'priority',
      },
      {
        icon: <Star fontSize='small' />,
        text: 'Add to Favorites',
        action: 'favorite',
      },
    ]
    const containerItems: MenuItemType[] = [
      {
        icon: <Assignment fontSize='small' />,
        text: 'Create Task',
        action: 'create-task',
      },
      {
        icon: <Archive fontSize='small' />,
        text: 'Archive All',
        action: 'archive-all',
      },
    ]
    const destructiveItems: MenuItemType[] = [
      {
        icon: <Archive fontSize='small' />,
        text: 'Archive',
        action: 'archive',
      },
      {
        icon: <Delete fontSize='small' />,
        text: 'Delete',
        action: 'delete',
        destructive: true,
      },
    ]

    if (itemType === 'task') {
      return [
        ...commonItems,
        'divider',
        ...taskItems,
        'divider',
        ...destructiveItems,
      ]
    } else if (itemType === 'container') {
      return [...commonItems, 'divider', ...containerItems]
    }
    return commonItems
  }

  const menuItems = getMenuItems()

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
        }}
        onClick={onClose}
      />
      <Paper
        elevation={12}
        sx={{
          position: 'fixed',
          top: anchorPosition.y,
          left: anchorPosition.x,
          zIndex: 1300,
          minWidth: 220,
          bgcolor: 'background.paper',
          borderRadius: 2,
          py: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <MenuList dense sx={{ py: 0.5 }}>
          {menuItems.map((item, index) => {
            if (typeof item === 'string' && item === 'divider') {
              return <Divider key={index} sx={{ my: 0.5 }} />
            }

            if (typeof item === 'object') {
              return (
                <MenuItem
                  key={item.action}
                  onClick={() => onAction(item.action, itemData)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    mx: 1,
                    color: item.destructive ? 'error.main' : 'text.primary',
                    '&:hover': {
                      bgcolor: item.destructive
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 36,
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                </MenuItem>
              )
            }
            return null
          })}
        </MenuList>
      </Paper>
    </>
  )
}
