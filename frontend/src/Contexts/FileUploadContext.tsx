import { useEffect, useState, createContext } from 'react'

export const FileUploadContext = createContext()

const FileUploadContextProvider = ({ children }) => {
  const [file, setFile] = useState([])
  const [fileURLs, setFileURLs] = useState([])

  const onFileAdd = e => setFile(file => [...file, ...e.target.files])

  const onFileRemove = (fileUrl, fileName) => {
    setFileURLs(fileURLs.filter(url => url !== fileUrl))
    setFile(file.filter(file => file.name !== fileName))
  }

  useEffect(() => {
    if (file.length < 1) return

    const newFileUrls = []
    file.forEach(file => {
      if (Math.ceil(file.size / 1000000) < 2) {
        newFileUrls.push(URL.createObjectURL(file))
      }
      setFileURLs(newFileUrls)
    })
  }, [file])

  return (
    <FileUploadContext.Provider
      value={{
        file,
        fileURLs,
        setFileURLs,
        onFileAdd,
        onFileRemove
      }}
    >
      {children}
    </FileUploadContext.Provider>
  )
}

export default FileUploadContextProvider
