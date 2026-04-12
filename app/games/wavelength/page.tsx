import { WavelengthGenerator } from "./WavelengthGenerator"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function WavelengthPage() {
  return (
    <ErrorBoundary>
      <WavelengthGenerator />
    </ErrorBoundary>
  )
}
