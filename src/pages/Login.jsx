import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, Leaf, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/firebase'
import { checkProfileCompleted } from '../services/profileService'

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
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime
      localStorage.setItem('agrifarm_user', JSON.stringify({
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid
      }))
      const profileCompleted = await checkProfileCompleted(result.user.uid)
      if (!profileCompleted || isNewUser) {
        navigate('/profile-setup')
      } else {
        navigate('/dashboard')
      }
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
      let isNewUser = false
      if (isLogin) {
        result = await signInWithEmail(formData.email, formData.password)
      } else {
        result = await signUpWithEmail(formData.email, formData.password)
        isNewUser = true
      }
      
      localStorage.setItem('agrifarm_user', JSON.stringify({
        email: result.user.email,
        name: formData.name || result.user.email.split('@')[0],
        uid: result.user.uid
      }))
      
      const profileCompleted = await checkProfileCompleted(result.user.uid)
      if (!profileCompleted || isNewUser) {
        navigate('/profile-setup')
      } else {
        navigate('/dashboard')
      }
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
    <div className="min-h-screen bg-[#020617] text-white font-sans relative flex flex-col justify-between selection:bg-emerald-500/30">
      
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Top Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-2xl"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </button>

        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg">
          <div className="p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/30">
            <Leaf size={18} />
          </div>
          <span>AgriFarm<span className="text-white">AI</span></span>
        </div>
      </header>

      {/* Main Glass Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0f172a]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl glow-emerald space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {isLogin ? 'Welcome Back Farmer' : 'Create Agritech Account'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {isLogin ? 'Enter credentials to access IoT telemetry & AI swarms' : 'Register to manage field sensors & AI crop diagnostics'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 font-semibold text-center font-mono">
              {error}
            </div>
          )}

          {/* Social Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold transition-all text-slate-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"/>
            </svg>
            <span>Continue with Google OAuth</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Sardar Ramesh Singh"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="farmer@agrifarm.ai"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In to Dashboard' : 'Create Pro Account'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 font-mono">
        AgriFarmAI • AWS Bedrock Multi-Agent Agritech Engine • 2026
      </footer>
    </div>
  )
}

export default Login;
