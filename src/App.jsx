import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import ReportDetailPage from './pages/ReportDetailPage'
import SubmitPage from './pages/SubmitPage'
import SellPage from './pages/SellPage'
import AboutPage from './pages/AboutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailPage from './pages/PaymentFailPage'
import MyPage from './pages/MyPage'
import AdminPage from './pages/AdminPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage'

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* 공개 페이지 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* 로그인 필요 페이지 */}
          <Route path="/report/:id" element={<RequireAuth><ReportDetailPage /></RequireAuth>} />
          <Route path="/submit" element={<RequireAuth><SubmitPage /></RequireAuth>} />
          <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />

          {/* 판매자 구독 */}
          <Route path="/subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />

          {/* 토스페이먼츠 결제 콜백 */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
    </ThemeProvider>
  )
}
