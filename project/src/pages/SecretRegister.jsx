import { useState } from 'react'
import { authAPI } from '../lib/api'
import { Copy, Check, Lock, AlertCircle } from 'lucide-react'

const SecretRegister = () => {
    const [email, setEmail] = useState('')
    const [generatedPassword, setGeneratedPassword] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setGeneratedPassword(null)
        setLoading(true)

        try {
            const data = await authAPI.registerSecret(email)
            if (data.success) {
                setGeneratedPassword(data.user.generatedPassword)
            }
        } catch (err) {
            setError(err.message || 'فشل إنشاء الحساب')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (generatedPassword) {
            navigator.clipboard.writeText(generatedPassword)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-700">
                <div className="text-center mb-8">
                    <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">تسجيل إداري سري</h1>
                    <p className="text-gray-400 text-sm">للإستخدام الداخلي فقط</p>
                </div>

                {!generatedPassword ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                البريد الإلكتروني للمستخدم الجديد
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                                placeholder="user@example.com"
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                        >
                            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب وتوليد كلمة مرور'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Check className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-green-400 font-bold mb-1">تم إنشاء الحساب بنجاح!</h3>
                            <p className="text-gray-400 text-sm">{email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 text-center">
                                كلمة المرور المؤقتة
                            </label>
                            <div className="relative">
                                <div className="w-full px-4 py-4 rounded-xl bg-gray-950 border border-gray-700 text-center font-mono text-xl text-white tracking-widest break-all">
                                    {generatedPassword}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                                    title="نسخ"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                يجب على المستخدم تغيير كلمة المرور هذه عند تسجيل الدخول لأول مرة.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setGeneratedPassword(null)
                                setEmail('')
                            }}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                        >
                            إنشاء حساب آخر
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SecretRegister
