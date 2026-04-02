// This is a Server Component - handles routing configuration
export const dynamic = "force-dynamic";
export const runtime = "edge";

import CompareClient from "./compare-client";

export default function ComparePage() {
  return <CompareClient />;
}
