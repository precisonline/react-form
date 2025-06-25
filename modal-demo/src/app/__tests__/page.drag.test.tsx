import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import MultiWindowInterface from '../page'

describe('MultiWindowInterface Drag Tests', () => {
  it('should drag the window', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')
    fireEvent.click(openButtons[0])

    const analyticsWindows = screen.getAllByText('Analytics Dashboard')
    const windowEl = analyticsWindows[analyticsWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement

    const initialX = parseInt(window.getComputedStyle(windowEl).left)
    const initialY = parseInt(window.getComputedStyle(windowEl).top)

    const header = within(windowEl).getByText('Analytics Dashboard')
    fireEvent.mouseDown(header, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    fireEvent.mouseUp(document)

    const finalX = parseInt(window.getComputedStyle(windowEl).left)
    const finalY = parseInt(window.getComputedStyle(windowEl).top)

    expect(finalX).toBeGreaterThan(initialX)
    expect(finalY).toBeGreaterThan(initialY)
  })
})
