// App.tsx
import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home/Home"
import Shop from "./pages/Shop/ShopPage/Shop"
import ShopCart from "./pages/Shop/Cart/ShopCart"
import ShopDetails from "./pages/Shop/Details/ShopDetails"
import Checkout from "./pages/Shop/Checkout/Checkout"
import AboutUs from "./pages/allPages/AboutUs/AboutUs"
import OurGames from "./pages/allPages/OurGames/OurGames"
import OurTeam from "./pages/allPages/OurTeam/OurTeam"
import Testimonial from "./pages/allPages/Testimonial/Testimonial"
import NotFoundPage from "./pages/allPages/404/NotFoundPage"
import GameDetails from "./pages/allPages/OurGames/GameDetails"
import Faq from "./pages/allPages/OurFaq/Faq"
import Login from "./pages/allPages/Login/Login"
import Register from "./pages/allPages/Register/Register"
import CustomCursor from "./components/common/CustomCursor/CustomCursor"
import OurBlog from "./pages/Blog/OurBlog"
import Contact from "./pages/Contact/Contact"
import { useEffect } from "react"
import { useAppSelector } from "./hooks/useAppSelector"
import { useAppDispatch } from "./hooks/useAppDispatch"
import Wishlist from "./pages/Shop/Wishlist/Wishlist"
import { getCurrentUser } from "./store/slices/authSlice"
import { loadCartFromSupabase } from "./store/slices/cartSlice"
import { loadWishlistFromSupabase } from "./store/slices/wishlistSlice"
import OrderSuccess from "./pages/allPages/OrderSuccess/OrderSuccess"

function App() {
  const isDark = useAppSelector(state => state.theme.isDark)
  const dispatch = useAppDispatch()

  // Tema
  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // App açılanda session yoxla, varsa cart+wishlist yüklə
  useEffect(() => {
    dispatch(getCurrentUser()).then((action) => {
      if (getCurrentUser.fulfilled.match(action) && action.payload) {
        const userId = action.payload.id
        dispatch(loadCartFromSupabase(userId))
        dispatch(loadWishlistFromSupabase(userId))
      }
    })
  }, [dispatch])

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Blog" element={<OurBlog />} />
          <Route path="/pages" element={<Navigate to="/about-us" replace />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-games" element={<OurGames />} />
          <Route path="/game-details" element={<GameDetails />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shop" element={<Navigate to="/shop-page" replace />} />
          <Route path="/shop-page" element={<Shop />} />
          <Route path="/shop-cart" element={<ShopCart />} />
          <Route path="/shop-details/:id" element={<ShopDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App