import type { Metadata } from "next"
import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '../components/navbar'

export const metadata: Metadata = {
  title: "Shadow HUD - Dashboard",
  description: "Your fitness journey awaits",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
//   const session = await getServerSession(authOptions)

//   if (!session) {
//     redirect('/auth/login')
//   }

  return (
    <div className="min-h-screen bg-surface">
      {/* <Navbar session={session} /> */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}