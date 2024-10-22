import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col text-xl gap-8 justify-center items-center">
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
    </div>
  );
};

export default HomePage;
