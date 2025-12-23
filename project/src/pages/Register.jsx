import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BookOpen, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react'
import TermsAndConditionsModal from '../components/TermsAndConditionsModal'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showTerms, setShowTerms] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const { signUp } = useApp()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signUp(email, password, fullName, true) // termsAccepted is guaranteed true by required checkbox/form validation
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-6 relative">
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
                        إنشاء حساب جديد
                    </h1>

                    <div className="text-purple-100 flex items-center justify-center gap-2 mt-4">
                        <Sparkles className="w-5 h-5" />

                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-100 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium pr-2">الاسم الكامل</label>
                        <div className="relative">
                            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="الاسم هنا..."
                                className="w-full pr-12 pl-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>
                    </div>

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
                                minLength={6}
                                className="w-full pr-12 pl-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/20 rounded-xl">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 checked:bg-white focus:ring-2 focus:ring-white/50 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-white/90 text-sm leading-relaxed cursor-pointer select-none">
                            أوافق على{' '}
                            <button
                                type="button"
                                onClick={() => setShowTerms(true)}
                                className="text-white underline hover:text-purple-200 font-semibold"
                            >
                                الشروط والأحكام و سياسة الخصوصية
                            </button>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/20 text-center">
                    <p className="text-purple-100/60 text-sm mb-4">لديك حساب بالفعل؟</p>
                    <Link
                        to="/auth"
                        className="text-white font-bold hover:underline"
                    >
                        تسجيل الدخول
                    </Link>
                </div>
            </div>

            {/* Terms Modal */}
            {showTerms && (
                <TermsAndConditionsModal onAccept={() => {
                    setTermsAccepted(true)
                    setShowTerms(false)
                }} />
            )}
        </div>
    )
}

export default Register
