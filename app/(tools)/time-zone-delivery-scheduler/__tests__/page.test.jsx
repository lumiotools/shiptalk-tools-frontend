import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import Component from '../page'

// Mock the child components
jest.mock('@/components/time-zone-delivery-scheduler/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          originZone: "Eastern Time (ET)",
          destinationZone: "Pacific Time (PT)",
          priorityLevel: "Standard",
          productType: "Electronics",
          estimatedDeliveryDate: "2024-11-15"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/time-zone-delivery-scheduler/output', () => {
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

describe('Time Zone Delivery Scheduler Page', () => {
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
      originZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      destinationZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      priorityLevel: ["Standard", "Express", "Overnight"]
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
        expect.stringContaining('/api/v1/tools-options?tool_name=time-zone-delivery-scheduler')
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
      originZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      destinationZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      priorityLevel: ["Standard", "Express", "Overnight"]
    }

    const mockResults = {
      optimalDeliveryWindows: [
        { timeWindow: "10:00 AM - 2:00 PM", peakTime: false, businessHours: "9:00 AM - 5:00 PM" },
        { timeWindow: "2:00 PM - 6:00 PM", peakTime: true, businessHours: "9:00 AM - 5:00 PM" }
      ],
      carrierOptions: [
        { name: "FastShip", deliveryTimeEstimate: "2-3 business days" },
        { name: "QuickDeliver", deliveryTimeEstimate: "1-2 business days" }
      ],
      transitImpactSummary: "Moderate impact due to time zone difference and peak hours.",
      peakTimeAnalysis: {
        data: [
          { label: "Morning", value: 30 },
          { label: "Afternoon", value: 50 },
          { label: "Evening", value: 20 }
        ],
        xLabel: "Time of Day",
        yLabel: "Delivery Volume"
      },
      carrierEfficiencyComparison: {
        data: [
          { label: "FastShip", value: 85 },
          { label: "QuickDeliver", value: 90 }
        ],
        xLabel: "Carrier",
        yLabel: "Efficiency Score"
      },
      seasonalImpactPrediction: "Expect slight delays due to upcoming holiday season.",
      peakSeasonDelayEstimate: "1-2 additional business days",
      timeZoneSpecificRegulations: [
        "No deliveries after 9 PM in residential areas",
        "Special handling required for hazardous materials"
      ],
      recommendedDeliveryDateAdjustment: "Consider scheduling delivery 1 day earlier than estimated.",
      trafficImpactAnalysis: "High traffic congestion expected in destination city during delivery window.",
      holidaySeasonAlerts: [
        "Increased volume expected due to Black Friday sales",
        "Possible weather-related delays in northern regions"
      ],
      deliverySuccessProbability: 85
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
      originZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      destinationZone: ["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"],
      priorityLevel: ["Standard", "Express", "Overnight"]
    }

    const mockResults = {
      optimalDeliveryWindows: [],
      carrierOptions: [],
      transitImpactSummary: "",
      peakTimeAnalysis: { data: [], xLabel: "", yLabel: "" },
      carrierEfficiencyComparison: { data: [], xLabel: "", yLabel: "" },
      seasonalImpactPrediction: "",
      peakSeasonDelayEstimate: "",
      timeZoneSpecificRegulations: [],
      recommendedDeliveryDateAdjustment: "",
      trafficImpactAnalysis: "",
      holidaySeasonAlerts: [],
      deliverySuccessProbability: 0
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