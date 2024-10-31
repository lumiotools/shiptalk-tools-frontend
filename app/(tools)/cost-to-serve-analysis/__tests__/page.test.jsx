import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import CostToServeAnalysisToolPage from '../page'

// Mock the child components
jest.mock('@/components/cost-to-serve-analysis/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          business_model: "B2B",
          customer_segments: ["Enterprise", "SMB"],
          total_supply_chain_cost: 1000000,
          average_order_value: 5000,
          user_goals: ["Reduce Costs", "Improve Efficiency"],
          challenges: ["Complex Supply Chain", "High Logistics Costs"],
          industry_type: "Manufacturing",
          geographical_scope: "Global"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/cost-to-serve-analysis/output', () => {
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

describe('CostToServeAnalysisToolPage', () => {
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

    const { container } = render(<CostToServeAnalysisToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      business_model: ['B2B', 'B2C'],
      customer_segments: ['Enterprise', 'SMB', 'Consumer'],
      user_goals: ['Reduce Costs', 'Improve Efficiency'],
      challenges: ['Complex Supply Chain', 'High Logistics Costs'],
      industry_type: ['Manufacturing', 'Retail'],
      geographical_scope: ['Global', 'Regional', 'Local']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<CostToServeAnalysisToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=cost-to-serve-analysis')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<CostToServeAnalysisToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      business_model: ['B2B', 'B2C'],
      customer_segments: ['Enterprise', 'SMB', 'Consumer'],
      user_goals: ['Reduce Costs', 'Improve Efficiency'],
      challenges: ['Complex Supply Chain', 'High Logistics Costs'],
      industry_type: ['Manufacturing', 'Retail'],
      geographical_scope: ['Global', 'Regional', 'Local']
    }

    const mockResults = {
      total_cost_to_serve: 1500000,
      optimization_recommendations: "Optimize warehouse locations",
      strategic_insights: "Focus on high-value customers",
      implementation_steps: "1. Analyze current costs\n2. Identify inefficiencies",
      risk_evaluation: "Medium risk due to potential customer disruption",
      final_recommendation: "Proceed with cost optimization plan",
      success_probability: 75,
      potential_savings: 300000,
      customer_impact: "Minimal impact expected on key customers",
      charts: [
        { chartType: "barChart", data: [] },
        { chartType: "pieChart", data: [] }
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

    render(<CostToServeAnalysisToolPage />)

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
      business_model: ['B2B', 'B2C'],
      customer_segments: ['Enterprise', 'SMB', 'Consumer'],
      user_goals: ['Reduce Costs', 'Improve Efficiency'],
      challenges: ['Complex Supply Chain', 'High Logistics Costs'],
      industry_type: ['Manufacturing', 'Retail'],
      geographical_scope: ['Global', 'Regional', 'Local']
    }

    const mockResults = {
      total_cost_to_serve: 1500000,
      optimization_recommendations: "Optimize warehouse locations",
      strategic_insights: "Focus on high-value customers",
      implementation_steps: "1. Analyze current costs\n2. Identify inefficiencies",
      risk_evaluation: "Medium risk due to potential customer disruption",
      final_recommendation: "Proceed with cost optimization plan",
      success_probability: 75,
      potential_savings: 300000,
      customer_impact: "Minimal impact expected on key customers",
      charts: [
        { chartType: "barChart", data: [] },
        { chartType: "pieChart", data: [] }
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

    render(<CostToServeAnalysisToolPage />)

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