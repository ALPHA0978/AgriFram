import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, Leaf, Eye, EyeOff, Loader2, Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/firebase'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { t } = useTranslation()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithGoogle()
      localStorage.setItem('agrifarm_user', JSON.stringify({
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid
      }))
      navigate('/farming-tool')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isLogin) {
        result = await signInWithEmail(formData.email, formData.password)
      } else {
        result = await signUpWithEmail(formData.email, formData.password)
      }
      
      localStorage.setItem('agrifarm_user', JSON.stringify({
        email: result.user.email,
        name: formData.name || result.user.email.split('@')[0],
        uid: result.user.uid
      }))
      navigate('/farming-tool')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-[#05080a] text-white font-inter relative selection:bg-emerald-500/30">
      
      {/* Advanced Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, 
            backgroundSize: '30px 30px' 
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              AgriFarm<span className="text-emerald-400">AI</span>
            </span>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12 min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-[440px]">
          
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Radio className="w-3 h-3 animate-pulse" /> Secure Authentication
            </div>
          </div>

          {/* Glass Card */}
          <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
            
            {/* Subtle Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
            
            <div className="relative p-8 sm:p-10">
              
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                  {isLogin ? 'Welcome Back' : 'Join AgriFarmAI'}
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {isLogin 
                    ? 'Access your AI-powered farming dashboard' 
                    : 'Start optimizing your farm with artificial intelligence'}
                </p>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 h-12 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 mb-6 shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-gray-900/40 backdrop-blur-sm px-4 text-gray-500 font-bold">Or with email</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                  <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Field */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-11 pr-4 h-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        placeholder="John Smith"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-11 pr-4 h-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="farmer@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-11 pr-11 h-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLogin ? 'Sign In to Dashboard' : 'Create Account'}
                </button>
              </form>
            </div>

            {/* Footer Toggle */}
            <div className="bg-black/20 p-6 text-center border-t border-white/5">
              <p className="text-gray-400 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className="ml-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login
