import React from 'react'
import './common.css'
export default function Footer() {
  return (
    <div className="site-footer">
      <p>&copy; {new Date().getFullYear()} My Awesome App. All rights reserved.</p>
    </div>
  )
}