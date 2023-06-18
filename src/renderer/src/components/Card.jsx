import PropTypes from 'prop-types'

const Card = ({ icon, title, value, color }) => {
  return (
    <div className="flex h-24 col-span-12 row-span-1 rounded-md shadow-lg bg-gray-50 card-animate-scale dark:bg-gray-900 sm:col-span-6 lg:col-span-4 2xl:col-span-4 intro-y">
      <div className="flex items-center ml-4">
        {/* <div className={`inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-4 font-bold rounded-full bg-${color}-50 text-${color}-600`}> */}
        <div
          className={`inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 font-bold rounded-full bg-gray-200 dark:bg-gray-800 text-${color}-600`}
        >
          {icon}
        </div>
        <div>
          <span className="block text-2xl font-bold text-gray-800 dark:text-slate-50">{value}</span>
          <span className="block mt-1 text-gray-500 text-md dark:text-gray-100/70">{title}</span>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
}

export default Card
