import { FakeArtistGenerator } from "./FakeArtistGenerator"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function FakeArtistPage() {
  return (
    <ErrorBoundary>
      <FakeArtistGenerator />
    </ErrorBoundary>
  )
}
