import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import Page from '../page'

// Mock the child components
jest.mock('@/components/delivery-frequency-cost-impact-analyzer/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          deliveryFrequency: 5,
          averageParcelCost: 10.5,
          routeDistance: 100.5,
          urgencyLevel: "Medium"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/delivery-frequency-cost-impact-analyzer/output', () => {
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

describe('DeliveryFrequencyCostImpactAnalyzerPage', () => {
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

    const { container } = render(<Page />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<Page />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=delivery-frequency-cost-impact-analyzer')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<Page />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      frequencyCostBreakdown: [
        { frequency: 1, totalCost: 1000, costDifference: 0, savingsPotential: 0, averageCostPerParcel: 10, totalDistanceCovered: 100 },
        { frequency: 2, totalCost: 1800, costDifference: 800, savingsPotential: 200, averageCostPerParcel: 9, totalDistanceCovered: 200 }
      ],
      optimalFrequency: 3,
      totalCostEstimation: 2500,
      savingsEstimation: 500,
      frequencyCostAnalysis: { chartType: 'lineChart', data: [] },
      savingsPotentialAnalysis: { chartType: 'barChart', data: [] },
      averageCostPerParcelTrend: { chartType: 'lineChart', data: [] },
      distanceCoverageAnalysis: { chartType: 'areaChart', data: [] },
      recommendations: ['Increase delivery frequency', 'Optimize route planning'],
      keyInsights: ['Cost per parcel decreases with frequency', 'Optimal balance found at 3 deliveries per week'],
      financialSummary: { weeklySavings: 500, monthlySavings: 2000, annualSavings: 24000 },
      urgencyImpactAssessment: [
        { urgencyLevel: 'Low', suggestedFrequency: 2, description: 'Twice a week is sufficient' },
        { urgencyLevel: 'Medium', suggestedFrequency: 3, description: 'Three times a week balances cost and urgency' },
        { urgencyLevel: 'High', suggestedFrequency: 5, description: 'Daily deliveries may be necessary' }
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

    render(<Page />)

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
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      frequencyCostBreakdown: [
        { frequency: 1, totalCost: 1000, costDifference: 0, savingsPotential: 0, averageCostPerParcel: 10, totalDistanceCovered: 100 },
        { frequency: 2, totalCost: 1800, costDifference: 800, savingsPotential: 200, averageCostPerParcel: 9, totalDistanceCovered: 200 }
      ],
      optimalFrequency: 3,
      totalCostEstimation: 2500,
      savingsEstimation: 500,
      frequencyCostAnalysis: { chartType: 'lineChart', data: [] },
      savingsPotentialAnalysis: { chartType: 'barChart', data: [] },
      averageCostPerParcelTrend: { chartType: 'lineChart', data: [] },
      distanceCoverageAnalysis: { chartType: 'areaChart', data: [] },
      recommendations: ['Increase delivery frequency', 'Optimize route planning'],
      keyInsights: ['Cost per parcel decreases with frequency', 'Optimal balance found at 3 deliveries per week'],
      financialSummary: { weeklySavings: 500, monthlySavings: 2000, annualSavings: 24000 },
      urgencyImpactAssessment: [
        { urgencyLevel: 'Low', suggestedFrequency: 2, description: 'Twice a week is sufficient' },
        { urgencyLevel: 'Medium', suggestedFrequency: 3, description: 'Three times a week balances cost and urgency' },
        { urgencyLevel: 'High', suggestedFrequency: 5, description: 'Daily deliveries may be necessary' }
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

    render(<Page />)

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