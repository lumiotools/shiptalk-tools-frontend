import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import LastMileDeliverySolutionsToolPage from '../page'

// Mock the child components
jest.mock('@/components/last-mile-delivery-solutions/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          daily_orders: 100,
          delivery_locations: ["New York", "Los Angeles"],
          delivery_method: "Ground",
          user_objectives: ["Cost Reduction", "Faster Delivery"],
          type_of_products: ["Electronics", "Clothing"]
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/last-mile-delivery-solutions/output', () => {
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

describe('LastMileDeliverySolutionsToolPage', () => {
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

    const { container } = render(<LastMileDeliverySolutionsToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      delivery_method: ['Ground', 'Air', 'Sea'],
      user_objectives: ['Cost Reduction', 'Faster Delivery', 'Improved Tracking'],
      type_of_products: ['Electronics', 'Clothing', 'Food']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<LastMileDeliverySolutionsToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=last-mile-delivery-solutions')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<LastMileDeliverySolutionsToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      delivery_method: ['Ground', 'Air', 'Sea'],
      user_objectives: ['Cost Reduction', 'Faster Delivery', 'Improved Tracking'],
      type_of_products: ['Electronics', 'Clothing', 'Food']
    }

    const mockResults = {
      suggested_carriers: ['FedEx', 'UPS', 'DHL'],
      estimated_cost_savings_percentage: 15,
      expected_delivery_time_reduction_percentage: 20,
      key_performance_indicators: [
        { kpi_name: 'On-Time Delivery', current_value: '85%', expected_improvement_percentage: 10 },
        { kpi_name: 'Cost per Delivery', current_value: '$10', expected_improvement_percentage: 15 }
      ],
      implementation_plan: '1. Analyze current routes\n2. Optimize carrier selection\n3. Implement route optimization software',
      risk_analysis: 'Low risk of service disruption. Medium risk of initial cost increase.',
      overall_suggestion: 'Implement the proposed changes gradually, starting with the busiest routes.',
      charts: [
        { data: [], xLabel: 'Date', yLabel: 'Deliveries' },
        { data: [], xLabel: 'Carrier', yLabel: 'Cost' }
      ],
      success_stories: 'Company X reduced delivery times by 25% using our suggested approach.'
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

    render(<LastMileDeliverySolutionsToolPage />)

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
      delivery_method: ['Ground', 'Air', 'Sea'],
      user_objectives: ['Cost Reduction', 'Faster Delivery', 'Improved Tracking'],
      type_of_products: ['Electronics', 'Clothing', 'Food']
    }

    const mockResults = {
      suggested_carriers: ['FedEx'],
      estimated_cost_savings_percentage: 10,
      expected_delivery_time_reduction_percentage: 15,
      key_performance_indicators: [],
      implementation_plan: '',
      risk_analysis: '',
      overall_suggestion: '',
      charts: [],
      success_stories: ''
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

    render(<LastMileDeliverySolutionsToolPage />)

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