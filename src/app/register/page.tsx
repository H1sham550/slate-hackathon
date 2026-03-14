import Link from "next/link";
import { BookOpenText } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-[2rem] p-8 sm:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.3)] ring-1 ring-indigo-500/30">
            <BookOpenText className="h-8 w-8" />
          </div>
          <h1 className="neon-text text-3xl font-bold tracking-tight">Join S.L.A.T.E.</h1>
          <p className="mt-3 text-sm font-medium text-slate-400">Create an account to track classes and earn summaries.</p>
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 px-5 py-3.5 text-slate-100 outline-none ring-1 ring-transparent backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-indigo-500/50"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 px-5 py-3.5 text-slate-100 outline-none ring-1 ring-transparent backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-indigo-500/50"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 px-5 py-3.5 text-slate-100 outline-none ring-1 ring-transparent backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-indigo-500/50"
              placeholder="••••••••"
              required
            />
          </div>
          <Link href="/profile" className="group relative mt-8 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-10 bg-white/20" />
            </div>
            <span className="relative">Create Account</span>
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
