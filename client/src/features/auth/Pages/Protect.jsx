
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'

const Protect = () => {
    const user = useSelector((state) => state.auth.user)
    const location = useLocation()
    if(!user) {
        return (
            <Navigate to="/auth/login" replace state={{ from: location.pathname }}/>
        )
    }
  return (
    <div>Protect</div>
  )
}

export default Protect