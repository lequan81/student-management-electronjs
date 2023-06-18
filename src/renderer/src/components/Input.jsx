import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const Input = ({
  label,
  isEdit,
  type = 'text',
  placeholder,
  onChangeHandler,
  disabled,
  iconButton,
  value,
  error,
  readOnly
}) => {
  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="relative">
        {isEdit ? (
          <>
            <input
              onChange={(e) => onChangeHandler(e.target.value)}
              type={type}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              placeholder={placeholder}
              className={`block w-full p-1.5 text-sm text-gray-900 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400' ${
                error
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-500'
                  : 'border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'
              }`}
            />
            {error && (
              <div
                className={`absolute inset-y-0 flex items-center ${
                  iconButton ? 'right-8' : 'right-0'
                }`}
              >
                <ExclamationCircleIcon strokeWidth={2} className="w-6 h-6 mr-2 text-red-500" />
              </div>
            )}
          </>
        ) : (
          <input
            disabled
            type={type}
            value=""
            id="configId"
            placeholder={placeholder ? placeholder : value}
            className="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        )}
        {iconButton && <div className="signup-show-icon">{iconButton}</div>}
      </div>
    </>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  isEdit: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeHandler: PropTypes.func,
  value: PropTypes.string,
  iconButton: PropTypes.node,
  error: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool
}

export default Input
