import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
const Toast = ({ message, type, isShow }) => {
  let style, icon, color
  switch (type) {
    case 'success':
      color = 'green'
      style = 'border-green-500'
      icon = (
        <CheckCircleIcon className="text-green-600 w-7 h-7 dark:text-green-500" strokeWidth={2} />
      )
      break
    case 'info':
      color = 'blue'
      style = 'border-blue-500'
      icon = (
        <InformationCircleIcon
          className="text-blue-600 w-7 h-7 dark:text-blue-500"
          strokeWidth={2}
        />
      )
      break
    case 'error':
      color = 'red'
      icon = <XCircleIcon className="text-red-600 w-7 h-7 dark:text-red-500" strokeWidth={2} />
      style = 'border-red-500'
      break
    case 'warning':
      color = 'orange'
      style = 'border-orange-500'
      icon = (
        <ExclamationCircleIcon
          className="text-orange-600 w-7 h-7 dark:text-orange-500"
          strokeWidth={2}
        />
      )
      break
  }
  return (
    <>
      <div className={isShow ? 'relative z-40' : 'hidden'}>
        <div className="fixed inset-0 z-30 w-full h-24 overflow-y-auto animate-faded">
          <div className="flex items-start justify-center w-auto p-2 text-center h-fit sm:p-0">
            <div className="relative overflow-hidden text-left transition-all transform sm:my-8 sm:w-full sm:max-w-lg">
              <div
                className={`shadow mx-auto flex w-full max-w-lg items-center gap-x-4 rounded-md bg-${color}-200 p-2 dark:bg-gray-800 border ${style}`}
              >
                {icon}
                <div className="px-2 -ml-1.5 font-medium text-md text-gray-900 dark:text-white">
                  {message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  isShow: PropTypes.bool
}

export default Toast
