import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shadow HUD - Authentication",
  description: "Login or register to your Shadow HUD account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  )
}