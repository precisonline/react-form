import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WysiwygEditor from '../WysiwygEditor' // Make sure this path is correct
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Editor, UseEditorOptions } from '@tiptap/react'

const theme = createTheme()

jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({
    children,
    title,
  }: {
    children: React.ReactElement
    title: string
  }) =>
    React.cloneElement(children, {
      'aria-label': title,
    } as React.HTMLAttributes<HTMLElement>),
}))

type OnUpdateFn = (props: { editor: Editor }) => void
let capturedOnUpdate: OnUpdateFn | undefined

const mockChainedCommands = {
  focus: jest.fn().mockReturnThis(),
  undo: jest.fn().mockReturnThis(),
  redo: jest.fn().mockReturnThis(),
  toggleBold: jest.fn().mockReturnThis(),
  toggleItalic: jest.fn().mockReturnThis(),
  toggleStrike: jest.fn().mockReturnThis(),
  toggleHeading: jest.fn().mockReturnThis(),
  run: jest.fn(),
}

type MockEditor = {
  chain: jest.Mock<typeof mockChainedCommands>
  can: jest.Mock
  isEditable: boolean
  isActive: jest.Mock<boolean, [name: string]>
  getHTML: jest.Mock<string, []>
  destroy: jest.Mock<void, []>
}

const mockEditor: MockEditor = {
  chain: jest.fn(() => mockChainedCommands),
  can: jest.fn(() => ({
    chain: jest.fn(() => mockChainedCommands),
  })),
  isEditable: true,
  isActive: jest.fn((name: string) => false),
  getHTML: jest.fn(() => '<p>Mocked Content</p>'),
  destroy: jest.fn(),
}

jest.mock('@tiptap/react', () => ({
  ...jest.requireActual('@tiptap/react'),
  useEditor: (options?: UseEditorOptions) => {
    if (options?.onUpdate) {
      capturedOnUpdate = options.onUpdate as OnUpdateFn
    }
    return mockEditor
  },
  EditorContent: ({ editor }: { editor: MockEditor | null }) => (
    <div role='textbox' contentEditable={editor?.isEditable ?? true} />
  ),
}))

describe('WysiwygEditor', () => {
  afterEach(() => {
    mockEditor.destroy()
    jest.clearAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    capturedOnUpdate = undefined
    mockEditor.isEditable = true
  })

  it('renders the editor and toolbar by default', () => {
    render(
      <ThemeProvider theme={theme}>
        <WysiwygEditor />
      </ThemeProvider>
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()

    expect(screen.getByTestId('wysiwyg-toolbar')).toBeInTheDocument()
  })

  it('calls the onChange prop when the editor content is updated', () => {
    const handleChange = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <WysiwygEditor onChange={handleChange} />
      </ThemeProvider>
    )
    expect(capturedOnUpdate).toBeInstanceOf(Function)
    if (capturedOnUpdate) {
      capturedOnUpdate({ editor: mockEditor as unknown as Editor })
    }
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('<p>Mocked Content</p>')
  })

  it('disables the editor when readOnly is true', () => {
    mockEditor.isEditable = false
    render(
      <ThemeProvider theme={theme}>
        <WysiwygEditor readOnly />
      </ThemeProvider>
    )
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'contenteditable',
      'false'
    )
  })

  it('hides the toolbar when showToolbar is false', () => {
    render(
      <ThemeProvider theme={theme}>
        <WysiwygEditor showToolbar={false} />
      </ThemeProvider>
    )
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('calls the correct command when a toolbar button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <WysiwygEditor />
      </ThemeProvider>
    )

    const boldButton = screen.getByRole('button', { name: 'Bold (Ctrl+B)' })
    fireEvent.click(boldButton)

    expect(mockEditor.chain).toHaveBeenCalled()
    expect(mockChainedCommands.focus).toHaveBeenCalled()
    expect(mockChainedCommands.toggleBold).toHaveBeenCalled()
    expect(mockChainedCommands.run).toHaveBeenCalled()
  })
})
