import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
  }

  const userIsAuthenticated = () => {
    let storedUser = localStorage.getItem('user')
    if (!storedUser) {
      return false
    }
    storedUser = JSON.parse(storedUser)

    // if user has token expired, logout user
    if (Date.now() > storedUser.data.exp * 1000) {
      userLogout()
      return false
    }
    return true
  }

  const userLogin = user => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const userLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser.data.rol[0])
    console.log(getUser())
    return storedUser && storedUser.data.rol[0] === 'ADMIN';
  };

  const isManager = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser.data.rol[0])
    console.log(getUser())
    return storedUser && storedUser.data.rol[0] === 'MANAGER';
  };


  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
    isAdmin,
    isManager
  }
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider }