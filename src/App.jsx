import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import ReportDetailPage from './pages/ReportDetailPage'
import SubmitPage from './pages/SubmitPage'
import SellPage from './pages/SellPage'
import AboutPage from './pages/AboutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailPage from './pages/PaymentFailPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* 토스페이먼츠 결제 콜백 */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
      </Routes>
    </Layout>
  )
}
