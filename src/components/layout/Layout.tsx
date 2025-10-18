import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        {children || <Outlet />}
      </main>
      <Navigation />
    </div>
  )
}

export default Layout
