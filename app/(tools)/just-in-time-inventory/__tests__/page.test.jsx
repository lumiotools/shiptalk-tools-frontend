import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import JustInTimeInventoryToolPage from '../page'

// Mock the child components
jest.mock('@/components/just-in-time-inventory/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          average_monthly_demand_units: 1000,
          current_inventory_level_units: 500,
          production_capacity_units_per_month: 1200,
          warehouse_capacity_units: 2000,
          main_objectives: ["Reduce inventory costs", "Improve production efficiency"],
          current_challenges: ["Fluctuating demand", "Long lead times"]
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/just-in-time-inventory/output', () => {
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

describe('JustInTimeInventoryToolPage', () => {
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

    const { container } = render(<JustInTimeInventoryToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      main_objectives: ["Reduce inventory costs", "Improve production efficiency", "Enhance customer satisfaction"],
      current_challenges: ["Fluctuating demand", "Long lead times", "Quality issues"]
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<JustInTimeInventoryToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=just-in-time-inventory')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<JustInTimeInventoryToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      main_objectives: ["Reduce inventory costs", "Improve production efficiency", "Enhance customer satisfaction"],
      current_challenges: ["Fluctuating demand", "Long lead times", "Quality issues"]
    }

    const mockResults = {
      inventoryLevelVsDemand: {
        data: [
          { label: "Inventory", value: 500 },
          { label: "Demand", value: 1000 }
        ],
        xLabel: "Category",
        yLabel: "Units"
      },
      productionCapacityUtilization: {
        data: [
          { label: "Utilized", value: 1000 },
          { label: "Unutilized", value: 200 }
        ],
        xLabel: "Category",
        yLabel: "Units"
      },
      warehouseCapacityVsInventory: {
        actualData: [{ label: "Inventory", value: 500 }],
        comparedData: [{ label: "Capacity", value: 2000 }],
        xLabel: "Category",
        yLabel: "Units"
      },
      objectiveFulfillmentAnalysis: {
        data: [
          { label: "Reduce inventory costs", value: 80 },
          { label: "Improve production efficiency", value: 60 }
        ],
        xLabel: "Objective",
        yLabel: "Fulfillment (%)"
      },
      costToServeAnalysis: {
        data: [
          { label: "Current", value: 10000 },
          { label: "Projected", value: 8000 }
        ],
        xLabel: "Category",
        yLabel: "Cost ($)"
      },
      riskAssessment: {
        riskLevel: "Medium",
        progress: 50,
        explanation: "There is a moderate risk due to fluctuating demand and long lead times."
      },
      costSavingsPotential: {
        percentage: 20,
        explanation: "Implementing JIT inventory management could lead to a 20% reduction in inventory holding costs."
      },
      keyPerformanceIndicators: [
        "Inventory turnover ratio",
        "Production lead time",
        "Order fulfillment rate"
      ],
      implementationPlan: "1. Analyze current inventory levels\n2. Identify key suppliers\n3. Implement demand forecasting system\n4. Train staff on JIT principles\n5. Gradually reduce safety stock",
      conclusion: "Implementing a Just-In-Time inventory system can significantly improve efficiency and reduce costs, but careful planning and execution are crucial for success."
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

    render(<JustInTimeInventoryToolPage />)

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
      main_objectives: ["Reduce inventory costs", "Improve production efficiency"],
      current_challenges: ["Fluctuating demand", "Long lead times"]
    }

    const mockResults = {
      inventoryLevelVsDemand: { data: [], xLabel: "", yLabel: "" },
      productionCapacityUtilization: { data: [], xLabel: "", yLabel: "" },
      warehouseCapacityVsInventory: { actualData: [], comparedData: [], xLabel: "", yLabel: "" },
      objectiveFulfillmentAnalysis: { data: [], xLabel: "", yLabel: "" },
      costToServeAnalysis: { data: [], xLabel: "", yLabel: "" },
      riskAssessment: { riskLevel: "", progress: 0, explanation: "" },
      costSavingsPotential: { percentage: 0, explanation: "" },
      keyPerformanceIndicators: [],
      implementationPlan: "",
      conclusion: ""
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

    render(<JustInTimeInventoryToolPage />)

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