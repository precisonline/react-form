import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import MultiWindowInterface from '../page'

describe('MultiWindowInterface Integration Tests', () => {
  it('should open all window types and render their content', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')

    // Open Analytics
    fireEvent.click(openButtons[0])
    const analyticsWindows = screen.getAllByText('Analytics Dashboard')
    const analyticsWindow = analyticsWindows[
      analyticsWindows.length - 1
    ].closest('div[class*="MuiPaper-root"]') as HTMLElement
    expect(analyticsWindow).toBeInTheDocument()
    expect(within(analyticsWindow).getByText('Revenue')).toBeInTheDocument()

    // Open Settings
    fireEvent.click(openButtons[1])
    const settingsWindows = screen.getAllByText('Settings Panel')
    const settingsWindow = settingsWindows[settingsWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement
    expect(settingsWindow).toBeInTheDocument()
    expect(
      within(settingsWindow).getByText('Notifications')
    ).toBeInTheDocument()

    // Open Calendar
    fireEvent.click(openButtons[2])
    const calendarWindows = screen.getAllByText('Calendar View')
    const calendarWindow = calendarWindows[calendarWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement
    expect(calendarWindow).toBeInTheDocument()
    expect(within(calendarWindow).getByText('Team Meeting')).toBeInTheDocument()
  })

  it('should bring a window to the front when its header is clicked', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')

    // Open Analytics and then Settings
    fireEvent.click(openButtons[0]) // Analytics
    fireEvent.click(openButtons[1]) // Settings

    const analyticsWindows = screen.getAllByText('Analytics Dashboard')
    const analyticsWindow = analyticsWindows[
      analyticsWindows.length - 1
    ].closest('div[class*="MuiPaper-root"]') as HTMLElement
    const settingsWindows = screen.getAllByText('Settings Panel')
    const settingsWindow = settingsWindows[settingsWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement

    // Settings window should be on top initially
    const settingsZIndex = parseInt(
      window.getComputedStyle(settingsWindow).zIndex
    )
    const analyticsZIndex = parseInt(
      window.getComputedStyle(analyticsWindow).zIndex
    )
    expect(settingsZIndex).toBeGreaterThan(analyticsZIndex)

    // Click on the analytics window header to bring it to the front
    const analyticsHeader = within(analyticsWindow).getByText(
      'Analytics Dashboard'
    )
    fireEvent.mouseDown(analyticsHeader)

    const newSettingsZIndex = parseInt(
      window.getComputedStyle(settingsWindow).zIndex
    )
    const newAnalyticsZIndex = parseInt(
      window.getComputedStyle(analyticsWindow).zIndex
    )

    expect(newAnalyticsZIndex).toBeGreaterThan(newSettingsZIndex)
  })

  it('should bring an existing window to the front if its open button is clicked again', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')

    fireEvent.click(openButtons[0]) // Analytics
    fireEvent.click(openButtons[1]) // Settings

    const analyticsWindows = screen.getAllByText('Analytics Dashboard')
    const analyticsWindow = analyticsWindows[
      analyticsWindows.length - 1
    ].closest('div[class*="MuiPaper-root"]') as HTMLElement
    const settingsWindows = screen.getAllByText('Settings Panel')
    const settingsWindow = settingsWindows[settingsWindows.length - 1].closest(
      'div[class*="MuiPaper-root"]'
    ) as HTMLElement

    const initialAnalyticsZIndex = parseInt(
      window.getComputedStyle(analyticsWindow).zIndex
    )
    const initialSettingsZIndex = parseInt(
      window.getComputedStyle(settingsWindow).zIndex
    )
    expect(initialSettingsZIndex).toBeGreaterThan(initialAnalyticsZIndex)

    // Click the "Open Window" button for Analytics again
    fireEvent.click(openButtons[0])

    const finalAnalyticsZIndex = parseInt(
      window.getComputedStyle(analyticsWindow).zIndex
    )
    const finalSettingsZIndex = parseInt(
      window.getComputedStyle(settingsWindow).zIndex
    )
    expect(finalAnalyticsZIndex).toBeGreaterThan(finalSettingsZIndex)
  })
})
