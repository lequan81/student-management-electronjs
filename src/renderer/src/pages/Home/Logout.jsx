import Modal from '../../components/Modal'

const Logout = () => {
  const logout = () => {
    window.api.store.set('userData.isLogged', false)
    window.location.replace('#/login')
  }
  return (
    <>
      <Modal
        type={'error'}
        title={'Logout'}
        message={'Are you sure to logout of your account?'}
        confirmMessage={'Yes'}
        confirmHandler={logout}
        cancelMessage={'Cancel'}
        path={'/login'}
        dismissIndex={-1}
      />
    </>
  )
}

export default Logout
