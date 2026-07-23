import { Link } from 'react-router-dom'
import notfoundimage from '@/assets/images/home/404.png'
import './NotFoundPage.scss'

const NotFoundPage = () => {
    return (
        <div className="about-page">

            <div className="not-found">
                <div className="not-found__content">
                    <img src={notfoundimage} alt="404" className="not-found__img" />
                    <p className="not-found__text">Error – Page Not Found</p>
                    <Link to="/" className="not-found__btn">Back To Home</Link>
                </div>
            </div>

        </div>
    )
}

export default NotFoundPage