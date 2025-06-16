'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
  Avatar,
  Grid,
} from '@mui/material'
import {
  X,
  BarChart3,
  Settings,
  Calendar,
  Maximize2,
  Minimize2,
} from 'lucide-react'

interface WindowState {
  id: string
  type: 'analytics' | 'settings' | 'calendar'
  x: number
  y: number
  width: number
  height: number
  isMaximized: boolean
  zIndex: number
}

// Window configurations
const WINDOW_CONFIGS = {
  analytics: {
    title: 'Analytics Dashboard',
    subtitle: 'Real-time insights',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)',
    defaultSize: { width: 500, height: 400 },
  },
  settings: {
    title: 'Settings Panel',
    subtitle: 'Configuration',
    icon: Settings,
    gradient: 'linear-gradient(135deg, #1D4ED8, #4F46E5)',
    defaultSize: { width: 450, height: 380 },
  },
  calendar: {
    title: 'Calendar View',
    subtitle: 'Schedule & events',
    icon: Calendar,
    gradient: 'linear-gradient(135deg, #60A5FA, #818CF8)',
    defaultSize: { width: 480, height: 420 },
  },
} as const

const MultiWindowInterface = () => {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [interaction, setInteraction] = useState<{
    type: 'drag' | 'resize' | null
    windowId: string | null
    startX: number
    startY: number
    startWidth?: number
    startHeight?: number
    direction?: string
  }>({ type: null, windowId: null, startX: 0, startY: 0 })

  // Memoized active window calculation
  const activeWindowId = useMemo(
    () =>
      windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), windows[0])
        ?.id,
    [windows]
  )

  // Optimized window operations
  const openWindow = useCallback((type: keyof typeof WINDOW_CONFIGS) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.type === type)
      if (existing) {
        // Bring to front
        const maxZ = Math.max(...prev.map((w) => w.zIndex))
        return prev.map((w) =>
          w.id === existing.id ? { ...w, zIndex: maxZ + 1 } : w
        )
      }

      const config = WINDOW_CONFIGS[type]
      const newWindow: WindowState = {
        id: `${type}-${Date.now()}`,
        type,
        x: 100 + prev.length * 40,
        y: 100 + prev.length * 40,
        ...config.defaultSize,
        isMaximized: false,
        zIndex: Math.max(...prev.map((w) => w.zIndex), 1000) + 1,
      }
      return [...prev, newWindow]
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              x: w.isMaximized ? 100 : 0,
              y: w.isMaximized ? 100 : 0,
            }
          : w
      )
    )
  }, [])

  // Unified mouse handlers
  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      windowId: string,
      type: 'drag' | 'resize',
      direction?: string
    ) => {
      e.preventDefault()
      const window = windows.find((w) => w.id === windowId)
      if (!window || window.isMaximized) return

      let offsetX = 0,
        offsetY = 0
      if (type === 'drag') {
        offsetX = e.clientX - window.x
        offsetY = e.clientY - window.y
      }

      setInteraction({
        type,
        windowId,
        startX: type === 'drag' ? offsetX : e.clientX,
        startY: type === 'drag' ? offsetY : e.clientY,
        startWidth: window.width,
        startHeight: window.height,
        direction,
      })

      // Bring to front
      const maxZ = Math.max(...windows.map((w) => w.zIndex))
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w))
      )
    },
    [windows]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!interaction.type || !interaction.windowId) return

      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== interaction.windowId) return w

          if (interaction.type === 'drag') {
            const newX = e.clientX - interaction.startX
            const newY = e.clientY - interaction.startY

            return {
              ...w,
              x: Math.max(0, Math.min(window.innerWidth - w.width, newX)),
              y: Math.max(0, Math.min(window.innerHeight - w.height, newY)),
            }
          }

          if (interaction.type === 'resize') {
            const deltaX = e.clientX - interaction.startX
            const deltaY = e.clientY - interaction.startY

            let newWidth = w.width
            let newHeight = w.height

            if (interaction.direction?.includes('e')) {
              newWidth = Math.max(300, interaction.startWidth! + deltaX)
            }
            if (interaction.direction?.includes('s')) {
              newHeight = Math.max(200, interaction.startHeight! + deltaY)
            }

            return { ...w, width: newWidth, height: newHeight }
          }

          return w
        })
      )
    },
    [interaction]
  )

  const handleMouseUp = useCallback(() => {
    setInteraction({ type: null, windowId: null, startX: 0, startY: 0 })
  }, [])

  // Event listeners
  React.useEffect(() => {
    if (interaction.type) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = 'auto'
      }
    }
  }, [interaction.type, handleMouseMove, handleMouseUp])

  // Simplified window content
  const renderContent = useCallback((window: WindowState) => {
    switch (window.type) {
      case 'analytics':
        return (
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {[
                { label: 'Revenue', value: '$847K', change: '+12%' },
                { label: 'Users', value: '23,451', change: '+8%' },
              ].map((metric, i) => (
                <Grid item xs={6} key={i}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    }}
                  >
                    <Typography variant='caption' color='text.secondary'>
                      {metric.label}
                    </Typography>
                    <Typography variant='h6' fontWeight='bold'>
                      {metric.value}
                    </Typography>
                    <Typography variant='caption' color='success.main'>
                      {metric.change}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            {['Notifications', 'Privacy', 'Display', 'Account'].map(
              (item, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 2,
                    mb: 1,
                    cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant='body2'>{item}</Typography>
                </Paper>
              )
            )}
          </Box>
        )
      case 'calendar':
        return (
          <Box sx={{ p: 3 }}>
            {[
              { time: '9:00 AM', event: 'Team Meeting' },
              { time: '11:30 AM', event: 'Project Review' },
              { time: '2:00 PM', event: 'Client Call' },
            ].map((item, i) => (
              <Paper
                key={i}
                sx={{
                  p: 2,
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                <Typography variant='body2' fontWeight='medium'>
                  {item.event}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {item.time}
                </Typography>
              </Paper>
            ))}
          </Box>
        )
      default:
        return null
    }
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 50%, #F8FAFC 100%)',
        position: 'relative',
      }}
    >
      {/* Main UI */}
      <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center', mb: 6 }}>
          <Typography variant='h3' fontWeight='bold' mb={2}>
            Multi-Window Interface
          </Typography>
          <Typography variant='body1' color='text.secondary' mb={4}>
            Launch multiple draggable windows
          </Typography>

          <Grid container spacing={3} justifyContent='center'>
            {Object.entries(WINDOW_CONFIGS).map(([type, config]) => (
              <Grid item xs={12} md={4} key={type}>
                <Card
                  onClick={() =>
                    openWindow(type as keyof typeof WINDOW_CONFIGS)
                  }
                  sx={{
                    cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(59,130,246,0.15)',
                      borderColor: 'rgba(59,130,246,0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 3,
                        mx: 'auto',
                        background: config.gradient,
                        borderRadius: 2,
                      }}
                    >
                      <config.icon size={32} color='white' />
                    </Avatar>
                    <Typography variant='h6' fontWeight='bold' mb={1}>
                      {config.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' mb={3}>
                      {config.subtitle}
                    </Typography>
                    <Button
                      variant='contained'
                      fullWidth
                      startIcon={<config.icon size={20} />}
                      sx={{
                        background: config.gradient,
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      Open Window
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Windows */}
      {windows.map((window) => {
        const config = WINDOW_CONFIGS[window.type]
        const isActive = window.id === activeWindowId

        return (
          <Paper
            key={window.id}
            sx={{
              position: 'fixed',
              left: window.x,
              top: window.y,
              width: window.isMaximized ? '100vw' : window.width,
              height: window.isMaximized ? '100vh' : window.height,
              zIndex: window.zIndex,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              borderRadius: window.isMaximized ? 0 : 2,
              border: isActive
                ? '2px solid rgba(59,130,246,0.6)'
                : '1px solid rgba(59,130,246,0.2)',
              boxShadow: isActive
                ? '0 25px 50px rgba(59,130,246,0.25)'
                : '0 15px 35px rgba(59,130,246,0.15)',
              transition: window.isMaximized
                ? 'all 0.3s ease'
                : 'border 0.2s ease, box-shadow 0.2s ease',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              onMouseDown={(e) => handleMouseDown(e, window.id, 'drag')}
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor:
                  interaction.windowId === window.id ? 'grabbing' : 'move',
                userSelect: 'none',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{ width: 32, height: 32, background: config.gradient }}
                >
                  <config.icon size={16} color='white' />
                </Avatar>
                <Box>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {config.title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {config.subtitle}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size='small'
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMaximize(window.id)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    '&:hover': {
                      bgcolor: 'rgba(59,130,246,0.1)',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {window.isMaximized ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </IconButton>
                <IconButton
                  size='small'
                  onClick={(e) => {
                    e.stopPropagation()
                    closeWindow(window.id)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    '&:hover': {
                      bgcolor: 'rgba(239,68,68,0.1)',
                      color: 'error.main',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ height: 'calc(100% - 73px)', overflow: 'hidden' }}>
              {renderContent(window)}
            </Box>

            {/* Resize handles */}
            {!window.isMaximized && (
              <>
                <Box
                  onMouseDown={(e) =>
                    handleMouseDown(e, window.id, 'resize', 'e')
                  }
                  sx={{
                    position: 'absolute',
                    top: 12,
                    bottom: 12,
                    right: 0,
                    width: 8,
                    cursor: 'e-resize',
                    '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' },
                  }}
                />
                <Box
                  onMouseDown={(e) =>
                    handleMouseDown(e, window.id, 'resize', 's')
                  }
                  sx={{
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: 0,
                    height: 8,
                    cursor: 's-resize',
                    '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' },
                  }}
                />
                <Box
                  onMouseDown={(e) =>
                    handleMouseDown(e, window.id, 'resize', 'se')
                  }
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    cursor: 'se-resize',
                    '&:hover': { bgcolor: 'rgba(59,130,246,0.1)' },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      background:
                        'linear-gradient(-45deg, transparent 30%, rgba(156,163,175,0.5) 30%, rgba(156,163,175,0.5) 32%, transparent 32%)',
                    },
                  }}
                />
              </>
            )}
          </Paper>
        )
      })}
    </Box>
  )
}

export default MultiWindowInterface
