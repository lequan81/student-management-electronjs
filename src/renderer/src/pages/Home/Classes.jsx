import { PlusIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'
import ClassCard from '../../components/ClassCard'
import ClassModal from '../../components/ClassModal'
import Heading from '../../components/Heading'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import Sidebar from '../../components/Sidebar'
import useToggle from '../../hooks/useToggle'
// import data from '../../db/data.json'
// import useFetch from '../../hooks/useFetch'

const Classes = () => {
  let [classesList, setClassesList] = useState(window.api.store.get('classes'))
  const [showAddModal, setShowAddModal] = useToggle(false)
  const [isNotFound, setIsNotFound] = useState(false)
  let [isClock] = useState(
    localStorage.getItem('isDateTime') === 'true' ||
      window.api.store.get('userData.isDateTime') === 'true'
  )

  useRef(() => {}, [isClock, classesList, isNotFound])

  const dismissAddClass = () => {
    setClassesList(window.api.store.get('classes'))
    setShowAddModal()
  }

  const filterBySearch = (event) => {
    const query = event.target.value
    if (query !== '') {
      let updatedList = classesList.filter((classData) => {
        // return classData['className'].toLowerCase().includes(query.toLowerCase())
        return classData['className'].toLowerCase().includes(query.toLowerCase())
      })
      setClassesList(updatedList)
      setIsNotFound(updatedList.length === 0) // if new updatedClass return empty array, then class is not exist!
    } else {
      setClassesList(window.api.store.get('classes'))
      setIsNotFound(false)
    }
  }

  const deleteClass = (deleteClassName) => {
    const updatedList = classesList.filter((classData) => {
      return classData['className'] !== deleteClassName
    })
    setClassesList(updatedList)
    window.api.store.set('classes', updatedList)
  }

  return (
    <>
      {showAddModal && (
        <ClassModal title="Add New Class" isShow={showAddModal} dismiss={dismissAddClass} />
      )}
      {/* https://stackoverflow.com/questions/69833361/tailwindcss-set-flex-child-width-to-fill-up-whole-parent-width */}
      <div className="flex flex-col min-h-screen md:flex-row">
        <div className="flex w-full h-12 border-4 border-white md:min-h-screen md:w-16 lg:min-h-screen lg:w-44">
          <Sidebar isClock={isClock} />
        </div>
        {/* https://stackoverflow.com/questions/63412303/how-to-make-div-fill-full-height-of-parent-in-tailwind */}
        <div className="flex flex-col flex-1 min-h-screen -mt-16 bg-gray-50 dark:bg-gray-900 md:-mt-0 lg:-mt-0 grow">
          <Heading
            title="Classes"
            searchPlaceholder="Search"
            isSearch={!showAddModal}
            onChange={filterBySearch}
            rightButton={
              showAddModal === false && (
                <button
                  onClick={setShowAddModal}
                  type="button"
                  className="inline-flex items-center h-8 px-2.5 py-2 text-sm font-medium text-center text-white bg-green-700 rounded hover:bg-green-800 ring-none focus:outline-none dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <PlusIcon
                    className="inline w-6 h-6 mr-0 font-semibold text-white md:h-5 md:w-5 md:mr-2 lg:mr-2"
                    strokeWidth={2}
                  />
                  <span className="hidden md:inline lg:inline">New Class</span>
                </button>
              )
            }
          />
          <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 grow overscroll-none">
            <div className="w-full px-4 pb-4 rounded mt-0.5 lg:mt-4">
              <div className="h-full p-4 bg-white rounded-md dark:bg-gray-800">
                {classesList.length === 0 ? (
                  isNotFound ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="flex flex-col items-center w-full max-w-md p-6 mx-auto text-center text-blue-500 bg-white rounded-lg dark:bg-gray-800">
                        <div className="grid h-full px-4 place-content-center">
                          <h1 className="text-3xl font-bold tracking-wide text-gray-800 uppercase dark:text-white">
                            404 | Not Found
                          </h1>
                        </div>
                        <p className="mt-4 tracking-wide text-gray-700 dark:text-white">
                          {'Sorry, I am not a detective 🥹'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="flex flex-col items-center w-full max-w-md p-6 mx-auto text-center text-blue-500 bg-gray-200 border-2 border-gray-500 border-dashed rounded-lg dark:bg-gray-700/30">
                        <button
                          onClick={setShowAddModal}
                          className="inline-flex items-center h-8 px-2.5 py-2 text-sm font-medium text-center text-white bg-green-700 rounded hover:bg-green-800 ring-none focus:outline-none dark:bg-green-600 dark:hover:bg-green-700"
                        >
                          <PlusIcon
                            className="inline w-5 h-5 mr-0 font-semibold text-white md:mr-2 lg:md-2"
                            strokeWidth={2}
                          />
                          <span className="hidden md:inline lg:inline">New class</span>
                        </button>
                        <p className="mt-4 tracking-wide text-gray-700 dark:text-white">
                          {"You haven't created any class yet"}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {classesList.map((item, index) => (
                      <ClassCard
                        key={index}
                        classIndex={index}
                        className={item['className']}
                        available={item['available']}
                        deleteClass={deleteClass}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </>
  )
}

export default Classes
