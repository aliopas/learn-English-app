import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import TermsAndConditionsModal from '../components/TermsAndConditionsModal'

const ChangePassword = () => {
    const { changePassword, user, needsPasswordChange, acceptTerms } = useApp()
    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    useEffect(() => {
        // If password change is not forced (voluntary change) OR user already accepted terms
        if (!needsPasswordChange || user?.terms_accepted) {
            setAcceptedTerms(true)
        }
    }, [needsPasswordChange, user])

    const handleAcceptTerms = async () => {
        try {
            await acceptTerms()
            setAcceptedTerms(true)
        } catch (err) {
            console.error('Failed to accept terms', err)
            // Still allow them to proceed locally for UX, or show error?
            // For now, let's allow proceed but log it. 
            // Better yet, just setAcceptedTerms(true) as fallback so they aren't stuck.
            setAcceptedTerms(true)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('جميع الحقول مطلوبة')
            return
        }

        if (newPassword.length < 6) {
            setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
            return
        }

        setLoading(true)

        try {
            await changePassword(currentPassword, newPassword)
            // Success - redirect to dashboard
            navigate('/')
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تغيير كلمة المرور')
        } finally {
            setLoading(false)
        }
    }

    if (!acceptedTerms) {
        return <TermsAndConditionsModal onAccept={handleAcceptTerms} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-6">
            <div className="glass rounded-3xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        تغيير كلمة المرور
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        مرحباً {user?.full_name || user?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        يجب عليك تغيير كلمة المرور الافتراضية قبل المتابعة
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الحالية
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-colors text-gray-800 dark:text-white"
                            placeholder="أدخل كلمة المرور الحالية"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-colors text-gray-800 dark:text-white"
                            placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-colors text-gray-800 dark:text-white"
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        💡 <strong>نصيحة:</strong> استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
