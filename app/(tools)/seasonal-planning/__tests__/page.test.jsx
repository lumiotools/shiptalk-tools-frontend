import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import SeasonalPlanningToolPage from '../page'

// Mock the child components
jest.mock('@/components/seasonal-planning/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          peak_season_periods: ["Christmas", "Back to School"],
          daily_shipments: 1000,
          expected_demand_increase_percentage: 50,
          available_capacity: 1500,
          constraints: ["Limited warehouse space", "Staff shortage"]
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/seasonal-planning/output', () => {
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

describe('SeasonalPlanningToolPage', () => {
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

    const { container } = render(<SeasonalPlanningToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      peak_season_periods: ["Christmas", "Back to School", "Summer Holidays"],
      constraints: ["Limited warehouse space", "Staff shortage", "Transportation delays"]
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<SeasonalPlanningToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=seasonal-planning')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<SeasonalPlanningToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      peak_season_periods: ["Christmas", "Back to School", "Summer Holidays"],
      constraints: ["Limited warehouse space", "Staff shortage", "Transportation delays"]
    }

    const mockResults = {
      estimated_cost_impact: 100000,
      cost_breakdown: [
        { label: "Additional Staff", cost: 50000 },
        { label: "Overtime", cost: 30000 },
        { label: "Extra Storage", cost: 20000 }
      ],
      potential_risks: "1. Overstocking\n2. Understaffing\n3. Delivery delays",
      mitigation_strategies: "1. Implement just-in-time inventory\n2. Cross-train employees\n3. Partner with multiple carriers",
      implementation_plan: "1. Start planning 3 months in advance\n2. Gradually increase inventory\n3. Begin staff training 1 month before peak season",
      charts: [
        {
          name: "Demand Forecast",
          data: [
            { label: "Normal", value: 1000 },
            { label: "Peak", value: 1500 }
          ],
          xLabel: "Period",
          yLabel: "Daily Shipments"
        }
      ],
      summary: "Preparing for the peak seasons will require an estimated investment of $100,000, but this will help meet the increased demand and maintain customer satisfaction."
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

    render(<SeasonalPlanningToolPage />)

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
      peak_season_periods: ["Christmas", "Back to School", "Summer Holidays"],
      constraints: ["Limited warehouse space", "Staff shortage", "Transportation delays"]
    }

    const mockResults = {
      estimated_cost_impact: 0,
      cost_breakdown: [],
      potential_risks: "",
      mitigation_strategies: "",
      implementation_plan: "",
      charts: [],
      summary: ""
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

    render(<SeasonalPlanningToolPage />)

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