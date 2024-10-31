import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import ParcelFlowPage from '../page'

// Mock the child components
jest.mock('@/components/parcel-flow-analysis/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          volume: "High",
          season: "Summer",
          type: "Electronics",
          weatherCondition: "Sunny",
          staffAvailability: "Full",
          priorityLevel: "High"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/parcel-flow-analysis/output', () => {
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

describe('ParcelFlowPage', () => {
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

    const { container } = render(<ParcelFlowPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      volume: ['Low', 'Medium', 'High'],
      priorityLevel: ['Low', 'Medium', 'High'],
      weatherConditions: ['Sunny', 'Rainy', 'Snowy']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<ParcelFlowPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=parcel-flow')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<ParcelFlowPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Failed to fetch options'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      volume: ['Low', 'Medium', 'High'],
      priorityLevel: ['Low', 'Medium', 'High'],
      weatherConditions: ['Sunny', 'Rainy', 'Snowy']
    }

    const mockResults = {
      processingStage: {
        data: [
          { label: 'Sorting', value: 30 },
          { label: 'Packaging', value: 20 },
          { label: 'Shipping', value: 50 }
        ],
        xLabel: 'Stage',
        yLabel: 'Time (minutes)'
      },
      bottleneckIndicators: [
        'High volume in sorting stage',
        'Staff shortage in packaging'
      ],
      delayPrediction: {
        delayAllowance: 2,
        onTimeDeliveryProbability: 85
      },
      riskLevelsByParcelType: {
        data: [
          { label: 'Electronics', value: 8 },
          { label: 'Clothing', value: 3 },
          { label: 'Books', value: 2 }
        ],
        xLabel: 'Parcel Type',
        yLabel: 'Risk Level'
      },
      timePeriod: {
        data: [
          { label: 'Morning', value: 100 },
          { label: 'Afternoon', value: 150 },
          { label: 'Evening', value: 80 }
        ],
        xLabel: 'Time of Day',
        yLabel: 'Parcel Volume'
      },
      bottleneckImpact: {
        data: [
          { label: 'Sorting', value: 40 },
          { label: 'Packaging', value: 30 },
          { label: 'Shipping', value: 10 }
        ],
        xLabel: 'Stage',
        yLabel: 'Impact Score'
      },
      recommendations: [
        'Increase staff in sorting stage',
        'Optimize packaging process'
      ],
      volumeImpactAnalysis: {
        data: [
          { label: 'Processing Time', value: 30 },
          { label: 'Error Rate', value: 15 },
          { label: 'Cost', value: 25 }
        ],
        xLabel: 'Factor',
        yLabel: 'Impact Percentage'
      },
      seasonalRiskTrends: {
        data: [
          { label: 'Summer', value: 7 },
          { label: 'Fall', value: 5 },
          { label: 'Winter', value: 8 },
          { label: 'Spring', value: 4 }
        ],
        xLabel: 'Season',
        yLabel: 'Risk Level'
      },
      staffUtilization: {
        data: [
          { label: 'Sorting', value: 90 },
          { label: 'Packaging', value: 75 },
          { label: 'Shipping', value: 85 }
        ],
        xLabel: 'Department',
        yLabel: 'Utilization Percentage'
      },
      costEfficiency: 'Overall cost efficiency improved by 15% due to optimized parcel flow'
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

    render(<ParcelFlowPage />)

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
      volume: ['Low', 'Medium', 'High'],
      priorityLevel: ['Low', 'Medium', 'High'],
      weatherConditions: ['Sunny', 'Rainy', 'Snowy']
    }

    const mockResults = {
      processingStage: { data: [], xLabel: '', yLabel: '' },
      bottleneckIndicators: [],
      delayPrediction: { delayAllowance: 0, onTimeDeliveryProbability: 0 },
      riskLevelsByParcelType: { data: [], xLabel: '', yLabel: '' },
      timePeriod: { data: [], xLabel: '', yLabel: '' },
      bottleneckImpact: { data: [], xLabel: '', yLabel: '' },
      recommendations: [],
      volumeImpactAnalysis: { data: [], xLabel: '', yLabel: '' },
      seasonalRiskTrends: { data: [], xLabel: '', yLabel: '' },
      staffUtilization: { data: [], xLabel: '', yLabel: '' },
      costEfficiency: ''
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

    render(<ParcelFlowPage />)

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