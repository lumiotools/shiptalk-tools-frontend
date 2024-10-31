import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import SalesAndOperationsPlanningToolPage from '../page'

// Mock the child components
jest.mock('@/components/sales-and-operations-planning/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          company_size: "Medium",
          industry_sector: "Manufacturing",
          current_sales_data: [
            { month: "January", sales: 1000 },
            { month: "February", sales: 1200 }
          ],
          inventory_levels: [
            { name: "Product A", quantity: 500 },
            { name: "Product B", quantity: 300 }
          ],
          operational_constraints: ["Limited production capacity", "Supply chain disruptions"],
          user_objectives: ["Improve inventory turnover", "Reduce stockouts"],
          current_challenges: ["Demand volatility", "Long lead times"],
          seasonal_factors: [{ factor: "Holiday season" }],
          budget_constraints: 100000
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/sales-and-operations-planning/output', () => {
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

describe('SalesAndOperationsPlanningToolPage', () => {
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

    const { container } = render(<SalesAndOperationsPlanningToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      company_size: ['Small', 'Medium', 'Large'],
      industry_sector: ['Manufacturing', 'Retail', 'Technology'],
      operational_constraints: ['Limited production capacity', 'Supply chain disruptions'],
      user_objectives: ['Improve inventory turnover', 'Reduce stockouts'],
      current_challenges: ['Demand volatility', 'Long lead times']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<SalesAndOperationsPlanningToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=sales-and-operations-planning')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<SalesAndOperationsPlanningToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      company_size: ['Small', 'Medium', 'Large'],
      industry_sector: ['Manufacturing', 'Retail', 'Technology'],
      operational_constraints: ['Limited production capacity', 'Supply chain disruptions'],
      user_objectives: ['Improve inventory turnover', 'Reduce stockouts'],
      current_challenges: ['Demand volatility', 'Long lead times']
    }

    const mockResults = {
      recommended_inventory_levels: [
        { name: "Product A", quantity: 600 },
        { name: "Product B", quantity: 400 }
      ],
      estimated_cost_savings_percentage: 15,
      expected_improvement_in_service_levels: {
        percentage: 10,
        explanation: "Improved inventory management will lead to better service levels"
      },
      key_performance_indicators: [
        { kpi_name: "Inventory Turnover", current_value: 4, expected_improvement_percentage: 20 },
        { kpi_name: "Stockout Rate", current_value: 5, expected_improvement_percentage: 30 }
      ],
      implementation_plan: "1. Analyze current inventory levels\n2. Implement demand forecasting\n3. Optimize production schedule",
      risk_analysis: "Potential risks include supply chain disruptions and unexpected demand fluctuations",
      key_considerations: ["Monitor market trends", "Maintain flexibility in production"],
      charts: [
        { name: "Sales Forecast", data: [], xLabel: "Month", yLabel: "Sales" },
        { name: "Inventory Levels", data: [], xLabel: "Product", yLabel: "Quantity" }
      ],
      overall_suggestion: "Focus on improving inventory turnover and reducing stockouts through better demand forecasting and production planning"
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

    render(<SalesAndOperationsPlanningToolPage />)

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
      company_size: ['Small', 'Medium', 'Large'],
      industry_sector: ['Manufacturing', 'Retail', 'Technology'],
      operational_constraints: ['Limited production capacity', 'Supply chain disruptions'],
      user_objectives: ['Improve inventory turnover', 'Reduce stockouts'],
      current_challenges: ['Demand volatility', 'Long lead times']
    }

    const mockResults = {
      recommended_inventory_levels: [],
      estimated_cost_savings_percentage: 0,
      expected_improvement_in_service_levels: { percentage: 0, explanation: "" },
      key_performance_indicators: [],
      implementation_plan: "",
      risk_analysis: "",
      key_considerations: [],
      charts: [],
      overall_suggestion: ""
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

    render(<SalesAndOperationsPlanningToolPage />)

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