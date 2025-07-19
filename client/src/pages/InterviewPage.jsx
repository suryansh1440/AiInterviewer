import React from 'react'
import Agent from '../components/Agent'
import { useAuthStore } from '../store/useAuthStore'

const InterviewPage = () => {
  const {user} = useAuthStore();
  return (
    <div>
      <h3>INterview Page</h3>

      <Agent/>
    </div>
  )
}

export default InterviewPage
