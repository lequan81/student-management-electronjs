import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import Card from '../../components/Card'
// import ChartContainer from '../../components/ChartContainer'
import Heading from '../../components/Heading'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import Sidebar from '../../components/Sidebar'
import Toast from '../../components/Toast'

const Home = () => {
  let [homeData] = useState(window.api.store.get('homeData'))
  let [isClock] = useState(
    localStorage.getItem('isDateTime') === 'true' ||
      window.api.store.get('userData.isDateTime') === 'true'
  )
  useRef(() => {}, [isClock, homeData])

  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)

  const setToast = async (message, type) => {
    setToastMessage('')
    setToastType('')
    setToastShow(false)
    setToastMessage(message)
    setToastType(type)
    setToastShow(true)
    setTimeout(() => {
      setToastShow(false)
    }, 3000)
  }

  const getUpdateMessage = () => {
    let message = window.api.updateMessage()
    if (message !== undefined) {
      setToast(`${message['message']}`, `${message['type']}`)
    }
  }

  useEffect(() => {
    getUpdateMessage()
  }, [])

  return (
    <>
      {/* https://stackoverflow.com/questions/69833361/tailwindcss-set-flex-child-width-to-fill-up-whole-parent-width */}
      <div className="flex flex-col min-h-screen md:flex-row">
        <div className="flex w-full h-16 border-4 border-white md:min-h-screen md:w-16 lg:min-h-screen lg:w-48">
          <Sidebar isClock={isClock} />
        </div>
        {/* https://stackoverflow.com/questions/63412303/how-to-make-div-fill-full-height-of-parent-in-tailwind */}
        <div className="flex flex-col flex-1 min-h-screen -mt-16 bg-gray-50 dark:bg-gray-900 md:-mt-0 lg:-mt-0 grow">
          {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
          <Heading title="Dashboard" isSearch={false} />
          <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 overscroll-none grow">
            <div className="w-full px-4 pb-4 rounded mt-0.5 lg:mt-4">
              <div className="flex flex-col h-full p-4 overflow-y-hidden bg-white rounded-md dark:bg-gray-800">
                <div className="grid flex-row grid-cols-12 gap-4 my-4">
                  {/* <Card
                    title="Classes"
                    value={12}
                    color="purple"
                    icon={<UsersIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Average mark"
                    value={6.8}
                    color="green"
                    icon={<ArrowTrendingUpIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Underperformance"
                    value={2}
                    color="red"
                    icon={<ArrowTrendingDownIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Finished homeworks"
                    value={'68%'}
                    color="blue"
                    icon={<BookOpenIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Classes left"
                    value={6}
                    color="yellow"
                    icon={<AcademicCapIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Classes today"
                    value={3}
                    color="green"
                    icon={<CalendarIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Hours spent this week"
                    value={24}
                    color="blue"
                    icon={<ClockIcon className="w-7 h-7" strokeWidth="2" />}
                  />
                  <Card
                    title="Income"
                    value={96}
                    color="purple"
                    icon={<CreditCardIcon className="w-7 h-7" strokeWidth="2" />}
                  /> */}

                  {homeData.length === 0 ? (
                    <Card
                      key={0}
                      title="Income"
                      value={96}
                      color="purple"
                      icon={<CreditCardIcon className="w-7 h-7" strokeWidth="2" />}
                    />
                  ) : (
                    <>
                      {homeData.map((data, index) => (
                        <Card
                          key={index}
                          title={data['title']}
                          value={data['value']}
                          color={
                            data['title'] === 'Income' || data['title'] === 'Classes'
                              ? 'purple'
                              : data['title'] === 'Average mark'
                              ? 'green'
                              : data['title'] === 'Underperformance'
                              ? 'red'
                              : 'blue'
                          }
                          icon={
                            data['title'] === 'Income' ? (
                              <CreditCardIcon className="w-7 h-7" strokeWidth="2" />
                            ) : data['title'] === 'Average mark' ? (
                              <ArrowTrendingUpIcon className="w-7 h-7" strokeWidth="2" />
                            ) : data['title'] === 'Underperformance' ? (
                              <ArrowTrendingDownIcon className="w-7 h-7" strokeWidth="2" />
                            ) : (
                              <Squares2X2Icon className="w-7 h-7" strokeWidth="2" />
                            )
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
                {/* <div className="flex flex-col bg-white rounded-md shadow grow dark:bg-gray-900"> */}
                {/* https://stackoverflow.com/questions/71087466/react-chartjs-2-gradient-fill-error-on-canvas-context */}
                {/* <ChartContainer
                    title={'The number of applied and left students per month'}
                    type={'line'}
                    chartData={{
                      labels: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                      ],
                      // labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agust', 'September', 'October', 'November', 'December'],
                      datasets: [
                        {
                          data: [2, 3, 0, 5, 2, 3, 0, 2, 5, 1, 3, 4],
                          label: 'students',
                          backgroundColor: (context) => {
                            const ctx = context.chart.ctx
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200)
                            gradient.addColorStop(0.1, 'rgba(14, 165, 233, 0.6)')
                            gradient.addColorStop(0.3, 'rgba(14, 165, 233, 0.4)')
                            gradient.addColorStop(0.6, 'rgba(14, 165, 233, 0.1)')
                            gradient.addColorStop(1, '#00000000')
                            return gradient
                          },
                          borderColor: '#3b82f6',
                          pointBackgroundColor: '#3b82f6',
                          fill: 'start',
                          borderWidth: 4
                        }
                      ]
                    }}
                  /> */}
                {/* </div> */}
              </div>
            </div>
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
