import { useState, useEffect } from 'react'
import useAxios from './useAxios'

/**
 * Custom hook to check if user is logged in then redirect to dashboard or home page
 */

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [userType, setUserType] = useState('')

  //setting user token from local storage
  const USER = JSON.parse(localStorage.getItem('user'))
  //get user data using token if the user is logged-in and token is saved in localStorage then I'll get the current user data from the database
  const { loading, ...response } = useAxios({
    method: 'get',
    url: `/users`,
    headers: USER ? JSON.stringify({ Authorization: `Bearer ${USER.token}` }) : null
  })

  useEffect(() => {
    if (!USER) {
      setIsAuth(false)
      setUserType('')
    }

    if (response.response !== null) {
      if (
        response.response.userAccountType === 'admin' &&
        response.response._id === USER._id
      ) {
        setIsAuth(true)
        setUserType('admin')
      } else if (
        response.response.userAccountType === 'user' &&
        response.response._id === USER._id
      ) {
        setIsAuth(true)
        setUserType('user')
      }
    }

    return (): void => {
      setIsAuth(false)
      setUserType('')
    }
  }, [response.response])

  return { isAuth, userType, loading }
}

export default useAuth
