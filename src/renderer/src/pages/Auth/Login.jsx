import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import icon from '../../assets/icon.png'
import Input from '../../components/Input'
import Toast from '../../components/Toast'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useToggle from '../../hooks/useToggle'

const Login = () => {
  useDocumentTitle('Login') //*change title of the app

  const [usernameErr, setUsernameErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [passwordType, setPasswordType] = useToggle()
  const [toastShow, setToastShow] = useState(false)
  const [toastType, setToastType] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [correctUsername] = useState(window.api.store.get('userData.username'))
  const [correctPassword] = useState(window.api.store.get('userData.password'))

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username === 'undefined' || username === '') {
      setUsernameErr(true)
      setPasswordErr(false)
      setToast('Please enter your username', 'warning')
      return false
    } else {
      setUsernameErr(false)
      let isValid = await handlePasswordValid(password)
      if (isValid) {
        setUsernameErr(false)
        setPasswordErr(false)
        isLogged()
      }
    }
  }

  const handlePasswordValid = async (password) => {
    setUsernameErr(false)
    if (password === 'undefined') {
      setToast('Please enter your password', 'warning')
      setPasswordErr(true)
      return false
    } else {
      if (password.length < 8) {
        setPasswordErr(true)
        setToast('Password must have at least 8 characters', 'warning')
        return false
      } else {
        if (username === correctUsername && password === correctPassword) {
          setPasswordErr(false)
          return true
        } else {
          setUsernameErr(true)
          setPasswordErr(true)
          setToast("Username or password don't match", 'error')
          return false
        }
      }
    }
  }

  const isLogged = () => {
    window.api.store.set('userData.isLogged', true)
    window.location.replace('#/home')
  }

  return (
    <>
      {toastShow && <Toast isShow={toastShow} message={toastMessage} type={toastType} />}
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="px-8 py-6 mt-4 text-left bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:w-1/2 md:w-3/5 lg:w-3/5">
          <div>
            <img className="w-auto h-12 mx-auto" src={icon} alt="Workflow" />
            <h2 className="mt-2 text-2xl font-bold text-center text-black dark:text-white">
              Login to your account
            </h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col w-full grow gap-x-4">
            <div className="flex flex-col mt-4">
              <div className="w-full mb-4">
                <Input
                  label="Username"
                  isEdit={true}
                  readOnly={false}
                  disabled={false}
                  onChangeHandler={setUsername}
                  value={username}
                  placeholder={'johndoe@gmail.com'}
                  error={usernameErr}
                />
              </div>
              <div className="w-full mb-4">
                <Input
                  label="Password"
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
            </div>
          </form>
          <div className="flex flex-col gap-x-0 gap-y-2 md:gap-x-2 lg:gap-x-2 sm:gap-x-2">
            <div className="flex flex-row w-full">
              <button
                onClick={handleSubmit}
                type="submit"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md w-fit h-fit gap-x-2 hover:bg-blue-700"
              >
                Login
              </button>
            </div>
            <p className="font-normal text-center text-gray-500 text-md dark:text-gray-400">
              {"Don't have an account yet? "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                {'Signup'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
