import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import ParcelClimateProtectionPage from '../page'

// Mock the child components
jest.mock('@/components/parcel-climate-protection/inputForm', () => {
  return function MockInputForm({ handleSubmit }) {
    return (
      <form data-testid="mock-input-form" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit({
          productType: "Electronics",
          climateCondition: "Extreme Heat",
          sensitivityLevel: "High",
          carrierOptions: ["FedEx", "UPS"],
          urgencyLevel: "High"
        })
      }}>
        <button type="submit">Submit</button>
      </form>
    )
  }
})

jest.mock('@/components/parcel-climate-protection/output', () => {
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

describe('ParcelClimateProtectionPage', () => {
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

    const { container } = render(<ParcelClimateProtectionPage />)
    
    expect(
      container.querySelector('.lucide-loader-circle')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector('.lucide-loader-circle')).not.toBeInTheDocument()
    })
  })

  it('fetches options on mount', async () => {
    const mockOptions = {
      sensitivityLevel: ['Low', 'Medium', 'High'],
      climateCondition: ['Extreme Heat', 'Extreme Cold', 'High Humidity'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ options: mockOptions })
      })
    )

    render(<ParcelClimateProtectionPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/tools-options?tool_name=parcel-climate-protection')
      )
    })
  })

  it('displays error toast when API calls fail', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    )

    render(<ParcelClimateProtectionPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Failed to fetch options'
      })
    })
  })

  it('submits form and displays results', async () => {
    const mockOptions = {
      sensitivityLevel: ['Low', 'Medium', 'High'],
      climateCondition: ['Extreme Heat', 'Extreme Cold', 'High Humidity'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      climateRiskAssessment: "High risk due to extreme heat conditions",
      packagingRecommendations: [
        {
          name: "Thermal Protective Box",
          cost: 25.99,
          specifications: [
            { name: "Material", value: "Double-walled corrugated cardboard" },
            { name: "Insulation", value: "Reflective barrier" }
          ]
        }
      ],
      carrierComparisons: [
        {
          name: "FedEx",
          rating: "A",
          capabilities: ["Temperature-controlled vehicles", "Real-time monitoring"],
          costPremium: "+15%"
        }
      ],
      realTimeAlerts: [
        "Heat wave warning in transit route",
        "Recommended delivery window: Early morning"
      ],
      packagingCostAnalysis: {
        data: [],
        xLabel: "Package Type",
        yLabel: "Cost ($)"
      },
      carrierCapabilityAnalysis: {
        data: [],
        xLabel: "Carrier",
        yLabel: "Capability Score"
      },
      transitImpactPrediction: "Moderate risk of temperature exposure during transit",
      climateAdaptabilityScore: {
        data: [],
        xLabel: "Factor",
        yLabel: "Score"
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

    render(<ParcelClimateProtectionPage />)

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
      sensitivityLevel: ['Low', 'Medium', 'High'],
      climateCondition: ['Extreme Heat', 'Extreme Cold', 'High Humidity'],
      urgencyLevel: ['Low', 'Medium', 'High']
    }

    const mockResults = {
      climateRiskAssessment: "",
      packagingRecommendations: [],
      carrierComparisons: [],
      realTimeAlerts: [],
      packagingCostAnalysis: { data: [], xLabel: "", yLabel: "" },
      carrierCapabilityAnalysis: { data: [], xLabel: "", yLabel: "" },
      transitImpactPrediction: "",
      climateAdaptabilityScore: { data: [], xLabel: "", yLabel: "" }
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

    render(<ParcelClimateProtectionPage />)

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