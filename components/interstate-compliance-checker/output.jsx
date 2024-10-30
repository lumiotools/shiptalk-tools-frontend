import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  FileText,
  Package,
  Truck,
  DollarSign,
} from "lucide-react"
import RenderChart from "@/components/common/renderChart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({
  prohibitionStatus,
  requiredDocuments,
  packagingRequirements,
  applicableFees,
  carrierRestrictions,
  warnings,
  complianceScore,
  restrictionComparison,
  taxesAndFees,
}) {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Prohibition Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{prohibitionStatus}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requiredDocuments.length > 0 ? (
              <ul className="list-disc pl-5">
                {requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            ) : (
              <p>No documents required for this shipment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            {warnings.length > 0 ? (
              <ul className="list-disc pl-5">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p>No warnings for this shipment.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {carrierRestrictions.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Carrier Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Restriction</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrierRestrictions.map((restriction, index) => (
                  <TableRow key={index}>
                    <TableCell>{restriction.carrier}</TableCell>
                    <TableCell>{restriction.restriction}</TableCell>
                    <TableCell>{restriction.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Carrier Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>No carrier restrictions for this shipment.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart title="Taxes and Fees" chart={taxesAndFees} />

        <div className="flex flex-col gap-8 [&>div]:flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Packaging Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packagingRequirements.length > 0 ? (
                <ul className="list-disc pl-5">
                  {packagingRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific packaging requirements for this shipment.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Applicable Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicableFees.length > 0 ? (
                <ul className="list-disc pl-5">
                  {applicableFees.map((fee, index) => (
                    <li key={index}>{fee}</li>
                  ))}
                </ul>
              ) : (
                <p>No applicable fees for this shipment.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <RenderChart index={4} title="Compliance Score" chart={complianceScore} />

        <RenderChart
          index={3}
          title="Restriction Comparison"
          chart={restrictionComparison}
        />
      </div>
    </div>
  )
}