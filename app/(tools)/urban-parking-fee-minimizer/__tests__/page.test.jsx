import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import Component from '../page'

// Mock the child components
jest.mock('@/components/urban-parking-fee-minimizer/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          deliveryLocations: [
            { location: "123 Main St", deliveryTime: "09:00" },
            { location: "456 Elm St", deliveryTime: "14:00" }
          ],
          urgencyLevel: "High"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/urban-parking-fee-minimizer/output', () => {
  return function MockOutput(props) {
    return <div data-testid="mock-output">{JSON.stringify(props)}</div>
  }
})

// Mock the toast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('Urban Parking Fee Minimizer Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: {} })
      })
    )

    const { container } = render(<Component />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      urgencyLevel: ["Low", "Medium", "High"]
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<Component />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=urban-parking-fee-minimizer')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<Component />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Failed to fetch options'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      urgencyLevel: ["Low", "Medium", "High"]
    }

    const mockResults = {
      totalEstimatedParkingCost: 45.50,
      parkingCostAnalysis: [
        { location: "123 Main St", zoneType: "Commercial", estimatedParkingCost: 25.00 },
        { location: "456 Elm St", zoneType: "Residential", estimatedParkingCost: 20.50 }
      ],
      trafficAnalysis: [
        { location: "123 Main St", congestionLevel: "High", suggestedTime: "10:00 AM" },
        { location: "456 Elm St", congestionLevel: "Medium", suggestedTime: "2:30 PM" }
      ],
      loadingZoneInfo: "Loading zones available near 123 Main St from 8 AM to 11 AM",
      permitRecommendations: [
        { permitType: "Commercial Parking Permit", applicableZones: ["Commercial", "Industrial"], cost: "$100/month" }
      ],
      seasonalEventImpact: "Street fair on Elm St may affect parking availability on weekends",
      parkingFeeComparison: {
        data: [
          { label: "Street Parking", value: 45.50 },
          { label: "Parking Garage", value: 60.00 }
        ],
        xLabel: "Parking Type",
        yLabel: "Cost ($)"
      },
      congestionImpactAnalysis: {
        data: [
          { label: "Morning", value: 80 },
          { label: "Afternoon", value: 60 },
          { label: "Evening", value: 40 }
        ],
        xLabel: "Time of Day",
        yLabel: "Congestion Level"
      }
    }

    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: mockResults })
      }))

    render(<Component />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-input-form')).toBeInTheDocument()
    })

    const form = screen.getByTestId('mock-input-form')
    
    await act(async () => {
      fireEvent.submit(form)
    })

    await waitFor(() => {
      expect(screen.getByTestId('mock-output')).toBeInTheDocument()
    })

    expect(screen.getByTestId('mock-output')).toHaveTextContent(JSON.stringify(mockResults))
  })

  it('resets results when clicking back button', async () => {
    const mockOptions = {
      urgencyLevel: ["Low", "Medium", "High"]
    }

    const mockResults = {
      totalEstimatedParkingCost: 0,
      parkingCostAnalysis: [],
      trafficAnalysis: [],
      loadingZoneInfo: "",
      permitRecommendations: [],
      seasonalEventImpact: "",
      parkingFeeComparison: { data: [], xLabel: "", yLabel: "" },
      congestionImpactAnalysis: { data: [], xLabel: "", yLabel: "" }
    }

    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: mockResults })
      }))

    render(<Component />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-input-form')).toBeInTheDocument()
    })

    const form = screen.getByTestId('mock-input-form')
    
    await act(async () => {
      fireEvent.submit(form)
    })

    await waitFor(() => {
      expect(screen.getByTestId('mock-output')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Back'))
    })

    expect(screen.queryByTestId('mock-output')).not.toBeInTheDocument()
    expect(screen.getByTestId('mock-input-form')).toBeInTheDocument()
  })
})