import PropTypes from 'prop-types'

const Heading = ({
  title,
  searchPlaceholder = 'Search',
  rightButton,
  isSearch = false,
  onChange
}) => {
  return (
    <div className="sticky z-20 w-full pt-0.5 mt-12 bg-gray-50 dark:bg-gray-900 top-12 md:top-0 lg:top-0 md:py-1 lg:pt-3 lg:-pb-0 lg:-mb-3 md:mt-1 lg:mt-0 h-fit">
      <div className="flex items-center justify-between h-full">
        <div className="py-1 pl-2 mx-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {isSearch && (
          <div className="mx-auto max-w-[16rem] md:max-w-sm lg:max-w-lg grow">
            <div className="relative flex items-center w-full h-8 overflow-hidden bg-white border-2 border-gray-300 rounded-md dark:border-gray-800 dark:bg-gray-800 focus-within:shadow-md">
              <div className="grid w-12 h-full text-gray-600 dark:text-gray-300 place-items-center text-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="w-full h-full pr-2 text-sm text-gray-700 bg-white outline-none dark:bg-gray-800 dark:text-white"
                type="text"
                id="search"
                placeholder={searchPlaceholder}
                onChange={onChange}
              />
            </div>
          </div>
        )}
        <div className="pr-2 mx-4">{rightButton}</div>
      </div>
    </div>
  )
}

Heading.propTypes = {
  title: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  rightButton: PropTypes.node,
  isSearch: PropTypes.bool,
  onChange: PropTypes.func
}

export default Heading
