import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'

export default function Dashboard() {
  const {user} =  useContext(UserContext)
  console.log(user)
  return (
    <div>
        <h1>Dashboard</h1>
        {!!user && (<p>Welcome, {user.name}</p>)}
    </div>
  )
}
