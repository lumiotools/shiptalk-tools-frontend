import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import ColdChainDeliveryCostEstimatorPage from '../page'

// Mock the child components
jest.mock('@/components/cold-chain-delivery-cost-estimator/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          productType: "Pharmaceuticals",
          weatherCondition: "Sunny",
          routeDistance: 100,
          carrier: "DHL",
          temperatureRequirement: -20
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/cold-chain-delivery-cost-estimator/output', () => {
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

describe('ColdChainDeliveryCostEstimatorPage', () => {
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

    const { container } = render(<ColdChainDeliveryCostEstimatorPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      weatherCondition: ['Sunny', 'Rainy', 'Snowy']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<ColdChainDeliveryCostEstimatorPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=cold-chain-delivery-cost-estimator')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<ColdChainDeliveryCostEstimatorPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = { weatherCondition: ['Sunny', 'Rainy', 'Snowy'] }
    const mockResults = {
      packagingRecommendations: [
        {
          name: "Premium Insulated Box",
          cost: 150,
          specifications: [
            { name: "Material", value: "High-density foam" }
          ]
        }
      ],
      carrierCostEstimate: {
        name: "DHL Cold Chain",
        rating: "4.8/5",
        costPremium: "15%",
        capabilities: ["Temperature monitoring", "Real-time tracking"]
      },
      totalDeliveryCost: 2500,
      weatherImpactAssessment: "Low impact expected",
      costBreakdownChart: { chartType: "pieChart", data: [] },
      environmentalRiskLevel: "Low",
      handlingRecommendations: ["Handle with care", "Keep upright"],
      estimatedDeliveryTime: "2-3 business days",
      temperatureDeviationRisk: "Minimal",
      packagingCostEfficiencyChart: { chartType: "barChart", data: [] },
      seasonalAdjustmentRecommendations: "No adjustments needed"
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

    render(<ColdChainDeliveryCostEstimatorPage />)

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
  })

  it('resets results when clicking back button', async () => {
    const mockOptions = { weatherCondition: ['Sunny'] }
    const mockResults = {
      packagingRecommendations: [],
      carrierCostEstimate: { name: "DHL", rating: "4.8/5", costPremium: "15%", capabilities: [] },
      totalDeliveryCost: 1000,
      weatherImpactAssessment: "Low",
      costBreakdownChart: { chartType: "pieChart", data: [] },
      environmentalRiskLevel: "Low",
      handlingRecommendations: [],
      estimatedDeliveryTime: "2-3 days",
      temperatureDeviationRisk: "Low",
      packagingCostEfficiencyChart: { chartType: "barChart", data: [] },
      seasonalAdjustmentRecommendations: "None"
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

    render(<ColdChainDeliveryCostEstimatorPage />)

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