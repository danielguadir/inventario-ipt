import React from 'react'
import '../app/theme.css'

export default function Check({ small = false }){
  return (
    <span className={small ? 'inline-check' : 'inline-check large'}>✓</span>
  )
}
