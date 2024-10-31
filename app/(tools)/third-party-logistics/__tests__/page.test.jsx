import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import ThirdPartyLogisticsToolPage from '../page'

// Mock the child components
jest.mock('@/components/third-party-logistics/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          company_size: "Medium",
          logistics_functions_to_outsource: ["Warehousing", "Transportation"],
          geographic_regions: ["North America", "Europe"],
          types_of_products: ["Electronics", "Apparel"],
          shipment_volume_per_month: 1000,
          user_objectives: ["Cost Reduction", "Improved Efficiency"],
          constraints: ["Budget Limitations", "Time Constraints"],
          current_challenges: ["High Shipping Costs", "Inventory Management Issues"]
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/third-party-logistics/output', () => {
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

describe('ThirdPartyLogisticsToolPage', () => {
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

    const { container } = render(<ThirdPartyLogisticsToolPage />)
    
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
      logistics_functions_to_outsource: ['Warehousing', 'Transportation', 'Inventory Management'],
      geographic_regions: ['North America', 'Europe', 'Asia'],
      types_of_products: ['Electronics', 'Apparel', 'Food'],
      user_objectives: ['Cost Reduction', 'Improved Efficiency', 'Scalability'],
      constraints: ['Budget Limitations', 'Time Constraints', 'Regulatory Requirements'],
      current_challenges: ['High Shipping Costs', 'Inventory Management Issues', 'Order Fulfillment Delays']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<ThirdPartyLogisticsToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=third-party-logistics')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<ThirdPartyLogisticsToolPage />)

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
      logistics_functions_to_outsource: ['Warehousing', 'Transportation', 'Inventory Management'],
      geographic_regions: ['North America', 'Europe', 'Asia'],
      types_of_products: ['Electronics', 'Apparel', 'Food'],
      user_objectives: ['Cost Reduction', 'Improved Efficiency', 'Scalability'],
      constraints: ['Budget Limitations', 'Time Constraints', 'Regulatory Requirements'],
      current_challenges: ['High Shipping Costs', 'Inventory Management Issues', 'Order Fulfillment Delays']
    }

    const mockResults = {
      suggested_providers: ["LogisticsCo", "ShipFast", "GlobalWarehouse"],
      estimated_cost_savings_percentage: 15,
      expected_improvement_in_service_levels: "20% reduction in order fulfillment time",
      key_performance_indicators: [
        { kpi_name: "Order Accuracy", current_value: 95, expected_improvement_percentage: 3 },
        { kpi_name: "On-Time Delivery", current_value: 90, expected_improvement_percentage: 5 }
      ],
      implementation_plan: "1. Select 3PL provider\n2. Integrate systems\n3. Train staff\n4. Transition operations",
      risk_analysis: "1. Data security concerns\n2. Potential service disruptions during transition",
      key_considerations: "1. Ensure 3PL's technology is compatible\n2. Establish clear communication channels\n3. Set up performance metrics",
      charts: [
        {
          name: "Cost Comparison",
          data: [
            { label: "Current", value: 100000 },
            { label: "Projected", value: 85000 }
          ],
          xLabel: "Scenario",
          yLabel: "Annual Cost ($)"
        }
      ],
      success_stories: "Company X reduced shipping costs by 18% in the first year of 3PL implementation.",
      overall_suggestion: "Based on your inputs, transitioning to a 3PL provider is recommended to reduce costs and improve efficiency."
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

    render(<ThirdPartyLogisticsToolPage />)

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
      logistics_functions_to_outsource: ['Warehousing', 'Transportation', 'Inventory Management'],
      geographic_regions: ['North America', 'Europe', 'Asia'],
      types_of_products: ['Electronics', 'Apparel', 'Food'],
      user_objectives: ['Cost Reduction', 'Improved Efficiency', 'Scalability'],
      constraints: ['Budget Limitations', 'Time Constraints', 'Regulatory Requirements'],
      current_challenges: ['High Shipping Costs', 'Inventory Management Issues', 'Order Fulfillment Delays']
    }

    const mockResults = {
      suggested_providers: [],
      estimated_cost_savings_percentage: 0,
      expected_improvement_in_service_levels: "",
      key_performance_indicators: [],
      implementation_plan: "",
      risk_analysis: "",
      key_considerations: "",
      charts: [],
      success_stories: "",
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

    render(<ThirdPartyLogisticsToolPage />)

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