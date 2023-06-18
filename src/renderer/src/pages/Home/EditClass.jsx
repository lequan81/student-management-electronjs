import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'sassy-datepicker'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import Toast from '../../components/Toast'
// import data from '../../db/data.json'
import useToggle from '../../hooks/useToggle'

const EditClass = () => {
  let { className, classIndex } = useParams()
  const [visible, setVisible] = useToggle()
  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)
  const [classData] = useState(window.api.store.get('classes'))
  const [state, setState] = useState({
    newClassName: className,
    lessons: classData[classIndex]['totalLesson'],
    startDate: classData[classIndex]['startDate'],
    students: classData[classIndex]['students']
  })
  let { newClassName, lessons, startDate, students } = state
  const [studentsInfo, setStudentsInfo] = useState(students)
  const [newStudentName, setNewStudentName] = useState('')
  const [members, setMembers] = useState(classData[classIndex]['members'])
  const [date, setDate] = useState(new Date(startDate))
  const handleChange = useCallback(({ target: { name, value } }) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }, [])

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

  const onChange = (newDate) => {
    setDate(newDate)
    setVisible(false)
  }

  const Dismiss = () => {
    window.history.go(-1)
    /*same as function
     *history.back() */
  }

  const addStudent = async () => {
    if (newStudentName !== '') {
      let updatedStudent = studentsInfo
      updatedStudent.push({
        'Student Name': newStudentName,
        Attendance: false
      })
      setStudentsInfo(updatedStudent)
      setMembers(members + 1)
      window.api.store.set(`classes.${classIndex}.students`, updatedStudent)
      window.api.store.set(`classes.${classIndex}.members`, members + 1)
      window.api.sheets.editStudent('add', className, newStudentName)
      setToast(`Add student ${newStudentName} successfully`, 'success')
      setNewStudentName('')
    } else {
      setToast(`Please enter a name for new student`, 'warning')
    }
  }

  const removeStudent = (removeName) => {
    const updatedList = studentsInfo.filter((student) => {
      return student['Student Name'] !== removeName
    })
    setStudentsInfo(updatedList)
    setMembers(members - 1)
    window.api.store.set(`classes.${classIndex}.students`, updatedList)
    window.api.store.set(`classes.${classIndex}.members`, members - 1)
    window.api.sheets.editStudent('remove', className, removeName)
    setToast(`Remove student ${removeName} successfully`, 'success')
  }

  const editSubmit = async () => {
    window.api.sheets.editClass('update', {
      className: className,
      newClassName: newClassName,
      members: Number(members),
      totalLesson: Number(lessons),
      startDate: date.toLocaleDateString('en-CA')
    })
    Dismiss()
  }

  return (
    <>
      {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
      <div className="flex min-h-screen bg-white dark:bg-gray-800 overscroll-none">
        <div className="flex flex-col w-full px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-xl font-bold text-center text-black dark:text-white">
            {'Edit class ' + className}
          </h3>
          <div className="flex grow">
            <form
              onSubmit={(e) => e.preventDefault()}
              action=""
              className="flex flex-col items-center w-full space-y-4 grow md:space-y-6"
              id="editClass"
            >
              <div className="flex flex-col w-full h-full max-w-2xl px-3 py-2 mt-3">
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-900 dark:text-white"
                    htmlFor="newClassName"
                  >
                    Class Name (*)
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    placeholder={newClassName}
                    onChange={handleChange}
                    name="newClassName"
                    required
                    id="newClassName"
                    className="mt-2 w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                  />
                </div>

                <div className="flex flex-row space-x-3">
                  <div className="flex flex-col items-start w-6/12 mt-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Number of students (*)
                    </label>
                    <input
                      type="text"
                      value={members}
                      onChange={(e) => setMembers(e.target.value)}
                      placeholder={members}
                      name="members"
                      required
                      id="members"
                      className="mt-2 w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                    />
                  </div>
                  <div className="flex flex-col items-start w-6/12 mt-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Number of lessons (*)
                    </label>
                    <input
                      type="text"
                      value={lessons}
                      onChange={handleChange}
                      placeholder={lessons}
                      name="lessons"
                      required
                      id="lessons"
                      className="mt-2 w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex flex-row space-x-3">
                  <div className="flex flex-col items-start w-5/12 mt-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Date start
                    </label>
                    <div className="relative flex flex-row w-full">
                      <input
                        type="date"
                        readOnly
                        value={date.toLocaleDateString('en-CA')}
                        // onChange={(e) => onSetDate(e.target.value)}
                        className="mt-2 w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                      />
                      {visible && (
                        <DatePicker
                          value={date}
                          onChange={onChange}
                          // minDate={new Date()}
                          weekStartsFrom="Monday"
                          className="fixed z-40 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        />
                      )}
                      <button
                        onClick={setVisible}
                        type="button"
                        className="absolute right-0 flex p-2 mt-2 text-base text-gray-400"
                      >
                        <CalendarDaysIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-x-2 grow overscroll-none">
                  <div className="mt-4">
                    <label className="block font-semibold text-gray-900 dark:text-white">
                      List of students
                    </label>

                    {studentsInfo.map((data, index) => (
                      <div key={index} className="flex flex-row mt-2">
                        <div className="flex flex-row items-center justify-center w-10/12 h-12">
                          <input
                            type="text"
                            placeholder={data['Student Name']}
                            value={data['Student Name']}
                            readOnly
                            required
                            className="cursor-default w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                          />
                        </div>
                        <div className="flex flex-row items-center justify-start w-2/12 h-12 pl-2">
                          <button
                            type="button"
                            onClick={() => removeStudent(data['Student Name'])}
                            className="px-2 py-1 text-white border-2 rounded h-fit w-fit border-gray-700/50 bg-transparent/10 hover:bg-gray-700"
                          >
                            Remove
                          </button>
                          {/* <button type="button" onClick={() => removeStudent(data['name'])} className="px-2 py-1 text-white border-2 rounded h-fit w-fit border-gray-700/50 bg-transparent/10 hover:bg-gray-700">
                            Remove
                          </button> */}
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-row mt-2">
                      <div className="flex flex-row items-center justify-center w-10/12 h-12">
                        <input
                          type="text"
                          placeholder="John Doe"
                          name="newStudentName"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="w-full rounded border border-gray-300 bg-gray-50 p-1.5 font-normal text-gray-900 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:dark:border-blue-600"
                        />
                      </div>
                      <div className="flex flex-row items-center justify-start w-2/12 h-12 pl-2 gap-x-2">
                        <button
                          onClick={addStudent}
                          type="button"
                          className="inline-flex items-center h-8 px-2 py-1 text-sm font-medium text-center text-white bg-green-600 rounded w-fit gap-x-2 hover:bg-green-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </button>
                        {/* <button type="button" className="px-2 py-1 text-white bg-red-600 rounded h-fit w-fit hover:bg-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-row items-center justify-end mt-4 gap-x-2 mr-14">
            <button
              className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              onClick={editSubmit}
              type="submit"
            >
              Save
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
        <ScrollToTopButton />
      </div>
    </>
  )
}

export default EditClass
