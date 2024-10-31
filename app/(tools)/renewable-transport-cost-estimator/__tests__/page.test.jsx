import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import RenewableTransportCostEstimatorPage from '../page'

// Mock the child components
jest.mock('@/components/renewable-transport-cost-estimator/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          routeDistance: 100,
          vehicleType: "Electric Truck"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/renewable-transport-cost-estimator/output', () => {
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

describe('RenewableTransportCostEstimatorPage', () => {
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

    const { container } = render(<RenewableTransportCostEstimatorPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      vehicleType: ['Electric Truck', 'Hydrogen Fuel Cell Truck', 'Biodiesel Truck']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<RenewableTransportCostEstimatorPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=renewable-transport-cost-estimator')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<RenewableTransportCostEstimatorPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      vehicleType: ['Electric Truck', 'Hydrogen Fuel Cell Truck', 'Biodiesel Truck']
    }

    const mockResults = {
      estimatedTotalCost: 1500,
      vehicleCostEstimates: [
        {
          vehicleName: "Electric Truck",
          energySource: "Electricity",
          costEstimate: 1500,
          efficiency: "High",
          environmentalImpact: "Low"
        },
        {
          vehicleName: "Hydrogen Fuel Cell Truck",
          energySource: "Hydrogen",
          costEstimate: 1800,
          efficiency: "Medium",
          environmentalImpact: "Very Low"
        }
      ],
      emissionReductions: {
        "CO2": "500 kg",
        "NOx": "2 kg"
      },
      recommendedVehicle: "Electric Truck",
      vehicleComparisonAnalysis: {
        data: [
          { label: "Electric Truck", value: 85 },
          { label: "Hydrogen Fuel Cell Truck", value: 75 }
        ],
        xLabel: "Vehicle Type",
        yLabel: "Overall Score"
      },
      environmentalIncentives: [
        "Tax credit for using renewable energy vehicles",
        "Carbon offset program participation"
      ]
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

    render(<RenewableTransportCostEstimatorPage />)

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
      vehicleType: ['Electric Truck', 'Hydrogen Fuel Cell Truck', 'Biodiesel Truck']
    }

    const mockResults = {
      estimatedTotalCost: 0,
      vehicleCostEstimates: [],
      emissionReductions: {},
      recommendedVehicle: "",
      vehicleComparisonAnalysis: { data: [], xLabel: "", yLabel: "" },
      environmentalIncentives: []
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

    render(<RenewableTransportCostEstimatorPage />)

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