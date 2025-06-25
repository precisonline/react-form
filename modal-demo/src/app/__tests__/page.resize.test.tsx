import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MultiWindowInterface from '../page'

describe('MultiWindowInterface Resize Tests', () => {
  it('should resize the window from the bottom-right corner', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')
    fireEvent.click(openButtons[0])

    const analyticsWindows = screen.getAllByText('Analytics Dashboard')
    const windowEl = analyticsWindows[analyticsWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement

    const initialWidth = parseInt(window.getComputedStyle(windowEl).width)
    const initialHeight = parseInt(window.getComputedStyle(windowEl).height)

    const resizeHandle = screen.getByTestId('resize-handle-se')
    fireEvent.mouseDown(resizeHandle, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    fireEvent.mouseUp(document)

    const finalWidth = parseInt(window.getComputedStyle(windowEl).width)
    const finalHeight = parseInt(window.getComputedStyle(windowEl).height)

    expect(finalWidth).toBeGreaterThan(initialWidth)
    expect(finalHeight).toBeGreaterThan(initialHeight)
  })
})
