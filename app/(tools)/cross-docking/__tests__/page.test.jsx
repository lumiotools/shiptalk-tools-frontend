import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import CrossDockingToolPage from '../page'

// Mock the child components
jest.mock('@/components/cross-docking/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          incomingTrucks: [
            { arrivalTime: "2023-05-01T10:00", loadType: "Pallets", quantity: 100 },
            { arrivalTime: "2023-05-01T11:00", loadType: "Boxes", quantity: 200 }
          ],
          outboundTrucks: [
            { departureTime: "2023-05-01T14:00", capacity: 150 }
          ],
          docksAvailable: 5,
          laborAvailable: 20,
          priorityLevel: "High",
          trafficConditions: "Normal",
          weatherConditions: "Clear"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/cross-docking/output', () => {
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

describe('CrossDockingToolPage', () => {
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

    const { container } = render(<CrossDockingToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      loadType: ['Pallets', 'Boxes'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy'],
      priorityLevel: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Normal', 'Heavy']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<CrossDockingToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=cross-docking')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<CrossDockingToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      loadType: ['Pallets', 'Boxes'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy'],
      priorityLevel: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Normal', 'Heavy']
    }

    const mockResults = {
      carrierOptimization: { chartType: 'barChart', data: [] },
      dockScheduling: "Optimal dock scheduling plan...",
      laborAllocation: { chartType: 'pieChart', data: [] },
      riskAssessment: { riskLevel: "Medium", riskProgress: 50, explanation: "Moderate risk due to..." },
      deliveryTimelineComparison: { actualData: [], comparedData: [] },
      deliveryStatus: { status: "On Time", explanation: "All deliveries are on schedule..." },
      costEfficiency: { laborEfficiency: "85%", dockUtilization: "90%", truckCapacityUtilization: "95%" }
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

    render(<CrossDockingToolPage />)

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
      loadType: ['Pallets', 'Boxes'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy'],
      priorityLevel: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Normal', 'Heavy']
    }

    const mockResults = {
      carrierOptimization: { chartType: 'barChart', data: [] },
      dockScheduling: "Optimal dock scheduling plan...",
      laborAllocation: { chartType: 'pieChart', data: [] },
      riskAssessment: { riskLevel: "Medium", riskProgress: 50, explanation: "Moderate risk due to..." },
      deliveryTimelineComparison: { actualData: [], comparedData: [] },
      deliveryStatus: { status: "On Time", explanation: "All deliveries are on schedule..." },
      costEfficiency: { laborEfficiency: "85%", dockUtilization: "90%", truckCapacityUtilization: "95%" }
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

    render(<CrossDockingToolPage />)

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