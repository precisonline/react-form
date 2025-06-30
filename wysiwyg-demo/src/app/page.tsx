'use client'

import React, { useState } from 'react'
import { Container, Typography, Box, Button, Alert } from '@mui/material'
import WysiwygEditor from './components/WysiwygEditor'

export default function Home() {
  const [content, setContent] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h3' component='h1' gutterBottom>
        Tiptap WYSIWYG Editor
      </Typography>

      <Typography variant='body1' color='text.secondary' paragraph>
        A modern, accessible WYSIWYG editor
      </Typography>

      <Box sx={{ mb: 3 }}>
        <WysiwygEditor
          content={content}
          onChange={handleContentChange}
          placeholder='Write something amazing...'
          minHeight={250}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant='outlined' onClick={() => setShowOutput(!showOutput)}>
          {showOutput ? 'Hide' : 'Show'} HTML Output
        </Button>
        <Button variant='outlined' onClick={() => setContent('')}>
          Clear Content
        </Button>
      </Box>

      {showOutput && (
        <Alert severity='info' sx={{ mb: 2 }}>
          <Typography variant='h6' gutterBottom>
            HTML Output:
          </Typography>
          <Box
            component='pre'
            sx={{
              backgroundColor: 'grey.100',
              p: 2,
              borderRadius: 1,
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {content}
          </Box>
        </Alert>
      )}
    </Container>
  )
}
