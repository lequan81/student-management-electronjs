import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Modal = ({
  type = 'info',
  title = '',
  message = '',
  confirmMessage = 'OK',
  confirmHandler = () => {},
  cancelHandler,
  cancelMessage = '',
  path = '',
  dismissIndex = -1
}) => {
  const [index, setIndex] = useState(dismissIndex)
  const Dismiss = () => {
    setIndex(dismissIndex)
    window.history.go(index)
    /*same as function
     *history.back() */
  }
  return (
    <div
      className="relative z-20 bg-transparent"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="logout-modal"
    >
      <div className="fixed inset-0 transition-opacity bg-gray-600"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="px-4 pt-5 pb-4 bg-white dark:bg-gray-800 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div
                  className={
                    type === 'info'
                      ? 'modal-info'
                      : type === 'warning'
                      ? 'modal-warn'
                      : type === 'success'
                      ? 'modal-success'
                      : type === 'error'
                      ? 'modal-error'
                      : 'modal-info'
                  }
                >
                  {type === 'info' ? (
                    <InformationCircleIcon className="w-8 h-8" />
                  ) : type === 'warning' ? (
                    <ExclamationCircleIcon className="w-8 h-8" />
                  ) : type === 'success' ? (
                    <CheckCircleIcon className="w-8 h-8" />
                  ) : type === 'error' ? (
                    <XCircleIcon className="w-8 h-8" />
                  ) : (
                    <InformationCircleIcon className="w-8 h-8" />
                  )}
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-xl font-bold leading-6 text-gray-900 dark:text-slate-50"
                    id="modal-title"
                  >
                    {title}
                  </h3>
                  {cancelMessage === '' ? (
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-hide="authentication-modal"
                      onClick={Dismiss}
                    >
                      <XMarkIcon className="w-6 h-6" />
                      <span className="sr-only">Close</span>
                    </button>
                  ) : (
                    <></>
                  )}
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-white/60">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 gap-x-2 bg-gray-50 dark:bg-gray-800/90 sm:flex sm:flex-row-reverse sm:px-6">
              {confirmMessage !== '' ? (
                <button
                  type="button"
                  className={
                    type === 'info'
                      ? 'modal-confirm-btn info'
                      : type === 'warning'
                      ? 'modal-confirm-btn warn'
                      : type === 'success'
                      ? 'modal-confirm-btn success'
                      : type === 'error'
                      ? 'modal-confirm-btn error'
                      : 'modal-confirm-btn info'
                  }
                  onClick={confirmHandler}
                >
                  {confirmMessage}
                </button>
              ) : (
                <Link
                  className={
                    type === 'info'
                      ? 'modal-confirm-btn info'
                      : type === 'warning'
                      ? 'modal-confirm-btn warn'
                      : type === 'success'
                      ? 'modal-confirm-btn success'
                      : type === 'error'
                      ? 'modal-confirm-btn error'
                      : 'modal-confirm-btn info'
                  }
                  to={path}
                >
                  {confirmMessage}
                </Link>
              )}
              <button
                type="submit"
                className={cancelMessage === '' ? 'hidden' : 'modal-cancel-btn'}
                onClick={typeof cancelHandler === 'function' ? cancelHandler : Dismiss}
              >
                {cancelMessage}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmMessage: PropTypes.string,
  confirmHandler: PropTypes.func,
  cancelMessage: PropTypes.string,
  cancelHandler: PropTypes.func,
  path: PropTypes.string,
  dismissIndex: PropTypes.number
}

export default Modal
