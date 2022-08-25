import { useEffect, useState } from 'react'
import Axios from 'axios'
import { API_URL } from '../data/constants'
import { responseTypes } from '../types'

Axios.defaults.baseURL = API_URL

const useAxios = ({ url, method = 'get', body = null, headers = null }) => {
  const [response, setResponse] = useState<responseTypes | null>(null)
  const [error, setError] = useState<{
    error: any
    response: any
  } | null>(null)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Axios({
          url,
          method,
          data: body,
          headers: JSON.parse(headers)
        })
        setResponse(result.data)
        setloading(false)
      } catch (error) {
        setError({ error, response: error.response })
      } finally {
        setloading(false)
      }
    }
    fetchData()
  }, [url, method, body, headers])

  return { response, error, loading }
}

export default useAxios
