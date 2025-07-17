import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 w-full min-w-0 pt-20">
          {children}
        </main>
      </div>
    </div>
  )
}
