import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import {
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid'
import PropTypes from 'prop-types'
import { useState } from 'react'
import icon from '../assets/icon.png'
import NavItem from './NavItem'

const Sidebar = ({ isClock }) => {
  const [dateState, setDateState] = useState(new Date())
  let [nextUpdate, setNextUpdate] = useState(Number)
  isClock = Boolean(isClock)

  if (isClock) {
    setTimeout(() => {
      let msMin = dateState.getMinutes()
      setNextUpdate(msMin - (Date.now() % msMin))
      setDateState(new Date())
    }, nextUpdate)
  }

  const [defaultValue] = useState([
    {
      name: 'Home',
      path: '/home',
      activeIcon: <HomeIconSolid className="w-5 h-5 md:w-6 md:h-6" />,
      icon: <HomeIcon className="w-5 h-5 md:w-6 md:h-6" />
    },
    /* {
      name: "Chart",
      path: '/chart',
      activeIcon: <ChartBarIconSolid className="w-6 h-6" />,
      icon: <ChartBarIcon className="w-6 h-6" />
    }, */
    {
      name: 'Classes',
      path: '/classes',
      activeIcon: <UsersIconSolid className="w-5 h-5 md:w-6 md:h-6" />,
      icon: <UsersIcon className="w-5 h-5 md:w-6 md:h-6" />
    }
  ])

  return (
    <div className="fixed top-0 z-20 flex flex-col w-full h-12 md:min-h-screen lg:min-h-screen md:top-0 md:left-0 md:w-16 lg:w-48 bg-blue-50 dark:bg-gray-800">
      <nav className="flex flex-col flex-wrap items-center content-between justify-center w-full h-full px-2 space-x-2 text-lg text-gray-700 lg:flex-col md:flex-col lg:justify-start md:px-0 md:py-4 bg-gray-50 dark:bg-gray-900 md:space-x-0 md:space-y-2 lg:space-x-0 lg:space-y-2 lg:px-2">
        <div className="flex flex-col flex-wrap items-center justify-center gap-3 my-0 mb-0 ml-2 mr-12 md:ml-0 lg:ml-0 md:my-1 lg:my-3 md:mb-6 lg:flex-row lg:w-full h-fit md:mr-0 lg:mr-0">
          <div className="flex flex-wrap items-center justify-center">
            <img className="w-8 h-8" src={icon} alt="Workflow" />
            <span className="items-end justify-center hidden pl-2 font-semibold text-gray-900 dark:text-white text-md lg:flex">
              Student Manager
            </span>
          </div>
          {isClock && (
            <div className="flex-col flex-wrap items-center justify-center hidden lg:flex lg:flex-row lg:w-full">
              <span className="items-center justify-center hidden text-lg font-semibold text-gray-800 lg:inline-flex dark:text-white/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="items-center justify-center hidden pl-2 text-lg font-semibold text-gray-800 lg:flex dark:text-white/80">
                  {dateState.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
                <span className="items-center justify-center hidden pl-2 text-lg font-semibold text-gray-800 dark:text-white lg:flex">
                  <span>
                    {
                      dateState
                        .toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: false
                        })
                        .split(':')[0]
                    }
                  </span>
                  <span className="animate-blinker"> : </span>
                  <span>
                    {
                      dateState
                        .toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: false
                        })
                        .split(':')[1]
                    }
                  </span>
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex md:flex-wrap flex-1 md:flex-grow-0 lg:flex-grow-0 items-center justify-center my-0.5 lg:flex-row lg:w-full h-auto space-x-2 md:space-x-0 md:space-y-2 lg:space-x-0 lg:space-y-2">
          {defaultValue.map((data, index) => (
            <NavItem
              end
              key={index}
              path={data.path}
              name={data.name}
              activeIcon={data.activeIcon}
              icon={data.icon}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-row flex-wrap items-center justify-center flex-1 h-fit grow lg:w-full md:flex-col lg:flex-col lg:items-end lg:justify-end md:justify-end gap-y-0 gap-x-2 lg:gap-y-2 lg:gap-x-0 md:gap-x-0 md:gap-y-2">
          <NavItem
            end
            path={'/setting'}
            name="Setting"
            activeIcon={<Cog6ToothIconSolid className="w-6 h-6" />}
            icon={<Cog6ToothIcon className="w-6 h-6" />}
          />
          <NavItem
            end
            path={'/logout'}
            name="Logout"
            color="red"
            activeIcon={<ArrowLeftOnRectangleIconSolid className="w-6 h-6 md:w-5 md:h-5" />}
            icon={<ArrowLeftOnRectangleIcon className="w-6 h-6 md:w-5 md:h-5" />}
          />
        </div>
      </nav>
    </div>
  )
}

Sidebar.propTypes = {
  isClock: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default Sidebar
