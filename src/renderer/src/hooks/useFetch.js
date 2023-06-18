import { useEffect, useState } from 'react'

const useFetch = (url, method, body) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      })

      if (response.status === 200) {
        const data = await response.json()
        setData(data)
      } else {
        throw new Error(`Request failed with status code ${response.status}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return {
    loading,
    data
  }
}

export default useFetch
