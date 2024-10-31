import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import Component from '../page'

// Mock the child components
jest.mock('@/components/multi-stop-route-optimizer/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          stops: [
            { address: "123 Main St", parcelType: "Standard", priorityLevel: "Medium" },
            { address: "456 Elm St", parcelType: "Fragile", priorityLevel: "High" }
          ],
          routeStart: "789 Oak St",
          urgencyLevel: "High",
          maxStops: 2
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/multi-stop-route-optimizer/output', () => {
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

describe('Multi-Stop Route Optimizer Page', () => {
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

    const { container } = render(<Component />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      parcelType: ['Standard', 'Fragile', 'Perishable'],
      priorityLevel: ['Low', 'Medium', 'High'],
      handlingRequirements: ['None', 'Careful', 'Special'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<Component />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=multi-stop-route-optimizer')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<Component />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Failed to fetch options'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      parcelType: ['Standard', 'Fragile', 'Perishable'],
      priorityLevel: ['Low', 'Medium', 'High'],
      handlingRequirements: ['None', 'Careful', 'Special'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      optimizedRoute: [
        { sequenceOrder: 1, address: "123 Main St", parcelType: "Standard", priorityLevel: "Medium", handlingRequirements: "None" },
        { sequenceOrder: 2, address: "456 Elm St", parcelType: "Fragile", priorityLevel: "High", handlingRequirements: "Careful" }
      ],
      totalStops: 2,
      highPriorityParcelCount: 1,
      handlingRequirementSummary: ["1 Standard parcel", "1 Fragile parcel"],
      highRiskStops: ["456 Elm St"],
      delayRiskAnalysis: { data: [], xLabel: 'Stop', yLabel: 'Delay Risk' },
      travelComplexityAnalysis: { data: [], xLabel: 'Route Segment', yLabel: 'Complexity Score' },
      priorityParcelImpact: { data: [], xLabel: 'Priority Level', yLabel: 'Impact Score' },
      handlingRequirementsDistribution: { data: [], xLabel: 'Requirement', yLabel: 'Count' },
      handlingCostEstimation: { data: [], xLabel: 'Handling Type', yLabel: 'Cost' },
      recommendations: ["Prioritize the high-priority stop at 456 Elm St", "Handle the fragile parcel with care"]
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

    render(<Component />)

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
      parcelType: ['Standard', 'Fragile', 'Perishable'],
      priorityLevel: ['Low', 'Medium', 'High'],
      handlingRequirements: ['None', 'Careful', 'Special'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      optimizedRoute: [
        { sequenceOrder: 1, address: "123 Main St", parcelType: "Standard", priorityLevel: "Medium", handlingRequirements: "None" }
      ],
      totalStops: 1,
      highPriorityParcelCount: 0,
      handlingRequirementSummary: ["1 Standard parcel"],
      highRiskStops: [],
      delayRiskAnalysis: { data: [], xLabel: '', yLabel: '' },
      travelComplexityAnalysis: { data: [], xLabel: '', yLabel: '' },
      priorityParcelImpact: { data: [], xLabel: '', yLabel: '' },
      handlingRequirementsDistribution: { data: [], xLabel: '', yLabel: '' },
      handlingCostEstimation: { data: [], xLabel: '', yLabel: '' },
      recommendations: []
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

    render(<Component />)

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