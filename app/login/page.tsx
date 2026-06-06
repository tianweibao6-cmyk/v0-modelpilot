import { Suspense } from "react"
import { LoginContent } from "./login-content"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
