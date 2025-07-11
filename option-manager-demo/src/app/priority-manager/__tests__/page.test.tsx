import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PriorityManagerPage from '../page'

// Mock the window.confirm and window.alert APIs
const confirmMock = jest.spyOn(window, 'confirm')
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

describe('PriorityManagerPage', () => {
  // Reset mocks before each test to keep them isolated
  beforeEach(() => {
    confirmMock.mockClear()
    alertMock.mockClear()
  })

  it('should render the initial list of priorities', () => {
    render(<PriorityManagerPage />)
    expect(
      screen.getByRole('heading', { name: /Priority Manager/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Highest Priority/i)).toBeInTheDocument()
    expect(screen.getByText(/Important Task/i)).toBeInTheDocument()
  })

  describe('Editing a Priority', () => {
    it('should enter edit mode on click and save changes', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      const itemToEdit = screen.getByText(/Important Task/i)
      await user.click(itemToEdit)

      // The item is now an input field
      const input = screen.getByDisplayValue(/Important Task/i)
      expect(input).toBeInTheDocument()

      // Change the title
      await user.clear(input)
      await user.type(input, 'Very Important Task')

      // Find and click the save button within the editing form
      const saveButton = screen.getByRole('button', { name: /✓ Save/i })
      await user.click(saveButton)

      // The new title should be visible, and the input should be gone
      expect(screen.getByText(/Very Important Task/i)).toBeInTheDocument()
      expect(
        screen.queryByDisplayValue(/Very Important Task/i)
      ).not.toBeInTheDocument()
    })

    it('should cancel editing when the cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      await user.click(screen.getByText(/Important Task/i))
      const input = screen.getByDisplayValue(/Important Task/i)
      await user.clear(input)
      await user.type(input, 'This will be canceled')

      await user.click(screen.getByRole('button', { name: /✕ Cancel/i }))

      // Original text should be restored
      expect(screen.getByText(/Important Task/i)).toBeInTheDocument()
      expect(
        screen.queryByText(/This will be canceled/i)
      ).not.toBeInTheDocument()
    })
  })

  describe('Adding a new Priority', () => {
    it('should add a new priority item when the form is submitted', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      // Start adding a new priority
      const addPriorityButton = screen.getByRole('button', {
        name: /Add Priority/i,
      })
      await user.click(addPriorityButton)

      // Find the new input field and type in it
      const newTitleInput = screen.getByPlaceholderText(
        /New priority title.../i
      )
      await user.type(newTitleInput, 'A Brand New Priority')

      // Find the final "Add" button and click it
      const finalAddButton = screen.getByRole('button', { name: 'Add' })
      await user.click(finalAddButton)

      // The new priority should now be on the screen
      expect(screen.getByText(/A Brand New Priority/i)).toBeInTheDocument()
    })

    it('should not add a new priority if the title is empty', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)
      const initialItemCount = screen.getAllByRole('heading', {
        level: 2,
      }).length

      await user.click(screen.getByRole('button', { name: /Add Priority/i }))
      await user.click(screen.getByRole('button', { name: 'Add' }))

      const finalItemCount = screen.getAllByRole('heading', { level: 2 }).length
      expect(finalItemCount).toBe(initialItemCount)
    })
  })

  describe('Deleting a Priority', () => {
    it('should delete an item if the user confirms', async () => {
      const user = userEvent.setup()
      confirmMock.mockReturnValue(true) // Simulate user clicking "OK"
      render(<PriorityManagerPage />)

      await user.click(screen.getByText(/Important Task/i))
      await user.click(screen.getByRole('button', { name: /🗑️ Delete/i }))

      expect(confirmMock).toHaveBeenCalledTimes(1)
      expect(screen.queryByText(/Important Task/i)).not.toBeInTheDocument()
    })

    it('should NOT delete an item if the user cancels', async () => {
      const user = userEvent.setup()
      confirmMock.mockReturnValue(false) // Simulate user clicking "Cancel"
      render(<PriorityManagerPage />)

      await user.click(screen.getByText(/Important Task/i))
      await user.click(screen.getByRole('button', { name: /🗑️ Delete/i }))

      expect(confirmMock).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/Important Task/i)).toBeInTheDocument()
    })

    it('should prevent deleting the last item and show an alert', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      // Delete all but one item
      confirmMock.mockReturnValue(true)
      await user.click(screen.getByText('Highest Priority'))
      await user.click(screen.getByText('🗑️ Delete'))
      await user.click(screen.getByText('Important Task'))
      await user.click(screen.getByText('🗑️ Delete'))
      await user.click(screen.getByText('Standard Task'))
      await user.click(screen.getByText('🗑️ Delete'))

      // Now only "Low Priority" is left. Try to delete it.
      await user.click(screen.getByText('Low Priority'))
      await user.click(screen.getByText('🗑️ Delete'))

      // Assert that alert was called and the item still exists
      expect(alertMock).toHaveBeenCalledWith(
        'Cannot delete the last priority. At least one is required.'
      )
      expect(screen.getByText('Low Priority')).toBeInTheDocument()
    })
  })

  describe('Drag and Drop', () => {
    it('should reorder items when dragged and dropped', () => {
      render(<PriorityManagerPage />)

      // Find all the list items by looking for the heading text and grabbing the parent.

      const getDraggableItems = () =>
        screen
          .getAllByRole('heading', { level: 2 })
          .map((h) => h.parentElement)
          .filter((el): el is HTMLElement => el !== null)

      let draggableItems = getDraggableItems()
      expect(
        within(draggableItems[0]).getByText('Highest Priority')
      ).toBeInTheDocument()
      expect(
        within(draggableItems[1]).getByText('Important Task')
      ).toBeInTheDocument()

      // Find the drag handle for the first item (the item text itself is the handle)
      const firstItemDragHandle = within(draggableItems[0]).getByText(
        'Highest Priority'
      )

      // Simulate keyboard drag-and-drop
      fireEvent.keyDown(firstItemDragHandle, { key: ' ' }) // Pick up
      fireEvent.keyDown(firstItemDragHandle, { key: 'ArrowDown' }) // Move down one spot
      fireEvent.keyDown(firstItemDragHandle, { key: ' ' }) // Drop

      // After reordering, the list should be visually updated
      draggableItems = getDraggableItems()
      expect(
        within(draggableItems[0]).getByText('Important Task')
      ).toBeInTheDocument()
      expect(
        within(draggableItems[1]).getByText('Highest Priority')
      ).toBeInTheDocument()
    })
  })
})
