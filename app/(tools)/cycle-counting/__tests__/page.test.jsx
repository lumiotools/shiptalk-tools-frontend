import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import CycleCountingToolPage from '../page'

// Mock the child components
jest.mock('@/components/cycle-counting/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          cycleCountFrequency: "Weekly",
          expectedCount: 1000,
          currentInventoryLevels: 950,
          priorityLevel: "High",
          warehouseRegions: ["A", "B"],
          demandLevels: ["High", "Medium"],
          leadTime: 5,
          productType: "Electronics"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/cycle-counting/output', () => {
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

describe('CycleCountingToolPage', () => {
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

    const { container } = render(<CycleCountingToolPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      cycleCountFrequency: ['Daily', 'Weekly', 'Monthly'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<CycleCountingToolPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=cycle-counting')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<CycleCountingToolPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Request Failed'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      cycleCountFrequency: ['Daily', 'Weekly', 'Monthly'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      discrepancyAnalysis: { chartType: 'barChart', data: [] },
      cycleCountFrequencySuggestion: { value: 10, explanation: "Increase frequency by 10%" },
      inventoryRiskAssessment: { riskLevel: "Medium", riskProgress: 50, explanation: "Moderate risk due to..." },
      priorityRecommendations: { chartType: 'pieChart', data: [] },
      cycleCountEfficiency: { label: "Efficiency", value: 85, explanation: "Current efficiency is good..." },
      nextCycleCountPeriod: "2023-06-01",
      replenishmentSuggestion: "Reorder 100 units of Product A",
      stockLevelAnalysis: { actualData: [], comparedData: [] },
      accuracyImprovementSuggestions: "Implement barcode scanning for more accurate counts",
      processStreamliningSuggestions: "Use mobile devices for real-time data entry"
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

    render(<CycleCountingToolPage />)

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
      cycleCountFrequency: ['Daily', 'Weekly', 'Monthly'],
      priorityLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      discrepancyAnalysis: { chartType: 'barChart', data: [] },
      cycleCountFrequencySuggestion: { value: 10, explanation: "Increase frequency by 10%" },
      inventoryRiskAssessment: { riskLevel: "Medium", riskProgress: 50, explanation: "Moderate risk due to..." },
      priorityRecommendations: { chartType: 'pieChart', data: [] },
      cycleCountEfficiency: { label: "Efficiency", value: 85, explanation: "Current efficiency is good..." },
      nextCycleCountPeriod: "2023-06-01",
      replenishmentSuggestion: "Reorder 100 units of Product A",
      stockLevelAnalysis: { actualData: [], comparedData: [] },
      accuracyImprovementSuggestions: "Implement barcode scanning for more accurate counts",
      processStreamliningSuggestions: "Use mobile devices for real-time data entry"
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

    render(<CycleCountingToolPage />)

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