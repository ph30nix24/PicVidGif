import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import Protect from './auth/Pages/Protect'
import Collection from './collections/page/Collection'
import Login from './auth/Pages/Login'


export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/collection',
        element: <Protect>
            <Collection />
        </Protect>
    },
    {
        path: '/auth/login',
        element: <Login />
    }
])