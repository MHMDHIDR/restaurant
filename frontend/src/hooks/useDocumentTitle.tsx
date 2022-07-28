import { useEffect } from 'react'
import useAxios from './useAxios'

const useDocumentTitle = (title: string) => {
  const { response } = useAxios({
    method: 'get',
    url: '/settings'
  })
  const appName = response?.appName || 'Restaurant'

  useEffect(() => {
    document.title = window.location.pathname.includes('dashboard')
      ? `${appName} | Dashboard | ` + title
      : `${appName} | ` + title
  })
}

export default useDocumentTitle
