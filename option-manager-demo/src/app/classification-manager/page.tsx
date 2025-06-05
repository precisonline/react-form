// src/app/classification-manager/page.tsx
'use client'

import { useState, useCallback } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Link from 'next/link'
import { OptionsManager, type Option } from '../components/OptionsManager'

export default function ClassificationManagerPage() {
  const [classifications, setClassifications] = useState<Option[]>([
    {
      id: '1',
      name: 'BUG',
      color: '#f44336',
      order: 0,
      active: true,
      type: 'classification',
    },
    {
      id: '2',
      name: 'FEATURE',
      color: '#2196f3',
      order: 1,
      active: true,
      type: 'classification',
    },
    {
      id: '3',
      name: 'IMPROVEMENT',
      color: '#ff9800',
      order: 2,
      active: true,
      type: 'classification',
    },
    {
      id: '4',
      name: 'DOCUMENTATION',
      color: '#795548',
      order: 3,
      active: true,
      type: 'classification',
    },
    {
      id: '5',
      name: 'RESEARCH',
      color: '#9c27b0',
      order: 4,
      active: true,
      type: 'classification',
    },
  ])

  const handleSave = useCallback(async (updatedClassifications: Option[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setClassifications(updatedClassifications)
  }, [])

  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      const reorderedClassifications = Array.from(classifications)
      const [removed] = reorderedClassifications.splice(startIndex, 1)
      reorderedClassifications.splice(endIndex, 0, removed)

      const updatedClassifications = reorderedClassifications.map(
        (classification, index) => ({
          ...classification,
          order: index,
        })
      )

      setClassifications(updatedClassifications)
    },
    [classifications]
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
          Classification Manager
        </Typography>
        <Typography variant='body1' color='textSecondary' paragraph>
          Organize tasks by type or category. Create classifications that help
          you sort and filter work items effectively.
        </Typography>
      </Box>
      <OptionsManager
        title='Task Classifications'
        options={classifications}
        type='classification'
        onSave={handleSave}
        onReorder={handleReorder}
        maxOptions={15}
        allowReorder={true}
        allowDelete={true}
      />
    </Container>
  )
}
