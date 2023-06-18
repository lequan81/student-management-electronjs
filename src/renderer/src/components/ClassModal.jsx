import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { useState } from 'react'
import DatePicker from 'sassy-datepicker'
import useToggle from '../hooks/useToggle'
import Input from './Input'
import Toast from './Toast'

const ClassModal = ({ children, title, isShow, dismiss, submitButton = title }) => {
  const [date, setDate] = useState(new Date())
  const [className, setClassName] = useState('')
  const [members, setMembers] = useState(Number)
  const [lessons, setLessons] = useState(Number)
  const [classes] = useState(window.api.store.get('classes'))
  const [visible, setVisible] = useToggle()
  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)
  const [classNameErr, setClassNameErr] = useState(false)
  const [membersErr, setMembersErr] = useState(false)
  const [lessonsErr, setLessonsErr] = useState(false)

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
    // console.log(`New date selected - ${newDate.toLocaleDateString('en-CA')}`)
    setDate(newDate)
    setVisible(false)
  }

  const addClassSubmit = async (e) => {
    e.preventDefault()
    if (className === undefined || className === '') {
      setClassNameErr(true)
      setToast('New class name should not be empty', 'warning')
    } else if (members <= 0 || members === undefined || members === '') {
      setMembersErr(true)
      setClassNameErr(false)
      setLessonsErr(false)
      setToast('Number of students should not be empty, equal or lower than 0', 'warning')
    } else if (lessons <= 0 || lessons === undefined || lessons === '') {
      setLessonsErr(true)
      setClassNameErr(false)
      setMembersErr(false)
      setToast('Number of lessons should not be empty, equal or lower than 0', 'warning')
    } else {
      setClassNameErr(false)
      setMembersErr(false)
      setLessonsErr(false)
      let upadtedClasses = classes
      upadtedClasses.push({
        className: className,
        totalLesson: Number(lessons),
        startDate: date.toLocaleDateString('en-CA'),
        members: Number(members),
        available: 0,
        students: []
      })
      // console.log(upadtedClasses)
      window.api.store.set('classes', upadtedClasses)
      window.api.sheets.editClass('add', {
        className: className,
        totalLesson: Number(lessons),
        members: Number(members),
        startDate: date.toLocaleDateString('vi-VN'),
        status: 'create'
      })
      // console.table(className, members, lessons)
      setToast('Add class successfully', 'success')
      setTimeout(() => {
        dismiss()
      }, 3050)
    }
  }

  const addClassCancel = async (e) => {
    e.preventDefault()
    setClassNameErr(false)
    setMembersErr(false)
    setLessonsErr(false)
    setToast('Add new class cancelled', 'warning')
    setTimeout(() => {
      dismiss()
    }, 3050)
  }

  return (
    <>
      {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
      <div className={isShow ? 'relative z-30' : 'hidden'}>
        <div className="fixed inset-0 transition-opacity bg-gray-300 dark:bg-gray-600 bg-opacity-90"></div>
        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-xl">
              <div className="px-4 pt-5 pb-4 bg-gray-50 dark:bg-gray-800 sm:p-5 sm:pb-3">
                <h3 className="text-xl font-bold text-center text-black dark:text-white">
                  {title}
                </h3>
                {children === undefined ? (
                  <>
                    <form
                      onSubmit={addClassSubmit}
                      action=""
                      className="flex flex-col w-full space-y-4 md:space-y-6"
                      id="login-form"
                    >
                      <div className="mt-3">
                        <div className="w-full pr-4">
                          <Input
                            label="Class name (*)"
                            isEdit={true}
                            readOnly={false}
                            disabled={false}
                            onChangeHandler={setClassName}
                            value={className}
                            placeholder={'SSG104'}
                            error={classNameErr}
                          />
                        </div>
                        <div className="flex flex-row space-x-3">
                          <div className="flex flex-col items-start w-6/12 mt-3">
                            <Input
                              label="Number of students (*)"
                              isEdit={true}
                              readOnly={false}
                              disabled={false}
                              onChangeHandler={setMembers}
                              value={members.toString()}
                              placeholder={'30'}
                              error={membersErr}
                            />
                          </div>
                          <div className="flex flex-col items-start w-6/12 mt-3">
                            <Input
                              label="Number of lessons (*)"
                              isEdit={true}
                              readOnly={false}
                              disabled={false}
                              onChangeHandler={setLessons}
                              value={lessons.toString()}
                              placeholder={'12'}
                              error={lessonsErr}
                            />
                          </div>
                        </div>

                        <div className="flex flex-row space-x-3">
                          <div className="flex flex-col items-start w-5/12 mt-3">
                            <label className="block font-semibold text-gray-900 dark:text-white">
                              Date start
                            </label>
                            <div className="relative flex flex-row w-full">
                              <input
                                type="date"
                                readOnly
                                value={date.toLocaleDateString('en-CA')}
                                // onChange={(e) => onSetDate(e.target.value)}
                                className="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              />
                              {visible && (
                                <DatePicker
                                  value={date}
                                  onChange={onChange}
                                  minDate={new Date()}
                                  weekStartsFrom="Monday"
                                  className="fixed z-40 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                />
                              )}
                              <div className="relative">
                                <button
                                  onClick={setVisible}
                                  type="button"
                                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-base text-gray-400 bg-transparent"
                                >
                                  <CalendarDaysIcon className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-end mt-4 gap-x-2">
                        <button
                          className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                          type="submit"
                        >
                          {submitButton}
                        </button>
                        <button
                          className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                          type="button"
                          onClick={addClassCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  children
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ClassModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  submitButton: PropTypes.string,
  isShow: PropTypes.bool,
  dismiss: PropTypes.func
}

export default ClassModal
