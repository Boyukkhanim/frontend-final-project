import Footer from '../components/layout/Footer/Footer'
import Header from '../components/layout/Header/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default MainLayout