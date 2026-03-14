import Link from "next/link";
import { GlassButton } from "@/components/ui/glass-button";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-slate-900/60 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter neon-text">SLATE</h1>
          <p className="text-slate-400 text-sm">Scalable Learning & Adaptive Text Engine</p>
          <div className="pt-2">
            <h2 className="text-2xl font-bold text-white">Create an Account</h2>
            <p className="text-slate-400 text-sm">Join thousands of students transforming their studies</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@university.edu"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div className="pt-4">
            <Link href="/login" className="block w-full">
              <GlassButton className="w-full" size="lg">
                Create Account
              </GlassButton>
            </Link>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-500">Already have an account?{" "}</span>
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
