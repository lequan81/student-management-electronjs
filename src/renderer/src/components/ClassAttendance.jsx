import { useState } from 'react'
import { useParams } from 'react-router-dom'
// import data from '../db/data.json'
import ScrollToTopButton from './ScrollToTopButton'

const ClassAttendance = () => {
  let { className, classIndex } = useParams()
  const [classData] = useState(window.api.store.get('classes'))
  const [studentsInfo, setStudentsInfo] = useState(classData[classIndex]['students'])
  const [totalAttendance, setTotalAttendance] = useState(0)

  const isAbsent = (studentName, isAbsent, studentIndex) => {
    let updatedList = [...studentsInfo]
    updatedList[studentIndex]['Attendance'] = isAbsent
    if (isAbsent) {
      setTotalAttendance(totalAttendance + 1)
      // console.log(updatedList[studentIndex]['attendance'])
      // console.log(window.api.store.get(`classes.${classIndex}.students.${studentIndex}.attendance`))
    } else {
      if (totalAttendance > 0) {
        setTotalAttendance(totalAttendance - 1)
      } else {
        setTotalAttendance(0)
      }
    }
    setStudentsInfo(updatedList)
    console.log(updatedList)
    // console.log(totalAttendance + 1)
    window.api.store.set(`classes.${classIndex}.available`, totalAttendance + 1)
    window.api.store.set(`classes.${classIndex}.students`, updatedList)
  }
  const takeAttendanceSubmit = async (e) => {
    e.preventDefault()
    // console.log(studentsInfo)
    // console.log(totalAttendance)
    window.api.sheets.takeAttendance(className, classIndex)
    Dismiss()
  }

  const Dismiss = () => {
    window.history.go(-1)
    /*same as function
     *history.back() */
  }

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 overscroll-none">
        <div className="relative w-full text-left bg-white">
          <div className="flex flex-col w-full min-h-screen px-4 pt-5 pb-4 bg-white dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div className="sticky top-0 mb-2 text-lg font-semibold text-left text-gray-900 bg-white dark:bg-gray-800 dark:text-white">
              <h3 className="mb-2 text-2xl font-bold text-center text-black dark:text-white">
                {className + ' Attendance'}
              </h3>
            </div>
            <div className="flex flex-col items-center w-full h-full max-w-5xl max-h-full px-2 mx-auto overflow-auto overscroll-none grow shrink-0">
              <div className="rounded sticky h-[calc(100vh-10rem)] w-full overflow-y-auto overscroll-contain overflow-x-hidden">
                <table className="w-full text-sm text-left text-gray-500 bg-white table-fixed dark:bg-gray-700 dark:text-white">
                  {/* <caption className="sticky top-0 mb-2 text-lg font-semibold text-left text-gray-900 bg-white dark:bg-gray-800 dark:text-white">
                      {className} Attendance
                      <p className="mt-0.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        Student of {className} class
                      </p>
                    </caption> */}
                  <thead className="sticky top-0 z-10 w-full bg-gray-50 dark:bg-gray-500">
                    <tr className="overflow-x-hidden">
                      <th
                        scope="col"
                        className="w-3/6 px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Student Name
                      </th>
                      <th
                        scope="col"
                        className="w-2/6 px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="w-1/6 px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Absent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-hidden divide-y divide-gray-100 dark:divide-gray-600">
                    {studentsInfo.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900 dark:text-gray-50">
                          <div className="w-10 h-10">
                            <img
                              className="object-cover object-center w-full h-full rounded-full"
                              src={`https://ui-avatars.com/api/?name=${data['Student Name']}`}
                              alt={data['Student Name']}
                            />
                          </div>
                          <div className="flex items-center justify-center text-sm">
                            <div className="font-medium text-gray-700 dark:text-gray-50">
                              {data['Student Name']}
                            </div>
                            {/* <div className="text-gray-400">jobs@sailboatui.com</div> */}
                          </div>
                        </th>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-start">
                            <span
                              className={
                                data['Attendance']
                                  ? 'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-600 rounded-full bg-green-50'
                                  : 'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 rounded-full bg-red-50'
                              }
                            >
                              <span
                                className={
                                  data['Attendance']
                                    ? 'animate-custom-pulse ease-in-out duration-300 h-1.5 w-1.5 rounded-full bg-green-600'
                                    : 'animate-custom-pulse ease-in-out duration-300 h-1.5 w-1.5 rounded-full bg-red-600'
                                }
                              ></span>
                              {data['Attendance'] ? 'Attendance' : 'Absent'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-start pl-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={data['Attendance']}
                                onChange={(e) => isAbsent(data['name'], e.target.checked, index)}
                                className="sr-only peer"
                              />
                              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer:ring-none rounded peer dark:hover:bg-gray-800/80 dark:bg-gray-800/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                            {/* <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"


                            /> */}
                            {/*  <label className="sr-only">
                              {'checkbox'}
                            </label> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="rounded grow sticky -mt-0.5 z-10 gap-x-4 w-max px-2 py-0.5 h-6 items-center flex flex-row shrink-0 bottom-0 font-medium bg-gray-50 dark:bg-gray-500">
                    <tr className="h-full text-xs font-medium text-gray-900 dark:text-white">
                      <td>Lesson date: {new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr className="h-full text-xs font-medium text-gray-900 dark:text-white">
                      <td>Total student attendance: {totalAttendance}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end mt-4 gap-x-2">
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                onClick={takeAttendanceSubmit}
                type="submit"
              >
                Done
              </button>
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                onClick={Dismiss}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  )
}

export default ClassAttendance
