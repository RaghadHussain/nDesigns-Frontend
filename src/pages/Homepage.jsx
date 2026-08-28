import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'

function Homepage() {
  useDocumentTitle("Home")
  return (
    <div>Homepage</div>
  )
}

export default Homepage