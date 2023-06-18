import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const NavItem = ({ path, name, activeIcon, icon, color = 'sky' }) => {
  return (
    <NavLink
      className="inline-flex justify-center font-semibold rounded lg:w-full group text-white/50 hover:text-white dark:bg-gray-900 hover:font-bold"
      to={path}
      end
    >
      {({ isActive }) =>
        isActive ? (
          <>
            <div
              className={`hidden md:flex lg:flex w-1.5 rounded-l-md rounded-r-none bg-${color}-500`}
            ></div>
            <span
              className={`flex items-center p-2.5 border-b-4 border-current rounded-md text-${color}-500 md:rounded-r-md lg:rounded-r-md lg:rounded-l-none md:rounded-l-none md:border-none lg:border-none bg-${color}-700/20 lg:flex-row lg:w-full`}
              href="#"
            >
              {activeIcon}
              <span className="hidden pl-4 font-semibold text-md lg:inline-flex">{name}</span>
            </span>
          </>
        ) : (
          <>
            <div
              className={`hidden md:flex lg:flex w-1.5 transition-transform ease-linear origin-top flex-row scale-y-0 rounded-l-md rounded-r-none group-hover:bg-${color}-500 group-hover:scale-100 duration-200`}
            ></div>
            <span
              className={`flex items-center p-2.5 border-b-4 border-gray-900 rounded-md text-gray-800 dark:text-white/50 md:rounded-r-md lg:rounded-r-md lg:rounded-l-none md:rounded-l-none md:border-none lg:border-none hover:border-${color}-500 hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-white lg:flex-row lg:w-full`}
              href="#"
            >
              {icon}
              <span className="hidden pl-4 font-semibold text-gray-800 dark:text-white text-md lg:inline-flex">
                {name}
              </span>
            </span>
          </>
        )
      }
    </NavLink>
  )
}

NavItem.propTypes = {
  path: PropTypes.string,
  name: PropTypes.string,
  activeIcon: PropTypes.node,
  icon: PropTypes.node,
  color: PropTypes.string
}

export default NavItem
