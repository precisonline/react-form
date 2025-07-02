'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  Button,
  Popover,
  TextField,
  Stack,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatColorText,
  FormatColorFill,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  FormatQuote,
  FormatSize,
} from '@mui/icons-material'

interface WysiwygEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  minHeight?: number
  showToolbar?: boolean
  readOnly?: boolean
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  showToolbar = true,
  readOnly = false,
}) => {
  const [colorAnchorEl, setColorAnchorEl] =
    React.useState<HTMLButtonElement | null>(null)
  const [highlightAnchorEl, setHighlightAnchorEl] =
    React.useState<HTMLButtonElement | null>(null)
  const [linkAnchorEl, setLinkAnchorEl] =
    React.useState<HTMLButtonElement | null>(null)
  const [linkUrl, setLinkUrl] = React.useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'custom-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'custom-image',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  const ToolbarButton: React.FC<{
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }> = ({ onClick, isActive, disabled, children, title }) => (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size='small'
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          backgroundColor: isActive ? 'action.selected' : 'transparent',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  )

  const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorAnchorEl(event.currentTarget)
  }

  const handleHighlightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHighlightAnchorEl(event.currentTarget)
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, '')
    if (text) {
      setLinkUrl(editor.getAttributes('link').href || '')
      setLinkAnchorEl(event.currentTarget)
    }
  }

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkAnchorEl(null)
    setLinkUrl('')
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const textColors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
    '#800080',
    '#008000',
    '#ffc0cb',
    '#a52a2a',
    '#808080',
    '#000080',
  ]

  const highlightColors = [
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#ff00ff',
    '#ffa500',
    '#ff0000',
    '#0000ff',
    '#ffc0cb',
    '#90EE90',
    '#DDA0DD',
  ]

  return (
    <Paper variant='outlined' sx={{ overflow: 'hidden' }}>
      {showToolbar && (
        <Toolbar
          data-testid='wysiwyg-toolbar'
          variant='dense'
          sx={{
            minHeight: 64,
            backgroundColor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
            gap: 0.5,
            flexWrap: 'wrap',
            py: 1,
          }}
        >
          {/* Text Formatting */}
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <Select
              value={
                editor.isActive('heading', { level: 1 })
                  ? 'h1'
                  : editor.isActive('heading', { level: 2 })
                  ? 'h2'
                  : editor.isActive('heading', { level: 3 })
                  ? 'h3'
                  : 'paragraph'
              }
              onChange={(e) => {
                const value = e.target.value
                if (value === 'paragraph') {
                  editor.chain().focus().setParagraph().run()
                } else {
                  const level = parseInt(value.replace('h', ''))
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 })
                    .run()
                }
              }}
              displayEmpty
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value='paragraph'>Paragraph</MenuItem>
              <MenuItem value='h1'>Heading 1</MenuItem>
              <MenuItem value='h2'>Heading 2</MenuItem>
              <MenuItem value='h3'>Heading 3</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Basic Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title='Bold (Ctrl+B)'
          >
            <FormatBold fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title='Italic (Ctrl+I)'
          >
            <FormatItalic fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title='Underline (Ctrl+U)'
          >
            <FormatUnderlined fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title='Strikethrough'
          >
            <FormatSize fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title='Inline Code'
          >
            <Code fontSize='small' />
          </ToolbarButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Text Color */}
          <ToolbarButton onClick={handleColorClick} title='Text Color'>
            <FormatColorText fontSize='small' />
          </ToolbarButton>

          {/* Highlight Color */}
          <ToolbarButton onClick={handleHighlightClick} title='Highlight Color'>
            <FormatColorFill fontSize='small' />
          </ToolbarButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title='Align Left'
          >
            <FormatAlignLeft fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title='Align Center'
          >
            <FormatAlignCenter fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title='Align Right'
          >
            <FormatAlignRight fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title='Justify'
          >
            <FormatAlignJustify fontSize='small' />
          </ToolbarButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title='Bullet List'
          >
            <FormatListBulleted fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title='Numbered List'
          >
            <FormatListNumbered fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title='Quote'
          >
            <FormatQuote fontSize='small' />
          </ToolbarButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Links and Images */}
          <ToolbarButton
            onClick={handleLinkClick}
            isActive={editor.isActive('link')}
            title='Add Link'
          >
            <LinkIcon fontSize='small' />
          </ToolbarButton>

          <ToolbarButton onClick={addImage} title='Add Image'>
            <ImageIcon fontSize='small' />
          </ToolbarButton>

          <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title='Undo (Ctrl+Z)'
          >
            <Undo fontSize='small' />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title='Redo (Ctrl+Y)'
          >
            <Redo fontSize='small' />
          </ToolbarButton>
        </Toolbar>
      )}

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={() => setColorAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1,
          }}
        >
          {textColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: '2px',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              onClick={() => {
                editor.chain().focus().setColor(color).run()
                setColorAnchorEl(null)
              }}
            />
          ))}
          <Button
            size='small'
            onClick={() => {
              editor.chain().focus().unsetColor().run()
              setColorAnchorEl(null)
            }}
            sx={{ gridColumn: 'span 5', mt: 1 }}
          >
            Remove Color
          </Button>
        </Box>
      </Popover>

      {/* Highlight Color Popover */}
      <Popover
        open={Boolean(highlightAnchorEl)}
        anchorEl={highlightAnchorEl}
        onClose={() => setHighlightAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1,
          }}
        >
          {highlightColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: '2px',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              onClick={() => {
                editor.chain().focus().setHighlight({ color }).run()
                setHighlightAnchorEl(null)
              }}
            />
          ))}
          <Button
            size='small'
            onClick={() => {
              editor.chain().focus().unsetHighlight().run()
              setHighlightAnchorEl(null)
            }}
            sx={{ gridColumn: 'span 5', mt: 1 }}
          >
            Remove Highlight
          </Button>
        </Box>
      </Popover>

      {/* Link Dialog */}
      <Popover
        open={Boolean(linkAnchorEl)}
        anchorEl={linkAnchorEl}
        onClose={() => setLinkAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Stack spacing={2}>
            <TextField
              label='Link URL'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder='https://example.com'
              size='small'
              fullWidth
              autoFocus
            />
            <Stack direction='row' spacing={1}>
              <Button onClick={setLink} variant='contained' size='small'>
                {linkUrl ? 'Update Link' : 'Add Link'}
              </Button>
              <Button
                onClick={() => {
                  editor.chain().focus().unsetLink().run()
                  setLinkAnchorEl(null)
                }}
                variant='outlined'
                size='small'
              >
                Remove Link
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>

      {/* Editor Content */}
      <Box
        sx={{
          minHeight: `${minHeight}px`,
          p: 2,
          '& .ProseMirror': {
            outline: 'none',
            minHeight: `${minHeight - 32}px`,

            '& ul, & ol': {
              paddingLeft: '1.5rem',
            },
            '& li': {
              marginBottom: '0.25rem',
            },
            '& strong': {
              fontWeight: 600,
            },
            '& em': {
              fontStyle: 'italic',
            },
            '& u': {
              textDecoration: 'underline',
            },
            '& s': {
              textDecoration: 'line-through',
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontFamily: 'monospace',
            },
            '& blockquote': {
              borderLeft: '4px solid #ddd',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              margin: '1rem 0',
            },
            '& .custom-link': {
              color: 'primary.main',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            },
            '& .custom-image': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '0.25rem',
            },
            '& h1': {
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            },
            '& h2': {
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            },
            '& h3': {
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  )
}

export default WysiwygEditor
