
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'
import Loader from '../../../components/Loader'

const Protect = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const location = useLocation()

  if (loading) {
    return (
      <Loader />
    )
  }

  if (!user) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    )
  }
  
  return children

}

export default Protect