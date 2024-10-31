import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import DynamicRoutingToolPage from '../page'

// Mock the child components
jest.mock('@/components/dynamic-routing/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          destinationAddress: "123 Main St, City, Country",
          currentLocation: "456 Elm St, City, Country",
          expectedDeliveryTime: "2023-06-01T14:00:00",
          priorityLevel: "High",
          trafficConditions: "Heavy",
          weatherConditions: "Rainy"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/dynamic-routing/output', () => {
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

describe('DynamicRoutingToolPage', () => {
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

    const { container } = render(<DynamicRoutingToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      priorityLevels: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Moderate', 'Heavy'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<DynamicRoutingToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=dynamic-routing')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<DynamicRoutingToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      priorityLevels: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Moderate', 'Heavy'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy']
    }

    const mockResults = {
      deliveryTimeComparison: {
        data: [
          { label: 'Original Route', value: 60 },
          { label: 'Optimized Route', value: 45 }
        ],
        yLabel: 'Time (minutes)',
        explanation: 'The optimized route saves 15 minutes.'
      },
      conditionImpactChart: {
        data: [
          { label: 'Traffic', value: 20 },
          { label: 'Weather', value: 10 }
        ],
        xLabel: 'Condition',
        yLabel: 'Impact (minutes)',
        explanation: 'Traffic has a higher impact than weather.'
      },
      priorityBasedRecommendation: {
        data: [
          { label: 'Route A', value: 60 },
          { label: 'Route B', value: 40 }
        ],
        xLabel: 'Route',
        explanation: 'Route A is recommended for high priority deliveries.'
      },
      riskLevel: 'Medium',
      riskProgress: 50,
      riskExplanation: 'Medium risk due to heavy traffic and rainy conditions.',
      delayImpactAnalysis: [
        { label: 'Customer Satisfaction', value: 80 },
        { label: 'Operational Costs', value: 60 }
      ],
      deliveryStatus: 'On Time',
      deliveryStatusExplanation: 'The delivery is currently on schedule.',
      trafficSensitivity: {
        level: 'High',
        explanation: 'The route is highly sensitive to traffic conditions.'
      },
      weatherImpactAssessment: 'Rainy conditions may slow down the delivery by 10-15 minutes.',
      priorityAdjustmentSuggestions: 'Consider upgrading to express delivery for high-priority items.'
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

    render(<DynamicRoutingToolPage />)

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
      priorityLevels: ['Low', 'Medium', 'High'],
      trafficConditions: ['Light', 'Moderate', 'Heavy'],
      weatherConditions: ['Clear', 'Rainy', 'Snowy']
    }

    const mockResults = {
      deliveryTimeComparison: { data: [], yLabel: '', explanation: '' },
      conditionImpactChart: { data: [], xLabel: '', yLabel: '', explanation: '' },
      priorityBasedRecommendation: { data: [], xLabel: '', explanation: '' },
      riskLevel: '',
      riskProgress: 0,
      riskExplanation: '',
      delayImpactAnalysis: [],
      deliveryStatus: '',
      deliveryStatusExplanation: '',
      trafficSensitivity: { level: '', explanation: '' },
      weatherImpactAssessment: '',
      priorityAdjustmentSuggestions: ''
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

    render(<DynamicRoutingToolPage />)

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