import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import DistributedInventoryToolPage from '../page'

// Mock the child components
jest.mock('@/components/distributed-inventory/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          warehouseRegions: ['North', 'South'],
          demandLevels: [
            { region: 'North', demandLevel: 'High' },
            { region: 'South', demandLevel: 'Medium' }
          ],
          leadTime: 5,
          productType: 'Electronics'
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/distributed-inventory/output', () => {
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

describe('DistributedInventoryToolPage', () => {
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

    const { container } = render(<DistributedInventoryToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      regions: ['North', 'South', 'East', 'West'],
      demandLevels: ['Low', 'Medium', 'High'],
      productTypes: ['Electronics', 'Clothing', 'Food']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<DistributedInventoryToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=distributed-inventory')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<DistributedInventoryToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      regions: ['North', 'South', 'East', 'West'],
      demandLevels: ['Low', 'Medium', 'High'],
      productTypes: ['Electronics', 'Clothing', 'Food']
    }

    const mockResults = {
      inventoryDistribution: {
        data: [{ label: 'North', value: 60 }, { label: 'South', value: 40 }],
        explanation: 'Inventory distribution based on demand levels.'
      },
      replenishmentSchedule: {
        data: [{ label: 'Week 1', value: 100 }, { label: 'Week 2', value: 150 }],
        explanation: 'Suggested replenishment schedule for the next 2 weeks.'
      },
      shippingCostsAndTimes: {
        actualData: [{ label: 'North', value: 500 }, { label: 'South', value: 400 }],
        comparedData: [{ label: 'North', value: 550 }, { label: 'South', value: 450 }],
        explanation: 'Comparison of shipping costs and times between regions.'
      },
      demandForecast: {
        data: [{ label: 'Month 1', value: 1000 }, { label: 'Month 2', value: 1200 }],
        explanation: 'Demand forecast for the next 2 months.'
      },
      costToServe: {
        data: [{ label: 'North', value: 5000 }, { label: 'South', value: 4500 }],
        explanation: 'Cost to serve analysis for each region.'
      },
      newWarehouseRecommendation: {
        data: [{ label: 'East', value: 80 }, { label: 'West', value: 60 }],
        explanation: 'Recommendation for potential new warehouse locations.'
      },
      inventoryRiskAssessment: {
        riskLevel: 'Medium',
        riskProgress: 50,
        explanation: 'Assessment of inventory risk based on current distribution.'
      },
      replenishmentUrgency: {
        urgencyLevel: 'High',
        replenishmentProgress: 75,
        explanation: 'Urgency level for replenishment based on current inventory levels.'
      },
      demandVolatility: {
        volatilityPercentage: 30,
        explanation: 'Analysis of demand volatility across regions.'
      },
      costEfficiency: {
        efficiencyPercentage: 85,
        explanation: 'Overall cost efficiency of the current distribution strategy.'
      },
      warehouseEfficiency: {
        efficiencyPercentage: 90,
        explanation: 'Efficiency analysis of current warehouse operations.'
      },
      conclusion: 'Based on the analysis, we recommend optimizing inventory distribution in the North and South regions, while considering a new warehouse in the East to improve overall efficiency.'
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

    render(<DistributedInventoryToolPage />)

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
      regions: ['North', 'South', 'East', 'West'],
      demandLevels: ['Low', 'Medium', 'High'],
      productTypes: ['Electronics', 'Clothing', 'Food']
    }

    const mockResults = {
      inventoryDistribution: { data: [], explanation: '' },
      replenishmentSchedule: { data: [], explanation: '' },
      shippingCostsAndTimes: { actualData: [], comparedData: [], explanation: '' },
      demandForecast: { data: [], explanation: '' },
      costToServe: { data: [], explanation: '' },
      newWarehouseRecommendation: { data: [], explanation: '' },
      inventoryRiskAssessment: { riskLevel: '', riskProgress: 0, explanation: '' },
      replenishmentUrgency: { urgencyLevel: '', replenishmentProgress: 0, explanation: '' },
      demandVolatility: { volatilityPercentage: 0, explanation: '' },
      costEfficiency: { efficiencyPercentage: 0, explanation: '' },
      warehouseEfficiency: { efficiencyPercentage: 0, explanation: '' },
      conclusion: ''
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

    render(<DistributedInventoryToolPage />)

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