/* import 'chart.js/auto'
import PropTypes from 'prop-types'
import { Chart } from 'react-chartjs-2'

// https://stackoverflow.com/questions/72808960/how-to-remove-x-and-y-axis-with-react-chartjs-2
// https://stackoverflow.com/questions/67449537/how-to-change-default-font-family-in-react-chartjs-2

const ChartContainer = ({ title, type, chartData }) => {
  return (
    <>
      <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="font-semibold text-gray-900 dark:text-white text-lg">{title}</p>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex items-center justify-center h-full px-4 py-10 text-gray-200 text-2xl font-semibold bg-gray-100 dark:bg-gray-800/70 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-md">
          {chartData ? (
            <Chart
              type={type}
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                tension: 0.2,
                scales: {
                  x: {
                    ticks: {
                      display: true //false to remove the x-axis
                    },
                    // to remove the x-axis grid
                    grid: {
                      drawBorder: false,
                      display: false
                    }
                  },
                  y: {
                    ticks: {
                      display: false,
                      beginAtZero: true
                    },
                    // to remove the y-axis grid
                    grid: {
                      drawBorder: false,
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    enabled: true,
                    displayColors: false,
                    bodyFont: {
                      size: 16
                    },
                    titleFont: {
                      size: 16
                    }
                  }
                }
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  )
}

ChartContainer.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  chartData: PropTypes.any
}

export default ChartContainer
 */
