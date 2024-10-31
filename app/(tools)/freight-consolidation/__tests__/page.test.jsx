import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import FreightConsolidationToolPage from '../page'

// Mock the child components
jest.mock('@/components/freight-consolidation/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          orders: [
            { orderWeight: 100, destinationAddress: "123 Main St", originAddress: "456 Elm St", serviceType: "Standard" },
            { orderWeight: 150, destinationAddress: "789 Oak St", originAddress: "321 Pine St", serviceType: "Express" }
          ],
          carrierOptions: [
            { carrierName: "Carrier A", carrierCapacity: 500 },
            { carrierName: "Carrier B", carrierCapacity: 750 }
          ],
          shippingCostPerUnit: 10,
          bulkDiscountRate: 5,
          priorityLevel: "Medium"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/freight-consolidation/output', () => {
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

describe('FreightConsolidationToolPage', () => {
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

    const { container } = render(<FreightConsolidationToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      serviceType: ['Standard', 'Express', 'Overnight'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<FreightConsolidationToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=freight-consolidation')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<FreightConsolidationToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      serviceType: ['Standard', 'Express', 'Overnight'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      consolidationRate: 75,
      consolidationDetails: { data: [], xLabel: 'Category', yLabel: 'Value' },
      totalShippingCostBefore: 2500,
      totalShippingCostAfter: 2000,
      costSavings: 500,
      discountApplied: 5,
      carrierUsage: { actualData: [], comparedData: [], xLabel: 'Carrier', yLabel: 'Usage' },
      carrierLoadDistribution: { data: [], xLabel: 'Carrier', yLabel: 'Load' },
      costComparison: { data: [], xLabel: 'Category', yLabel: 'Cost' },
      deliveryDelayRisk: 'Low risk of delivery delays',
      priorityRecommendations: 'Maintain current priority levels',
      priorityImpact: 'Minimal impact on delivery times',
      shipmentRecommendations: 'Consolidate shipments A and B for optimal efficiency',
      costEfficiencyExplanation: 'Consolidation resulted in 20% cost reduction',
      carrierRecommendations: 'Utilize Carrier A for bulk shipments'
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

    render(<FreightConsolidationToolPage />)

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
      serviceType: ['Standard', 'Express', 'Overnight'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      consolidationRate: 75,
      consolidationDetails: { data: [], xLabel: 'Category', yLabel: 'Value' },
      totalShippingCostBefore: 2500,
      totalShippingCostAfter: 2000,
      costSavings: 500,
      discountApplied: 5,
      carrierUsage: { actualData: [], comparedData: [], xLabel: 'Carrier', yLabel: 'Usage' },
      carrierLoadDistribution: { data: [], xLabel: 'Carrier', yLabel: 'Load' },
      costComparison: { data: [], xLabel: 'Category', yLabel: 'Cost' },
      deliveryDelayRisk: 'Low risk of delivery delays',
      priorityRecommendations: 'Maintain current priority levels',
      priorityImpact: 'Minimal impact on delivery times',
      shipmentRecommendations: 'Consolidate shipments A and B for optimal efficiency',
      costEfficiencyExplanation: 'Consolidation resulted in 20% cost reduction',
      carrierRecommendations: 'Utilize Carrier A for bulk shipments'
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

    render(<FreightConsolidationToolPage />)

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