import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import Component from '../page'

// Mock the child components
jest.mock('@/components/interstate-compliance-checker/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          originState: "California",
          destinationState: "Texas",
          itemType: "Electronics",
          carrierName: "FedEx"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/interstate-compliance-checker/output', () => {
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

describe('Interstate Compliance Checker Page', () => {
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
      states: ['California', 'Texas', 'New York'],
      itemTypes: ['Electronics', 'Clothing', 'Food'],
      carriers: ['FedEx', 'UPS', 'USPS']
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
        expect.stringContaining('/api/v1/tools-options?tool_name=interstate-compliance-checker')
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
      states: ['California', 'Texas', 'New York'],
      itemTypes: ['Electronics', 'Clothing', 'Food'],
      carriers: ['FedEx', 'UPS', 'USPS']
    }

    const mockResults = {
      prohibitionStatus: "Allowed",
      requiredDocuments: ["Bill of Lading", "Commercial Invoice"],
      packagingRequirements: ["Anti-static packaging"],
      applicableFees: ["State Electronics Recycling Fee"],
      carrierRestrictions: [
        { carrier: "FedEx", restriction: "No lithium batteries", reason: "Safety regulations" }
      ],
      warnings: ["Fragile items require special handling"],
      complianceScore: {
        data: [{ label: "Compliance Score", value: 85 }],
        xLabel: "Score",
        yLabel: "Value"
      },
      restrictionComparison: {
        data: [
          { label: "Origin State", value: 2 },
          { label: "Destination State", value: 3 }
        ],
        xLabel: "State",
        yLabel: "Number of Restrictions"
      },
      taxesAndFees: {
        data: [
          { label: "Sales Tax", value: 8.25 },
          { label: "Recycling Fee", value: 5 }
        ],
        xLabel: "Fee Type",
        yLabel: "Amount ($)"
      }
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
      states: ['California', 'Texas', 'New York'],
      itemTypes: ['Electronics', 'Clothing', 'Food'],
      carriers: ['FedEx', 'UPS', 'USPS']
    }

    const mockResults = {
      prohibitionStatus: "Allowed",
      requiredDocuments: ["Bill of Lading"],
      packagingRequirements: [],
      applicableFees: [],
      carrierRestrictions: [],
      warnings: [],
      complianceScore: { data: [], xLabel: "", yLabel: "" },
      restrictionComparison: { data: [], xLabel: "", yLabel: "" },
      taxesAndFees: { data: [], xLabel: "", yLabel: "" }
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