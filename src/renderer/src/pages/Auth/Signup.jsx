import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import icon from '../../assets/icon.png'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import Toast from '../../components/Toast'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useToggle from '../../hooks/useToggle'

const Signup = () => {
  useDocumentTitle('Signup') //*change title of the app
  const PHONE_REGEX = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)

  const [phoneNumberErr, setPhoneNumberErr] = useState(false)
  const [usernameErr, setUsernameErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [repeatedPasswordErr, setRepeatedPasswordErr] = useState(false)
  const [fullnameErr, setFullnameErr] = useState(false)
  const [passwordType, setPasswordType] = useToggle()

  const [modalShow, setModalShow] = useState(false)
  const [toastShow, setToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('Teacher')
  const [address, setAddress] = useState('Ho Chi Minh City, Vietnam')
  const [fullname, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fullname === 'undefined' || fullname === '') {
      setToast('Please enter your fullname', 'warning')
      setFullnameErr(true)
      setUsernameErr(false)
      setPasswordErr(false)
      setRepeatedPasswordErr(false)
      setPhoneNumberErr(false)
      return false
    } else if (username === 'undefined' || username === '') {
      setToast('Please enter your username', 'warning')
      setUsernameErr(true)
      setFullnameErr(false)
      setPasswordErr(false)
      setRepeatedPasswordErr(false)
      setPhoneNumberErr(false)
      return false
    } else {
      let isValid = await handlePasswordValid(password, repeatedPassword)
      if (isValid) {
        let phoneNumberValid = await handleValidate(phoneNumber)
        if (phoneNumberValid) {
          setFullnameErr(false)
          setUsernameErr(false)
          setPasswordErr(false)
          setRepeatedPasswordErr(false)
          setPhoneNumberErr(false)
          window.api.store.set('userData.fullname', fullname)
          window.api.store.set('userData.username', username)
          window.api.store.set('userData.password', password)
          window.api.store.set('userData.phoneNumber', phoneNumber)
          window.api.store.set('userData.address', address)
          window.api.store.set('userData.role', role)
          window.api.store.set('userData.isDateTime', false)
          setToast('Create account successfully', 'success')
          setModalShow(true)
        }
      }
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

  const handleValidate = async (data) => {
    setFullnameErr(false)
    setUsernameErr(false)
    setPasswordErr(false)
    setRepeatedPasswordErr(false)
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

  const handlePasswordValid = async (password, repeatedPassword) => {
    setFullnameErr(false)
    setUsernameErr(false)
    setPhoneNumberErr(false)
    if (password === 'undefined') {
      setToast('Please enter your password', 'warning')
      setPasswordErr(true)
      setRepeatedPasswordErr(false)
      return false
    } else if (repeatedPassword === 'undefined') {
      setToast('Please repeat your password', 'warning')
      setRepeatedPasswordErr(true)
      setPasswordErr(false)
      return false
    } else {
      if (password.length < 8) {
        setToast('Password must have at least 8 characters', 'warning')
        setPasswordErr(true)
        setRepeatedPasswordErr(false)
        return false
      } else {
        if (password !== repeatedPassword) {
          setToast("Passwords don't match", 'error')
          setPasswordErr(false)
          setRepeatedPasswordErr(true)
          return false
        } else {
          setPasswordErr(false)
          setRepeatedPasswordErr(false)
          return true
        }
      }
    }
  }

  const gotoLogin = () => {
    window.api.store.set('userData.image', `https://ui-avatars.com/api/?name=${fullname}`)
    // fullname	username	password	isLogged	address	phoneNumber
    window.api.sheets.create({
      fullname: fullname,
      username: username,
      password: password,
      address: address,
      phoneNumber: `'${phoneNumber}`
    })
    window.location.replace('#/login')
  }

  return (
    <>
      {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
      {modalShow && (
        <Modal
          type={'info'}
          title={'Success'}
          message={`Create new account successfully! Please login to continue `}
          confirmMessage={'Login'}
          confirmHandler={gotoLogin}
          // cancelMessage={'Cancel'}
          path={'/login'}
          // dismissIndex={-1}
        />
      )}
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="px-8 py-6 mt-4 text-left bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:w-1/2 md:w-3/5 lg:w-3/5">
          <div>
            <img className="w-auto h-12 mx-auto" src={icon} alt="Workflow" />
            <h2 className="mt-2 text-2xl font-bold text-center text-black dark:text-white">
              Create new account
            </h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-row w-full grow gap-x-4">
            <div className="flex flex-col w-full mt-4">
              <div className="flex flex-row w-full mb-4 gap-x-2">
                <div className="w-1/2">
                  <Input
                    label="Fullname (*)"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setFullName}
                    value={fullname}
                    placeholder={'John Doe'}
                    error={fullnameErr}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="Username (*)"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setUsername}
                    value={username}
                    placeholder={'johndoe@gmail.com'}
                    error={usernameErr}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full mb-4 gap-x-2">
                <div className="w-1/2">
                  <Input
                    label="Password (*)"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    value={password}
                    type={passwordType ? 'text' : 'password'}
                    onChangeHandler={setPassword}
                    placeholder={''}
                    error={passwordErr}
                    iconButton={
                      <button onClick={setPasswordType} className="signup-show-icon">
                        {passwordType ? (
                          <EyeIcon className="w-6 h-6" />
                        ) : (
                          <EyeSlashIcon className="w-6 h-6" />
                        )}
                      </button>
                    }
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label=" Repeate Password (*)"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    value={repeatedPassword}
                    type={passwordType ? 'text' : 'password'}
                    onChangeHandler={setRepeatedPassword}
                    placeholder={''}
                    error={repeatedPasswordErr}
                    iconButton={
                      <button onClick={setPasswordType} className="signup-show-icon">
                        {passwordType ? (
                          <EyeIcon className="w-6 h-6" />
                        ) : (
                          <EyeSlashIcon className="w-6 h-6" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-row w-full mb-4 gap-x-2">
                <div className="w-6/12">
                  <Input
                    label="Address"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setAddress}
                    value={address}
                    placeholder={''}
                    error={false}
                  />
                </div>
                <div className="w-4/12">
                  <Input
                    label="Phone number (*)"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setPhoneNumber}
                    value={phoneNumber}
                    placeholder={'7890-123-456'}
                    error={phoneNumberErr}
                  />
                </div>
                <div className="w-2/12">
                  <Input
                    label="Rorl"
                    isEdit={true}
                    readOnly={false}
                    disabled={false}
                    onChangeHandler={setRole}
                    value={role}
                    placeholder={''}
                    error={false}
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="flex flex-row gap-x-2">
            <button
              onClick={handleSubmit}
              type="submit"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md w-fit h-fit gap-x-2 hover:bg-blue-700"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
