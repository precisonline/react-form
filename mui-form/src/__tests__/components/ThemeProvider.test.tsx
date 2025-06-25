import { render, screen } from '@testing-library/react'
import CustomThemeProvider from '../../components/ThemeProvider'
import { useTheme } from '@mui/material/styles'
import theme from '../../theme/theme'

// A test component that consumes the theme
const TestComponent = () => {
  const currentTheme = useTheme()
  return (
    <div>
      <span data-testid='theme-primary-color'>
        {currentTheme.palette.primary.main}
      </span>
    </div>
  )
}

describe('CustomThemeProvider', () => {
  it('provides the custom theme to its children', () => {
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    )

    // Check if the primary color from our custom theme is applied
    const themeColorElement = screen.getByTestId('theme-primary-color')
    expect(themeColorElement).toHaveTextContent(theme.palette.primary.main)
  })

  it('renders children correctly', () => {
    render(
      <CustomThemeProvider>
        <div data-testid='child-element'>Hello, World!</div>
      </CustomThemeProvider>
    )

    // Check if the child component is rendered
    const childElement = screen.getByTestId('child-element')
    expect(childElement).toBeInTheDocument()
    expect(childElement).toHaveTextContent('Hello, World!')
  })
})
