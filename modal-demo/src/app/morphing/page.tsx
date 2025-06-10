'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
  Avatar,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { X, Sparkles, BarChart3, Users, DollarSign, Target } from 'lucide-react'

const GlassBackdrop = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(135deg, 
    rgba(0, 0, 0, 0.75) 0%, 
    rgba(15, 23, 42, 0.8) 25%,
    rgba(30, 41, 59, 0.75) 50%,
    rgba(15, 23, 42, 0.8) 75%,
    rgba(0, 0, 0, 0.75) 100%)`,
  backdropFilter: 'blur(20px)',
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
})

const GlassModal = styled(Paper)<{ expanded?: boolean }>(({ expanded }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(24px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: `
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3)
  `,
  outline: 'none',
  transformOrigin: 'center center',
  width: expanded ? '800px' : '128px',
  height: expanded ? '384px' : '48px',
  maxWidth: expanded ? '90vw' : '128px',
  transform: expanded ? 'scale(1)' : 'scale(0.95)',
  opacity: expanded ? 1 : 0,
  transition: 'all 0.2s ease-out',
}))

const FloatingOrb = styled('div')<{ index: number }>(({ index }) => ({
  position: 'absolute',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent)',
  opacity: 0.1,
  left: `${15 + (index % 3) * 30}%`,
  top: `${15 + Math.floor(index / 3) * 25}%`,
  animation: `float ${8 + index * 2}s infinite ease-in-out`,
  animationDelay: `${index * 0.5}s`,
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '33%': { transform: 'translateY(-15px) rotate(120deg)' },
    '66%': { transform: 'translateY(10px) rotate(240deg)' },
  },
}))

const CleanMorphingModal = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const MorphingModal = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
      setIsExpanded(true)
    }, [])

    const handleClose = () => {
      setIsExpanded(false)

      setTimeout(() => setActiveModal(null), 200)
    }

    const metrics = [
      {
        label: 'Revenue',
        value: '$847K',
        change: '+12%',
        positive: true,
        icon: DollarSign,
        color: 'success' as const,
        progress: 75,
      },
      {
        label: 'Users',
        value: '23,451',
        change: '+8%',
        positive: true,
        icon: Users,
        color: 'primary' as const,
        progress: 82,
      },
      {
        label: 'Conversion',
        value: '3.2%',
        change: '-2%',
        positive: false,
        icon: Target,
        color: 'error' as const,
        progress: 65,
      },
    ]

    return (
      <GlassBackdrop>
        {/* Floating background elements */}
        {Array.from({ length: 8 }, (_, i) => (
          <FloatingOrb key={i} index={i} />
        ))}

        <GlassModal expanded={isExpanded}>
          {isExpanded && (
            <Box
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background:
                        'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                      borderRadius: '12px',
                    }}
                  >
                    <Sparkles size={24} color='white' />
                  </Avatar>
                  <Box>
                    <Typography
                      variant='h5'
                      component='h2'
                      fontWeight='bold'
                      color='text.primary'
                    >
                      Analytics Dashboard
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Real-time business insights
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
                  }}
                >
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Content in 3 columns - NO ANIMATIONS */}
              <Box
                sx={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 3,
                }}
              >
                {metrics.map((metric, i) => (
                  <Card
                    key={i}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                          }}
                        >
                          <metric.icon size={20} color='#6B7280' />
                        </Avatar>
                        <Typography
                          variant='body2'
                          fontWeight='medium'
                          color='text.secondary'
                        >
                          {metric.label}
                        </Typography>
                      </Box>

                      <Typography
                        variant='h4'
                        component='div'
                        fontWeight='bold'
                        color='text.primary'
                        sx={{ mb: 1 }}
                      >
                        {metric.value}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant='body2'
                          color={
                            metric.positive ? 'success.main' : 'error.main'
                          }
                          fontWeight='medium'
                        >
                          {metric.change}
                        </Typography>
                        <Chip
                          label={metric.positive ? 'Growth' : 'Decline'}
                          color={metric.positive ? 'success' : 'error'}
                          size='small'
                          variant='outlined'
                          sx={{
                            backgroundColor: metric.positive
                              ? 'rgba(22, 163, 74, 0.1)'
                              : 'rgba(239, 68, 68, 0.1)',
                            fontWeight: 'medium',
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>

                      <LinearProgress
                        variant='determinate'
                        value={metric.progress}
                        color={metric.color}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  variant='text'
                  color='primary'
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'medium',
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant='contained'
                  startIcon={<BarChart3 size={16} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'medium',
                    background:
                      'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    borderRadius: '8px',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                    },
                  }}
                >
                  Export Report
                </Button>
              </Box>
            </Box>
          )}
        </GlassModal>
      </GlassBackdrop>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #F1F5F9 0%, #DBEAFE 50%, #E0E7FF 100%)',
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background:
                    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  borderRadius: '16px',
                  mb: 3,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Sparkles size={32} color='white' />
              </Avatar>
              <Typography
                variant='h5'
                component='h3'
                fontWeight='bold'
                color='text.primary'
                sx={{ mb: 2 }}
              >
                Modal
              </Typography>
              <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
                Check it out
              </Typography>
              <Button
                variant='contained'
                fullWidth
                startIcon={<Sparkles size={20} />}
                onClick={() => setActiveModal('fast')}
                sx={{
                  py: 2,
                  textTransform: 'none',
                  fontWeight: 'semibold',
                  fontSize: '1.1rem',
                  background:
                    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4)',
                  },
                }}
              >
                Launch Modal
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Render Modal */}
      {activeModal === 'fast' && <MorphingModal />}
    </Box>
  )
}

export default CleanMorphingModal
