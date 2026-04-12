import { PhantomInkGenerator } from "./PhantomInkGenerator"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function PhantomInkPage() {
  return (
    <ErrorBoundary>
      <PhantomInkGenerator />
    </ErrorBoundary>
  )
}
