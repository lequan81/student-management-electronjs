import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useToggle from '../hooks/useToggle'
import ClassModal from './ClassModal'
import Input from './Input'
import Modal from './Modal'
import Toast from './Toast'

const ClassCard = ({ className, available, deleteClass, classIndex }) => {
  const [visible, setVisible] = useToggle(false)
  const [addStudent, setAddStudent] = useToggle(false)
  const [modalShow, setModalShow] = useToggle(false)
  const [classData] = useState(window.api.store.get('classes'))
  const [members, setMembers] = useState(classData[classIndex]['members'])
  const [students] = useState(classData[classIndex]['students'])
  const [newStudent, setNewStudent] = useState('')
  const [newStudentErr, setNewStudentErr] = useState(false)
  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)

  useRef(() => {}, [classData])
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

  const handleAddStudent = () => {
    setVisible(false)
    setAddStudent(true)
  }

  const handleAddStudentSubmit = () => {
    if (newStudent === '') {
      setNewStudentErr(true)
      setToast('New student information should not be empty', 'warning')
    } else {
      setNewStudentErr(true)
      setAddStudent(false)
      setVisible(true)
      let updatedStudents = students
      updatedStudents.push({
        'Student Name': newStudent,
        Attendance: false
      })
      setMembers(members + 1)
      window.api.store.set(`classes.${classIndex}.students`, students)
      window.api.store.set(`classes.${classIndex}.members`, members + 1)
      window.api.sheets.editStudent('add', className, newStudent)
      setToast(`Add student ${newStudent} successfully`, 'success')
      setNewStudent('')
    }
  }

  const handleAddStudentCancel = () => {
    setAddStudent(false)
    setVisible(true)
    setToast('Add new student cancelled', 'warning')
  }

  const deleteClassHandle = () => {
    setVisible(false)
    setModalShow(true)
  }

  const deleteClassSubmit = () => {
    deleteClass(className)
    window.api.sheets.editClass('remove', { className: className })
    setToast(`Delete class ${className} successfully`, 'success')
    setModalShow(false)
  }

  const deleteClassCancel = () => {
    setModalShow(false)
    setVisible(true)
    setToast('Delete cancelled', 'warning')
  }

  return (
    <>
      {modalShow && (
        <Modal
          type={'error'}
          title={'Delete Class'}
          message={`Are you sure to delete class ${className}?`}
          confirmMessage={'Yes'}
          confirmHandler={deleteClassSubmit}
          cancelMessage={'Cancel'}
          cancelHandler={deleteClassCancel}
        />
      )}
      {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
      {visible && (
        <ClassModal title={'Class Information'} isShow={visible}>
          <div className="flex flex-col w-full space-y-4 md:space-y-6">
            <div className="mt-4">
              <div className="block px-3 py-2 font-semibold text-gray-900 dark:text-white">
                <span> Class name: </span>
                <span className="font-medium"> {className}</span>
              </div>

              <div className="flex flex-row items-center px-3 py-2 space-x-3">
                <div className="block w-6/12 font-semibold text-gray-900 dark:text-white">
                  <span> Number of students: </span>
                  <span className="font-medium">
                    {window.api.store.get(`classes.${classIndex}.members`)}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-end w-6/12 font-semibold text-gray-900 dark:text-white">
                  <button
                    onClick={handleAddStudent}
                    className="h-8 inline-flex w-fit items-center gap-x-2 rounded bg-green-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
                    type="submit"
                  >
                    Add New Student
                  </button>
                </div>
              </div>

              <div className="flex flex-row items-center px-3 py-2 space-x-3">
                <div className="block w-6/12 font-semibold text-gray-900 dark:text-white">
                  <span> Available: </span>
                  <span className="font-medium"> {available}</span>
                </div>
                <div className="flex flex-row items-center justify-end w-6/12 font-semibold text-gray-900 dark:text-white">
                  <Link
                    to={`attendance/${className}/${classIndex}`}
                    className="h-8 inline-flex w-fit items-center gap-x-2 rounded bg-green-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
                    type="submit"
                  >
                    Take Attendance
                  </Link>
                </div>
              </div>

              <div className="block px-3 py-2 font-semibold text-gray-900 dark:text-white">
                <span> Start date: </span>
                <span className="font-medium">
                  {' '}
                  {new Date(
                    window.api.store.get(`classes.${classIndex}.startDate`)
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end mt-4 gap-x-2">
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-red-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                type="button"
                onClick={deleteClassHandle}
              >
                Delete Class
              </button>
              <Link
                to={`edit/${className}/${classIndex}`}
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                type="submit"
              >
                Edit
              </Link>
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                type="button"
                onClick={setVisible}
              >
                Cancel
              </button>
            </div>
          </div>
        </ClassModal>
      )}
      {addStudent && (
        <ClassModal title="Add New Student" isShow={addStudent}>
          <div className="flex flex-col w-full space-y-4 md:space-y-6">
            <div className="mt-4">
              <div className="block px-3 py-2 font-semibold text-gray-900 dark:text-white">
                <span> Class name: </span>
                <span className="font-medium"> {className}</span>
              </div>

              <div className="flex flex-row items-center px-3 py-2 space-x-3">
                <div className="block w-6/12 font-semibold text-gray-900 dark:text-white">
                  <span> Number of students: </span>
                  <span className="font-medium"> {members}</span>
                </div>
              </div>

              <form className="flex flex-row w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-row items-center w-full px-3 py-2 gap-x-2">
                  <Input
                    label="New Student Information"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setNewStudent}
                    value={newStudent}
                    placeholder={''}
                    error={newStudentErr}
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-row items-center justify-end mt-4 gap-x-2">
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                type="submit"
                onClick={handleAddStudentSubmit}
              >
                Add
              </button>
              <button
                className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                type="button"
                onClick={handleAddStudentCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </ClassModal>
      )}
      <button
        onClick={setVisible}
        className="relative flex flex-col items-center p-3 py-6 bg-gray-200 rounded-md shadow-lg dark:bg-gray-900 h-fit group dark:hover:bg-gray-900/70 hover:bg-gray-300 hover:smooth-hover"
      >
        <img
          className="object-cover object-center w-10 h-10 rounded-full sm:w-12 sm:h-12 md:w-16 md:h-16"
          src={`https://ui-avatars.com/api/?name=${className}`}
          alt={className}
        />
        <h4 className="mt-2 text-xl font-bold text-center text-gray-900 capitalize dark:text-white">
          {className}
        </h4>
        <p className="mb-2 text-base font-semibold text-gray-800 dark:text-white/50">
          {members} members
        </p>
        <p className="absolute inline-flex items-center text-xs bottom-1.5 text-gray-800 dark:text-white/50">
          {available} / {members} Online
          <span
            className={
              available > 0
                ? 'block w-2 h-2 ml-2 bg-green-500 rounded-full animate-pulse'
                : 'block w-2 h-2 ml-2 bg-red-500 rounded-full animate-pulse'
            }
          ></span>
        </p>
      </button>
    </>
  )
}

ClassCard.propTypes = {
  className: PropTypes.string,
  available: PropTypes.number,
  startDate: PropTypes.string,
  deleteClass: PropTypes.func,
  classIndex: PropTypes.number
}

export default ClassCard
