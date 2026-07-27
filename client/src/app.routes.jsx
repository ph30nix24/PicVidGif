import { createBrowserRouter } from 'react-router'
import Home from './features/home/Home'
import Protect from './features/auth/Pages/Protect'
import Collection from './features/collections/page/Collection'
import Login from './features/auth/Pages/Login'


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