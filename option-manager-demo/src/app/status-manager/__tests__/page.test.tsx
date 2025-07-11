import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatusManagerPage from '../page'

// Mock the browser's confirm and alert APIs
const confirmMock = jest.spyOn(window, 'confirm')
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {}) // Mock alert to prevent it from showing in tests

describe('StatusManagerPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    confirmMock.mockClear()
    alertMock.mockClear()
  })

  it('should render the initial status flow', () => {
    render(<StatusManagerPage />)
    expect(
      screen.getByRole('heading', { name: /Status Manager/i })
    ).toBeInTheDocument()
    expect(screen.getByText('OPEN')).toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.getByText('REVIEW')).toBeInTheDocument()
    expect(screen.getByText('DONE')).toBeInTheDocument()
  })

  describe('Adding a new status', () => {
    it('should show an input and add a new status on save', async () => {
      const user = userEvent.setup()
      render(<StatusManagerPage />)
      await user.click(screen.getByRole('button', { name: /Add Status/i }))
      const nameInput = screen.getByPlaceholderText(/Status name/i)
      await user.type(nameInput, 'BLOCKED')

      const addButton = within(
        nameInput.closest('div[class^="MuiBox-root"]')!
      ).getByRole('button', { name: '✓' })
      await user.click(addButton)

      expect(await screen.findByText('BLOCKED')).toBeInTheDocument()
    })
  })

  describe('Editing a status', () => {
    it('should enter edit mode on click, allow changes, and save', async () => {
      const user = userEvent.setup()
      render(<StatusManagerPage />)

      // Click on the 'REVIEW' status to start editing
      const reviewStatus = screen.getByText('REVIEW')
      await user.click(reviewStatus)

      // The status should now be an input field with the current value
      const editInput = screen.getByDisplayValue('REVIEW')
      expect(editInput).toBeInTheDocument()

      // Change the name and save
      await user.clear(editInput)
      await user.type(editInput, 'CODE REVIEW')
      await user.click(screen.getByRole('button', { name: '✓' }))

      // The updated status should be visible
      expect(await screen.findByText('CODE REVIEW')).toBeInTheDocument()
      expect(screen.queryByText('REVIEW')).not.toBeInTheDocument()
    })

    it('should cancel the edit when the cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<StatusManagerPage />)

      await user.click(screen.getByText('REVIEW'))
      const editInput = screen.getByDisplayValue('REVIEW')
      await user.type(editInput, '...editing')

      // Click cancel
      await user.click(screen.getByRole('button', { name: '✕' }))

      // The original name should be restored
      expect(screen.getByText('REVIEW')).toBeInTheDocument()
      expect(screen.queryByDisplayValue(/...editing/)).not.toBeInTheDocument()
    })
  })

  describe('Deleting a status', () => {
    it('should delete a status when confirmed', async () => {
      const user = userEvent.setup()
      confirmMock.mockReturnValue(true) // Simulate user clicking "OK"
      render(<StatusManagerPage />)

      await user.click(screen.getByText('REVIEW'))
      await user.click(screen.getByRole('button', { name: '🗑' }))

      expect(confirmMock).toHaveBeenCalledTimes(1)
      expect(screen.getByDisplayValue('REVIEW')).toBeInTheDocument()
    })

    it('should not delete a status if canceled', async () => {
      const user = userEvent.setup()
      confirmMock.mockReturnValue(false) // Simulate user clicking "Cancel"
      render(<StatusManagerPage />)

      await user.click(screen.getByText('REVIEW'))
      await user.click(screen.getByRole('button', { name: '🗑' }))

      expect(confirmMock).toHaveBeenCalledTimes(1)
      expect(screen.getByText('REVIEW')).toBeInTheDocument()
    })

    it('prevents deleting the last remaining status', async () => {
      const user = userEvent.setup()
      confirmMock.mockReturnValue(true)
      render(<StatusManagerPage />)

      // Delete all but one status
      await user.click(screen.getByText('OPEN'))
      await user.click(screen.getByText('🗑'))
      await user.click(screen.getByText('IN PROGRESS'))
      await user.click(screen.getByText('🗑'))
      await user.click(screen.getByText('REVIEW'))
      await user.click(screen.getByText('🗑'))

      // Now only 'DONE' is left. Attempt to delete it.
      await user.click(screen.getByText('DONE'))
      await user.click(screen.getByText('🗑'))

      // Alert should be shown, and the item should still be there
      expect(alertMock).toHaveBeenCalledWith(
        'Cannot delete the last status. At least one status is required.'
      )
      expect(screen.getByDisplayValue('DONE')).toBeInTheDocument() // It's still in edit mode
    })
  })

  describe('Drag and Drop', () => {
    it('should reorder statuses correctly', () => {
      render(<StatusManagerPage />)

      const getItems = () =>
        screen.getAllByRole('button', {
          name: /(OPEN|IN PROGRESS|REVIEW|DONE)/i,
        })

      let items = getItems()
      expect(items[0]).toHaveTextContent('OPEN')
      expect(items[1]).toHaveTextContent('IN PROGRESS')

      // Find the drag handle for the first item
      const firstItem = screen.getByText('OPEN')

      // Simulate keyboard drag-and-drop
      fireEvent.keyDown(firstItem, { key: ' ' }) // Pick up
      fireEvent.keyDown(firstItem, { key: 'ArrowRight' }) // Move right
      fireEvent.keyDown(firstItem, { key: ' ' }) // Drop

      // Check the new order
      items = getItems()
      expect(items[0]).toHaveTextContent('IN PROGRESS')
      expect(items[1]).toHaveTextContent('OPEN')
    })
  })
})
