import { useEffect, useState } from 'react'
import Axios from 'axios'

export type responseTypes = {
  response: Array<any> | null | any
  itemsCount: number
  CategoryList: string[]
  _id: string
  heroBg: string[]
  appName: string
  appDesc: string
  appTagline: string
  instagramAccount: string
  twitterAccount: string
  whatsAppNumber: string
}

Axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? process.env.API_LOCAL_URL : process.env.API_URL

const useAxios = ({ url, method, body = null, headers = null }) => {
  const [response, setResponse] = useState<responseTypes | null>(null)
  const [error, setError] = useState<{
    error: any
    response: any
  } | null>(null)
  const [loading, setloading] = useState(true)

  useEffect((): { () } => {
    let isMounted = true

    setloading(true)

    const getData = async () => {
      try {
        const makeFetch = await Axios[method](url, JSON.parse(headers), JSON.parse(body))
        const { data } = await makeFetch

        if (isMounted) {
          setResponse(data)
          setError(null)
        }
      } catch (error) {
        if (isMounted) {
          setError(error)
          setResponse(null)
        }
      } finally {
        isMounted && setloading(false)
      }
    }
    getData()

    return () => (isMounted = false)
  }, [method, url, body, headers])

  return { response, error, loading }
}

export default useAxios
