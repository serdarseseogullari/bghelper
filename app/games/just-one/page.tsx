import { JustOneGenerator } from "./JustOneGenerator"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function JustOnePage() {
  return (
    <ErrorBoundary>
      <JustOneGenerator />
    </ErrorBoundary>
  )
}
