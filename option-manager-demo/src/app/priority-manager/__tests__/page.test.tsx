import React from 'react'
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PriorityManagerPage from '../page'

// Mocking window.confirm and window.alert for the delete actions
const confirmMock = jest.spyOn(window, 'confirm')
const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

describe('PriorityManagerPage', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    confirmMock.mockClear()
    alertMock.mockClear()
  })

  afterAll(() => {
    // Restore original implementations after all tests are done
    confirmMock.mockRestore()
    alertMock.mockRestore()
  })

  it('should render the main heading and initial priority items', () => {
    render(<PriorityManagerPage />)
    expect(
      screen.getByRole('heading', { name: /priority manager/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Highest Priority')).toBeInTheDocument()
    expect(screen.getByText('Low Priority')).toBeInTheDocument()
  })

  describe('Editing a Priority', () => {
    it('should allow editing an existing priority title', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      const itemToEdit = screen.getByText('Important Task')
      await user.click(itemToEdit)

      const input = screen.getByDisplayValue('Important Task')

      fireEvent.change(input, { target: { value: 'Very Important Task' } })

      const parentCard = input.closest('div[class*="MuiBox-root"]')
      if (!(parentCard instanceof HTMLElement))
        throw new Error('Parent card not found')

      const saveButton = within(parentCard).getByRole('button', {
        name: /save/i,
      })
      await user.click(saveButton)

      expect(await screen.findByText('Very Important Task')).toBeInTheDocument()
      expect(
        screen.queryByDisplayValue('Very Important Task')
      ).not.toBeInTheDocument()
    })
  })

  describe('Deleting a Priority', () => {
    it('should delete an item if the user confirms', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      confirmMock.mockReturnValue(true) // User clicks "OK"

      // Click the item first to reveal the delete button
      const itemToDelete = screen.getByText('Standard Task')
      await user.click(itemToDelete)

      // After the click, the item is an input field. Find its parent...
      const parentCard = screen
        .getByDisplayValue('Standard Task')
        .closest('div[class*="MuiBox-root"]')
      if (!(parentCard instanceof HTMLElement))
        throw new Error('Parent card not found for "Standard Task"')

      // ...then find the delete button within that parent.
      const deleteButton = within(parentCard).getByRole('button', {
        name: /delete/i,
      })
      await user.click(deleteButton)

      expect(confirmMock).toHaveBeenCalledTimes(1)
      // Use waitFor to give the UI time to update after deletion
      await waitFor(() => {
        expect(screen.queryByText('Standard Task')).not.toBeInTheDocument()
      })
    })

    it('should NOT delete an item if the user cancels', async () => {
      const user = userEvent.setup()
      render(<PriorityManagerPage />)

      confirmMock.mockReturnValue(false) // User clicks "Cancel"

      // Click the item first to reveal the delete button
      const itemText = screen.getByText('Important Task')
      await user.click(itemText)

      const parentCard = screen
        .getByDisplayValue('Important Task')
        .closest('div[class*="MuiBox-root"]')
      if (!(parentCard instanceof HTMLElement))
        throw new Error('Parent card not found for "Important Task"')

      const deleteButton = within(parentCard).getByRole('button', {
        name: /delete/i,
      })
      await user.click(deleteButton)

      expect(confirmMock).toHaveBeenCalledTimes(1)
      // After canceling, the item should still be in edit mode (as an input)
      expect(screen.getByDisplayValue('Important Task')).toBeInTheDocument()
    })
  })
})
