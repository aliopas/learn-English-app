import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BookOpen, Mail, Lock, Sparkles } from 'lucide-react'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'حدث خطأ. يرجى التأكد من البريد الإلكتروني وكلمة المرور.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="glass-dark rounded-3xl p-10 w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BookOpen className="w-12 h-12 text-purple-600" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            منصة إتقان الإنجليزية
          </h1>

          <div className="text-purple-100 flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5" />
            <span>30 يوماً للوصول إلى B2</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium pr-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full pr-12 pl-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium pr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pr-12 pl-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-purple-100/60 text-sm mb-4">ليس لديك حساب؟</p>
          <Link
            to="/register-direct-access-v1-k9p2"
            className="text-white font-bold hover:underline"
          >
            إنشاء حساب جديد مجاناً
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Auth
