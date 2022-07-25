import { useEffect } from 'react'

const useDocumentTitle = title => {
  useEffect(() => {
    document.title = window.location.pathname.includes('dashboard')
      ? 'Dashboard | ' + title
      : 'Restaurant | ' + title
  })
}

export default useDocumentTitle
