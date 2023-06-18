import { CloudArrowUpIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import ClassModal from '../../components/ClassModal'
import Heading from '../../components/Heading'
import Input from '../../components/Input'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import Sidebar from '../../components/Sidebar'
import Toast from '../../components/Toast'
// import data from '../../db/data.json'
import quotesData from '../../db/quotesDatabase.json'
import useToggle from '../../hooks/useToggle'

// https://api.dicebear.com/6.x/initials/svg?seed=Cam+Van

const Settings = () => {
  // eslint-disable-next-line no-irregular-whitespace
  // const PHONE_REGEX = new RegExp(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i)
  const PHONE_REGEX = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)

  let quotes = quotesData.quotes
  const [isUpload, setIsUpload] = useToggle()
  const [editConfig, setEditConfig] = useToggle()
  const [editUserInfo, setEditUserInfo] = useToggle()
  const [editPassword, setEditPassword] = useToggle()
  const [isABout, setIsABout] = useToggle(false)
  const [isChange, setIsChange] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showQuote, setShowQuote] = useToggle(false)
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [editConfigErr, setEditConfigErr] = useState(false)
  const [phoneNumberErr, setPhoneNumberErr] = useState(false)
  const [roleErr, setRoleErr] = useState(false)
  const [addressErr, setAddressErr] = useState(false)
  const [fullnameErr, setFullnameErr] = useState(false)
  const [newPasswordErr, setNewPasswordErr] = useState(false)
  const [repeatedPasswordErr, setRepeatedPasswordErr] = useState(false)

  const [file, setFile] = useState(null)
  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)
  const [isDateTime, setIsDateTime] = useState(
    localStorage.getItem('isDateTime') === 'true' ||
      window.api.store.get('userData.isDateTime') === 'true'
  )
  const [fileDataURL, setFileDataURL] = useState(
    localStorage.getItem('avatar') || window.api.store.get('userData.image')
  )
  const [configId, setConfigId] = useState(
    localStorage.getItem('configId') || window.api.store.get('userData.configId')
  )
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem('phoneNumber') || window.api.store.get('userData.phoneNumber')
  )
  const [role, setRole] = useState(
    localStorage.getItem('role') || window.api.store.get('userData.role')
  )
  const [address, setAddress] = useState(
    localStorage.getItem('address') || window.api.store.get('userData.address')
  )
  const [fullname, setFullname] = useState(
    localStorage.getItem('fullname') || window.api.store.get('userData.fullname')
  )
  const [password, setPassword] = useState(
    localStorage.getItem('password') || window.api.store.get('userData.password')
  )
  const [newPassword, setNewPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')

  useEffect(() => {
    if (
      isUpload === true ||
      editConfig === true ||
      editUserInfo === true ||
      editPassword === true
    ) {
      setIsChange(true)
    } else {
      setIsChange(false)
    }
  }, [isUpload, editConfig, editUserInfo, editPassword, isChange])

  const handleClick = () => {
    // Some Ú òa cho zui =)))
    setClickCount((prevCount) => prevCount + 1)
    if (clickCount === 4) {
      let randomNum = Math.floor(Math.random() * quotes.length)
      let randomQuote = quotes[randomNum]
      setQuote(randomQuote.quote)
      setAuthor(randomQuote.author)
      setShowQuote(true)
      setClickCount(0)
    }
  }

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

  const saveAllSubmit = async () => {
    await setToast('Saving...', 'warning')
      .then(saveAll())
      .catch((err) => setToast(err, 'error'))
  }

  const saveAll = async () => {
    if (isUpload) {
      await saveChange()
    }
    if (editConfig) {
      await handleConfigSubmit()
    }
    if (editUserInfo) {
      await handleUserInfoSubmit()
    }
    if (editPassword) {
      if (newPassword.length === 0 || repeatedPassword.length === 0) {
        await handlePasswordCancel()
        setToast('Password has not changed. All saved', 'success')
      } else {
        await handlePasswordChange()
      }
    }
    // setTimeout(setToast("Save change successfully", "success"), 3100)
  }

  const handleValidate = async (data) => {
    if (data.length < 10) {
      setToast('Please enter a valid phone number', 'warning')
      setPhoneNumberErr(true)
      return false
    }
    if (PHONE_REGEX.test(data)) {
      setPhoneNumberErr(false)
      return true
    } else {
      setToast('Please enter a valid phone number', 'error')
      setPhoneNumberErr(true)
      return false
    }
  }

  const handlePasswordValid = async (newPassword, repeatedPassword) => {
    if (newPassword === 'undefined') {
      setToast('Please enter your new password', 'warning')
      setNewPasswordErr(true)
      return false
    } else if (repeatedPassword === 'undefined') {
      setToast('Please repeat your new password', 'warning')
      setRepeatedPasswordErr(true)
      return false
    } else {
      if (newPassword.length < 8) {
        setToast('Password must have at least 8 characters', 'warning')
        setNewPasswordErr(true)
        return false
      } else {
        if (newPassword !== repeatedPassword) {
          setToast("Passwords don't match", 'error')
          setNewPasswordErr(true)
          setRepeatedPasswordErr(true)
          return false
        } else {
          setNewPasswordErr(false)
          setRepeatedPasswordErr(false)
          return true
        }
      }
    }
  }

  const handleConfigSubmit = async () => {
    try {
      if (configId === '') {
        setEditConfigErr(true)
        setToast('Config ID should not be empty', 'warning')
      } else {
        setEditConfigErr(false)
        localStorage.setItem('configId', configId)
        window.api.store.set('userData.configId', configId)
        setEditConfig(false)
        setToast('Save change successfully', 'success')
      }
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const handleConfigCancel = async () => {
    try {
      setConfigId(localStorage.getItem('configId') || window.api.store.get('userData.configId'))
      setEditConfigErr(false)
      setEditConfig(false)
      setToast('Change cancelled', 'warning')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const isDateTimeSubmit = async (e) => {
    try {
      setIsDateTime(e.target.checked)
      localStorage.setItem('isDateTime', e.target.checked)
      window.api.store.set('userData.isDateTime', e.target.checked)
      setToast('Update successfully', 'success')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const handleUserInfoSubmit = async () => {
    let isValid
    try {
      isValid = await handleValidate(phoneNumber)
    } catch (err) {
      console.error(err)
    }
    if (isValid) {
      try {
        if (fullname === '' || fullname === undefined) {
          setFullnameErr(true)
          setToast('Fullname should not be empty', 'warning')
        } else if (role === '' || role === undefined) {
          setRoleErr(true)
          setToast('Role should not be empty', 'warning')
        } else if (address === '' || address === undefined) {
          setAddressErr(true)
          setToast('Address should not be empty', 'warning')
        } else {
          setFullnameErr(false)
          setRoleErr(false)
          setAddressErr(false)
          localStorage.setItem('fullname', fullname)
          localStorage.setItem('phoneNumber', phoneNumber)
          localStorage.setItem('role', role)
          localStorage.setItem('address', address)
          window.api.store.set('userData.fullname', fullname)
          window.api.store.set('userData.phoneNumber', phoneNumber)
          window.api.store.set('userData.role', role)
          window.api.store.set('userData.address', address)
          setEditUserInfo(false)
          setToast('Update information successfully', 'success')
        }
      } catch (err) {
        setToast(err, 'error')
      }
    }
  }

  const handleUserInfoCancel = async () => {
    try {
      setFullnameErr(false)
      setRoleErr(false)
      setAddressErr(false)
      setPhoneNumberErr(false)
      setFullname(localStorage.getItem('fullname') || window.api.store.get('userData.fullname'))
      setRole(localStorage.getItem('role') || window.api.store.get('userData.role'))
      setPhoneNumber(
        localStorage.getItem('phoneNumber') || window.api.store.get('userData.phoneNumber')
      )
      setAddress(localStorage.getItem('address') || window.api.store.get('userData.address'))
      setEditUserInfo(false)
      setToast('Change cancelled', 'warning')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const handlePasswordChange = async () => {
    let isValid
    try {
      isValid = await handlePasswordValid(newPassword, repeatedPassword)
    } catch (err) {
      console.error(err)
    }
    if (isValid) {
      try {
        localStorage.setItem('password', newPassword)
        window.api.store.set('userData.password', newPassword)
        setPassword(newPassword)
        setNewPassword('')
        setRepeatedPassword('')
        setEditPassword()
        setToast('Update password successfully', 'success')
      } catch (err) {
        setToast(err, 'error')
      }
    }
  }

  const handlePasswordCancel = async () => {
    try {
      setPassword(localStorage.getItem('password') || window.api.store.get('userData.password'))
      setEditPassword()
      setToast('Change cancelled', 'warning')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const changeHandler = async (e) => {
    const file = e.target.files[0]
    if (!file.type.match(/image\/(png|jpg|jpeg)/i)) {
      console.error('Image mime type is not valid')
      setToast('Image type is not valid', 'error')
      return
    } else if (file.size > 10500000) {
      console.log('File size is too large! Max 10MB')
      setToast('File size is too large! Max 10MB', 'error')
      return
    } else {
      try {
        setFile(file)
        setToast('Upload file successfully', 'success')
      } catch (err) {
        setToast(err, 'error')
      }
    }
  }

  const saveChange = async () => {
    try {
      setFile(file)
      setFileDataURL(fileDataURL)
      localStorage.setItem('avatar', fileDataURL)
      window.api.store.set('userData.image', fileDataURL)
      setIsUpload(false)
      setToast('Save change successfully', 'success')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  const cancelHandle = async () => {
    try {
      setFile(file)
      setFileDataURL(localStorage.getItem('avatar') || window.api.store.get('userData.image'))
      setIsUpload(false)
      setToast('Change cancelled', 'warning')
    } catch (err) {
      setToast(err, 'error')
    }
  }

  useEffect(() => {
    let fileReader,
      isCancel = false
    if (file) {
      fileReader = new FileReader()
      fileReader.onload = (e) => {
        const { result } = e.target
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file)
    }
    return () => {
      isCancel = true
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort()
      }
    }
  }, [file])

  return (
    <>
      <div className="flex flex-col min-h-screen md:flex-row">
        <div className="flex w-full h-12 border-4 border-white md:min-h-screen md:w-16 lg:min-h-screen lg:w-48">
          <Sidebar isClock={isDateTime} />
        </div>
        {/* https://stackoverflow.com/questions/63412303/how-to-make-div-fill-full-height-of-parent-in-tailwind */}
        <div className="flex flex-col flex-1 min-h-screen -mt-12 bg-gray-50 dark:bg-gray-900 overscroll-none md:-mt-0 lg:-mt-0 grow">
          <Heading
            title="Settings"
            isSearch={false}
            rightButton={
              isChange === true && (
                <button
                  onClick={saveAllSubmit}
                  type="submit"
                  className="inline-flex items-center h-8 px-2.5 py-2 font-medium text-center text-white bg-green-700 rounded text-sm hover:bg-green-800 ring-none focus:outline-none dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <CloudArrowUpIcon
                    className="hidden w-6 h-6 mr-0 font-semibold text-white md:w-5 md:h-5 md:inline lg:inline md:mr-2 lg:md-2"
                    strokeWidth={2}
                  />
                  <span className="inline">Save All</span>
                </button>
              )
            }
          />

          <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 overscroll-none grow">
            {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
            <div className="w-full px-4 pb-4 rounded mt-0.5 lg:mt-4">
              <div className="h-full p-2 bg-white rounded-md dark:bg-gray-800">
                <div className="flex-col gap-y-4">
                  {isABout && (
                    <ClassModal title={'App Information'} isShow={isABout}>
                      <div className="flex flex-col w-full space-y-4 md:space-y-6">
                        <div className="w-full bg-gray-800 rounded-md h-fit">
                          <div className="flex flex-col w-full h-full p-3">
                            {/* <span className="text-xl font-bold text-white">App Infomation</span> */}
                            <div className="flex flex-col items-start justify-start w-full mt-3 md:w-full lg:w-3/4">
                              <span className="text-base font-medium text-white">
                                App version: {window.api.info.env()['npm_package_version']}
                              </span>
                              <span className="text-base font-medium text-white">
                                Date created: 03/06/2023
                              </span>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full mt-3 md:w-full lg:w-3/4">
                              <span className="text-base font-medium text-white">
                                Author: {window.api.info.env()['npm_package_author_name']}
                              </span>
                              <span className="text-base font-medium text-white">
                                Email: lequanruby@gmail.com
                              </span>
                              <a
                                href="https://github.com/lequan81/"
                                className="text-base font-medium text-white cursor-pointer hover:text-blue-400"
                              >
                                Github: lequan81
                              </a>
                            </div>
                            <div className="flex flex-col items-start justify-start w-full mt-3 md:w-full lg:w-3/4">
                              <a
                                href="https://icons8.com"
                                className="text-base font-medium text-white cursor-pointer hover:text-blue-400"
                              >
                                App Logos by icons8
                              </a>
                              <a
                                href="https://icons8.com/icons/set/microsoft-launcher"
                                className="text-base font-medium text-white cursor-pointer hover:text-blue-400"
                              >
                                Microsoft Launcher icon by Icons8
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center justify-end mt-2 gap-x-2">
                          <button
                            className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                            type="button"
                            onClick={setIsABout}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </ClassModal>
                  )}
                  {showQuote && (
                    <ClassModal title={''} isShow={showQuote}>
                      <div className="flex flex-col w-full space-y-4 md:space-y-6">
                        <div className="w-full bg-gray-800 rounded-md h-fit">
                          <figure className="max-w-screen-md mx-auto text-center">
                            <svg
                              aria-hidden="true"
                              className="w-8 h-8 mx-auto mb-1.5 text-gray-400 dark:text-gray-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                                fill="currentColor"
                              />
                            </svg>
                            <blockquote>
                              <p className="text-xl italic font-medium text-gray-900 dark:text-white">
                                {quote}
                              </p>
                            </blockquote>
                            <figcaption className="flex items-center justify-center mt-4">
                              <div className="flex items-center">
                                <cite className="font-medium text-center text-gray-900 text-md dark:text-white/50">
                                  {author}
                                </cite>
                              </div>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="flex flex-row items-center justify-end mt-4 gap-x-2">
                          <button
                            className="h-8 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                            type="button"
                            onClick={setShowQuote}
                          >
                            {"I'm feeling lucky!"}
                          </button>
                        </div>
                      </div>
                    </ClassModal>
                  )}
                  <div className="w-full bg-white rounded-md dark:bg-gray-800 h-fit">
                    <div className="flex flex-col w-full h-full p-3">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        User Information
                      </span>
                      <div className="flex flex-col w-full lg:flex-row md:flex-col gap-x-6">
                        <div className="items-center mt-4 md:w-2/3 lg:w-3/5">
                          <div className="w-full bg-white rounded-md dark:bg-gray-800 h-fit">
                            <div className="flex flex-row w-full h-full grow">
                              {isUpload ? (
                                <div className="flex flex-row w-full">
                                  <div className="items-center p-3 h-36 w-36">
                                    {fileDataURL ? (
                                      <img
                                        className="object-cover w-full h-full rounded"
                                        src={fileDataURL}
                                        alt="preview"
                                      />
                                    ) : (
                                      <img
                                        className="object-cover w-full h-full rounded"
                                        src={`https://ui-avatars.com/api/?name=${fullname}`}
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col justify-center my-auto w-fit h-max">
                                    <label
                                      className="block -mt-2 text-xl font-bold text-gray-900 dark:text-white"
                                      htmlFor="file_input"
                                    >
                                      Upload file
                                    </label>
                                    <input
                                      type="file"
                                      lang="en"
                                      accept=".png, .jpg, .jpeg"
                                      onChange={changeHandler}
                                      className=" mt-1.5 block w-full text-sm text-slate-500 file:mr-4 file:p-1.5 file:rounded file:border-0 file:text-sm file:font-semibold dark:file:bg-gray-600 dark:hover:file:bg-gray-700 dark:file:text-white file:bg-gray-100 file:text-blue-700 hover:file:bg-gray-200"
                                    />
                                    <span className="mt-1 text-xs text-gray-800 dark:text-white/50">
                                      PNG, JPEG or JPG (MAX 10MB)
                                    </span>
                                    <div className="flex flex-row gap-x-2">
                                      <button
                                        onClick={cancelHandle}
                                        type="button"
                                        className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={saveChange}
                                        type="button"
                                        className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                      >
                                        Save Change
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-row w-full">
                                  <div className="items-center p-3 h-36 w-36">
                                    <img
                                      onClick={handleClick}
                                      className="object-cover w-full h-full rounded-md"
                                      src={fileDataURL}
                                      alt="avatar"
                                    />
                                  </div>
                                  <div className="flex flex-col justify-center my-auto w-fit h-max">
                                    <span className="-mt-2 text-xl font-bold text-gray-900 dark:text-white">
                                      {fullname}
                                    </span>
                                    <span className="text-gray-800 text-md dark:text-white/50">
                                      {role}
                                    </span>
                                    <button
                                      onClick={setIsUpload}
                                      type="button"
                                      className="mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                      <CloudArrowUpIcon className="items-center justify-center w-5 h-5 font-bold" />
                                      Change picture
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start w-full lg:w-4/5">
                          <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-row w-full mb-2 grow gap-x-4"
                          >
                            <div className="flex flex-col w-1/2">
                              <div className="w-full mb-3">
                                <Input
                                  label="Full-name"
                                  isEdit={editUserInfo}
                                  value={fullname}
                                  onChangeHandler={setFullname}
                                  error={fullnameErr}
                                />
                              </div>
                              <div className="w-full">
                                <Input
                                  label="Address"
                                  isEdit={editUserInfo}
                                  value={address}
                                  onChangeHandler={setAddress}
                                  error={addressErr}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col w-1/2">
                              <div className="w-full mb-3">
                                <Input
                                  label="Phone number"
                                  isEdit={editUserInfo}
                                  value={phoneNumber}
                                  onChangeHandler={setPhoneNumber}
                                  error={phoneNumberErr}
                                />
                              </div>
                              <div className="w-full">
                                <Input
                                  label="Role"
                                  isEdit={editUserInfo}
                                  value={role}
                                  onChangeHandler={setRole}
                                  error={roleErr}
                                />
                              </div>
                            </div>
                          </form>
                          <div className="flex flex-row mt-1 gap-x-2">
                            {editUserInfo ? (
                              <>
                                <button
                                  onClick={handleUserInfoCancel}
                                  type="submit"
                                  className="h-8 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleUserInfoSubmit}
                                  type="submit"
                                  className="h-8 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                >
                                  Save Change
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={setEditUserInfo}
                                type="submit"
                                className="inline-flex items-center h-8 px-2.5 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded w-fit gap-x-2 hover:bg-blue-700"
                              >
                                <PencilSquareIcon className="items-center justify-center w-5 h-5 font-bold" />
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-md dark:bg-gray-800 h-fit">
                    <div className="flex flex-col w-full h-full p-3">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Password information
                      </span>
                      <form
                        className="flex flex-col mt-2 gap-x-3"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="flex flex-col w-2/3">
                          <div className="w-full mb-3">
                            <Input
                              label="Current password"
                              isEdit={editPassword}
                              value={password}
                              type={editPassword ? 'text' : 'password'}
                              placeholder={editPassword ? '' : '••••••••'}
                              error={false}
                              readOnly={true}
                              disabled={true}
                            />
                          </div>
                          <div className="w-full mb-4">
                            <Input
                              label="New password"
                              isEdit={editPassword}
                              onChangeHandler={setNewPassword}
                              value={newPassword}
                              placeholder={newPassword}
                              error={newPasswordErr}
                            />
                          </div>
                          <div className="w-full mb-3">
                            <Input
                              label="New password"
                              isEdit={editPassword}
                              onChangeHandler={setRepeatedPassword}
                              value={repeatedPassword}
                              error={repeatedPasswordErr}
                            />
                          </div>
                          <div className="flex flex-row w-full gap-x-2">
                            <div className="flex grow gap-x-2">
                              {editPassword ? (
                                <>
                                  <button
                                    onClick={handlePasswordCancel}
                                    type="submit"
                                    className="h-8 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handlePasswordChange}
                                    type="submit"
                                    className="h-8 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                  >
                                    Save Change
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={setEditPassword}
                                  type="submit"
                                  className="inline-flex items-center h-8 px-2.5 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded w-fit gap-x-2 hover:bg-blue-700"
                                >
                                  <PencilSquareIcon className="items-center justify-center w-5 h-5 font-bold" />
                                  Edit
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col items-end w-fit grow-0">
                              <span className="text-sm font-semibold text-white">
                                Password requirements
                              </span>
                              <span className="pl-2 text-xs font-normal text-md text-white/50">
                                At least 8 characters
                              </span>
                              {/* <span className="pl-2 text-sm font-normal text-white/50"> At least one lowercase character </span> */}
                              {/* <span className="pl-2 text-sm font-normal text-white/50"> Inclusion of at least one special character, e.g., ! @ # ?</span> */}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-md dark:bg-gray-800 h-fit">
                    <div className="flex flex-col w-full h-full p-3">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Advanced Settings
                      </span>
                      <div className="flex flex-row items-center justify-start w-full md:w-full lg:w-3/4">
                        <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
                          <div className="w-3/4 p-3 md:w-1/2 lg:w-1/2">
                            <Input
                              label="Spreadsheet share URL"
                              isEdit={editConfig}
                              onChangeHandler={setConfigId}
                              value={configId}
                              error={editConfigErr}
                            />
                          </div>
                          <div className="flex flex-row items-end gap-x-2 p-3.5">
                            {editConfig ? (
                              <>
                                <button
                                  onClick={handleConfigCancel}
                                  type="submit"
                                  className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded dark:bg-transparent/10 bg-gray-500 border-gray-500/50 dark:border-gray-700/50 border-2 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleConfigSubmit}
                                  type="submit"
                                  className="h-8 mt-2.5 inline-flex w-fit items-center gap-x-2 rounded bg-blue-600 px-2.5 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                                >
                                  Save Change
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={setEditConfig}
                                type="submit"
                                className="inline-flex items-center h-8 px-2.5 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded w-fit gap-x-2 hover:bg-blue-700"
                              >
                                <PencilSquareIcon className="items-center justify-center w-5 h-5 font-bold" />
                                Edit
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                      <div className="flex flex-row items-center justify-start w-full md:w-full lg:w-3/4">
                        <form
                          className="flex flex-col w-full gap-y-2"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <div className="md:w-1/2 lg:w-1/2 w-3/4 px-3.5">
                            <div className="flex flex-col gap-y-2">
                              <span className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                Appearance Settings
                              </span>
                              <label className="relative inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isDateTime ? true : false}
                                  onChange={isDateTimeSubmit}
                                  className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer:ring-none rounded peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-xs font-medium text-gray-900 dark:text-white">
                                  Date & Time
                                </span>
                              </label>
                            </div>
                          </div>
                          {/* <div className="md:w-1/2 lg:w-1/2 w-3/4 px-3.5">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer:ring-none rounded-md peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-md after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              <span className="ml-3 text-base font-medium text-gray-900 dark:text-white">Branding</span>
                            </label>
                          </div> */}
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-md dark:bg-gray-800 h-fit">
                    <div className="flex flex-col items-start justify-start w-full h-full px-6 mt-4">
                      <button
                        onClick={setIsABout}
                        className="text-sm font-medium text-blue-500 cursor-pointer"
                      >
                        About
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
