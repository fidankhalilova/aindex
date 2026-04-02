// This is a Server Component - handles routing configuration
export const dynamic = "force-dynamic";

import CompareClient from "./compare-client";

export default function ComparePage() {
  return <CompareClient />;
}
