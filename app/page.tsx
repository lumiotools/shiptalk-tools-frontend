import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col text-xl p-8 gap-8 justify-center items-center">
      
    <p className="text-primary underline font-bold italic">Shipping tools</p>

      <Link href="/cost-to-serve-analysis"> Cost to Serve Analysis</Link>
      <Link href="/cross-docking">Cross Docking</Link>
      <Link href="/cycle-counting">Cycle Counting</Link>
      <Link href="/distributed-inventory">Distributed Inventory</Link>
      <Link href="/dynamic-routing">Dynamic Routing</Link>
      <Link href="/freight-consolidation">Freight Consolidation</Link>
      <Link href="/just-in-time-inventory">Just In Time Inventory</Link>
      <Link href="/last-mile-delivery-solutions">
        Last Mile Delivery Solutions
      </Link>
      <Link href="/sales-and-operations-planning">
        Sales and Operations Planning
      </Link>
      <Link href="/seasonal-planning">Seasonal Planning</Link>
      <Link href="/third-party-logistics">Third Party Logistics</Link>

    <p className="text-primary underline font-bold italic">New Parcel tools</p>

      <Link href="/parcel-flow">Parcel Flow</Link>
      <Link href="/parcel-climate-protection">
        Parcel Climate Protection Monitor
      </Link>
      <Link href="/interstate-compliance-checker">
        Interstate Compliance Checker
      </Link>
      <Link href="/multi-stop-route-optimizer">
        Multi-Stop Parcel Route Optimizer
      </Link>
      <Link href="/time-zone-delivery-scheduler">
        Time Zone Delivery Scheduler
      </Link>
      <Link href="/delivery-frequency-cost-impact-analyzer">
        Delivery Frequency Cost Impact Analyzer
      </Link>
      <Link href="/bulk-shipment-labeling-optimizer">
        Bulk Shipment Labeling Optimizer**
      </Link>
      <Link href="/urban-parking-fee-minimizer">
        Urban Parking Fee Minimizer
      </Link>
      <Link href="/cold-chain-delivery-cost-estimator">
        Cold-Chain Delivery Cost Estimator
      </Link>
      <Link href="/renewable-transport-cost-estimator">
        Renewable Transport Cost Estimator
      </Link>
    </div>
  );
};

export default HomePage;
