import { ItoGenerator } from "./ItoGenerator"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function ItoPage() {
  return (
    <ErrorBoundary>
      <ItoGenerator />
    </ErrorBoundary>
  )
}
