import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

// https://jeffsegovia.dev/blogs/scroll-top-top-functionality-with-react
const ScrollToTopButton = () => {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const scrollCallback = () => {
      const scrolledFromTop = window.scrollY
      setShown(() => scrolledFromTop > 5)
    }
    window.addEventListener('scroll', scrollCallback)
    scrollCallback()
    return () => {
      window.removeEventListener('scroll', scrollCallback)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="scroll to top"
      className={`${
        shown ? 'scale-100' : 'scale-0'
      } w-10 h-10 transition-transform duration-200 flex fixed right-6 bottom-6 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-lg shadow-md shadow-gray-200 dark:shadow-gray-800 justify-center items-center`}
    >
      <ArrowUpIcon className="w-5 h-5" strokeWidth={2} />
    </button>
  )
}
export default ScrollToTopButton
