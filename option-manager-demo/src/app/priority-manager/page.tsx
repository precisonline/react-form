'use client'

import { useState, useCallback } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Link from 'next/link'
import { OptionsManager, type Option } from '../components/OptionsManager'

export default function PriorityManagerPage() {
  const [priorities, setPriorities] = useState<Option[]>([
    {
      id: '1',
      name: 'LOW',
      color: '#4caf50',
      order: 0,
      active: true,
      type: 'priority',
    },
    {
      id: '2',
      name: 'MEDIUM',
      color: '#ff9800',
      order: 1,
      active: true,
      type: 'priority',
    },
    {
      id: '3',
      name: 'HIGH',
      color: '#f44336',
      order: 2,
      active: true,
      type: 'priority',
    },
    {
      id: '4',
      name: 'URGENT',
      color: '#9c27b0',
      order: 3,
      active: true,
      type: 'priority',
    },
  ])

  const handleSave = useCallback(async (updatedPriorities: Option[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPriorities(updatedPriorities)
  }, [])

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const reorderedPriorities = Array.from(priorities)
      const [removed] = reorderedPriorities.splice(startIndex, 1)
      reorderedPriorities.splice(endIndex, 0, removed)

      const updatedPriorities = reorderedPriorities.map((priority, index) => ({
        ...priority,
        order: index,
      }))

      setPriorities(updatedPriorities)
    },
    [priorities]
  )

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          component={Link}
          href='/'
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <Typography variant='h4' component='h1' gutterBottom>
          Priority Manager
        </Typography>
        <Typography variant='body1' color='textSecondary' paragraph>
          Set up priority levels for your tasks. Organize from lowest to highest
          priority and customize colors to create visual hierarchy.
        </Typography>
      </Box>
      <OptionsManager
        title='Task Priorities'
        options={priorities}
        type='priority'
        onSave={handleSave}
        onReorder={handleReorder}
        maxOptions={8}
        allowReorder={true}
        allowDelete={true}
      />
    </Container>
  )
}
