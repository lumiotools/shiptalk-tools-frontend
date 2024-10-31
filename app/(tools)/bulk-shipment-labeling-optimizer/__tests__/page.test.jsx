import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import BulkShipmentLabelingOptimizerPage from '../page'

// Mock the child components
jest.mock('@/components/bulk-shipment-labeling-optimizer/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          packageSize: 'Medium',
          carrier: 'DHL',
          numberOfLabels: 100,
          shippingType: 'International'
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/bulk-shipment-labeling-optimizer/output', () => {
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

// Properly mock fetch
global.fetch = jest.fn()

describe('BulkShipmentLabelingOptimizerPage', () => {
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

    const { container } = render(<BulkShipmentLabelingOptimizerPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      packageSize: ['Small', 'Medium', 'Large'],
      shippingType: ['Domestic', 'International']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<BulkShipmentLabelingOptimizerPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=bulk-shipment-labeling-optimizer')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<BulkShipmentLabelingOptimizerPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = { packageSize: ['Medium'], shippingType: ['International'] }
    const mockResults = {
      carrierLabelRequirements: { mandatoryFields: ['Address'], labelSize: '4x6', placementNote: 'Top right corner' },
      packagingRecommendations: [{ material: 'Cardboard', adhesionLevel: 'High', recommendedLabelType: 'Adhesive' }],
      labelCostEstimate: { materialType: 'Paper', costPerLabel: 0.5, discountApplied: 10, totalCost: 45 },
      complianceWarnings: { shippingType: 'International', warnings: ['Check customs regulations'] },
      bulkLabelCostComparison: { chartType: 'barChart', data: [] },
      durabilityImpactAnalysis: { chartType: 'lineChart', data: [] },
      labelingEfficiencyTips: ['Use a label printer'],
      seasonalAdjustmentRecommendations: 'Increase stock for holiday season',
      operationalEfficiencyScore: 85
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

    render(<BulkShipmentLabelingOptimizerPage />)

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
    const mockOptions = { packageSize: ['Medium'], shippingType: ['International'] }
    const mockResults = {
      carrierLabelRequirements: { mandatoryFields: [] },
      operationalEfficiencyScore: 85
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

    render(<BulkShipmentLabelingOptimizerPage />)

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