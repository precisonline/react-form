import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClassificationManagerPage from '../page'

import type { Option } from '../../../app/types/options'

// Mock the OptionsManager component to test the callbacks passed to it
jest.mock('../../../components/shared/OptionsManager', () => ({
  __esModule: true,
  // Define the types for the props in the mocked component
  OptionsManager: ({
    options,
    onSave,
    onReorder,
  }: {
    options: Option[]
    onSave: (options: Option[]) => void
    onReorder: (startIndex: number, endIndex: number) => void
  }) => (
    <div>
      <h2>Task Classifications</h2>
      <button
        onClick={() =>
          onSave([
            ...options,
            {
              id: 'new',
              name: 'New Item',
              color: '#fff',
              order: 5,
              active: true,
              type: 'classification',
            },
          ])
        }
      >
        Add
      </button>
      <div data-testid='options-list'>
        {/* Use the 'Option' type for the mapped item */}
        {options.map((option: Option, index: number) => (
          <div key={option.id} data-testid={`option-${option.id}`}>
            <input
              type='text'
              value={option.name}
              onChange={(e) => {
                const newOptions = [...options]
                newOptions[index].name = e.target.value
                onSave(newOptions)
              }}
            />
            {/* Use the 'Option' type for the filtered item */}
            <button
              onClick={() =>
                onSave(options.filter((o: Option) => o.id !== option.id))
              }
            >
              Delete
            </button>
            <button onClick={() => onReorder(index, index - 1)}>Move Up</button>
          </div>
        ))}
      </div>
    </div>
  ),
}))

describe('ClassificationManagerPage', () => {
  it('should render the initial classifications correctly', () => {
    render(<ClassificationManagerPage />)

    // Check for the main heading
    expect(
      screen.getByRole('heading', { name: /Classification Manager/i })
    ).toBeInTheDocument()

    // Check that initial items are rendered by the mocked OptionsManager
    expect(screen.getByDisplayValue('BUG')).toBeInTheDocument()
    expect(screen.getByDisplayValue('FEATURE')).toBeInTheDocument()
    expect(screen.getByDisplayValue('IMPROVEMENT')).toBeInTheDocument()
  })

  it('should add a new classification when the add button is clicked', async () => {
    render(<ClassificationManagerPage />)
    const user = userEvent.setup()

    const addButton = screen.getByRole('button', { name: /Add/i })
    await user.click(addButton)

    // The mock directly adds 'New Item', so we check for its presence
    expect(await screen.findByDisplayValue('New Item')).toBeInTheDocument()
  })

  it('should edit an existing classification', async () => {
    render(<ClassificationManagerPage />)
    const user = userEvent.setup()

    const bugInput = screen.getByDisplayValue('BUG')

    // Simulate editing the input field
    await user.clear(bugInput)
    await user.type(bugInput, 'Critical Bug')

    // The mock calls onSave on change, so we check for the updated value
    expect(await screen.findByDisplayValue('Critical Bug')).toBeInTheDocument()
  })

  it('should delete a classification when the delete button is clicked', async () => {
    render(<ClassificationManagerPage />)
    const user = userEvent.setup()

    // Find the 'FEATURE' option and its delete button
    const featureOption = screen.getByTestId('option-2')
    const deleteButton = within(featureOption).getByRole('button', {
      name: /Delete/i,
    })

    await user.click(deleteButton)

    // Wait for the element to be removed from the DOM
    await waitForElementToBeRemoved(() => screen.queryByDisplayValue('FEATURE'))
    expect(screen.queryByDisplayValue('FEATURE')).not.toBeInTheDocument()
  })

  it('should reorder classifications when a reorder action is triggered', async () => {
    render(<ClassificationManagerPage />)
    const user = userEvent.setup()

    // Find the 'FEATURE' option and its move up button
    const featureOption = screen.getByTestId('option-2')
    const moveUpButton = within(featureOption).getByRole('button', {
      name: /Move Up/i,
    })

    // Before reordering, BUG is the first item
    const optionsList = screen.getByTestId('options-list')
    let options = within(optionsList).getAllByRole('textbox')
    expect(options[0]).toHaveValue('BUG')
    expect(options[1]).toHaveValue('FEATURE')

    // Trigger the reorder
    await user.click(moveUpButton)

    // After reordering, FEATURE should be the first item
    options = within(optionsList).getAllByRole('textbox')
    expect(options[0]).toHaveValue('FEATURE')
    expect(options[1]).toHaveValue('BUG')
  })
})
