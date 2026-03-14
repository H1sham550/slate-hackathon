"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Settings, LogOut, User, Loader2, Save, Edit2 } from "lucide-react";
import { supabase, signOutUser } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      setFullName(session.user.user_metadata?.full_name || "");
      setIsLoading(false);
    }
    load();
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/login");
  };

  const handleUpdateName = async () => {
    if (!fullName.trim() || !user) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: "Profile updated successfully!" });
      setIsEditing(false);
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || "Failed to update profile." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen md:ml-20 lg:ml-64 p-4 md:p-6 lg:p-8">
      <Sidebar />
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* Header */}
        <header className="glass-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="neon-text text-2xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Manage your account and preferences.
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-800/60 bg-slate-900/40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Info */}
            <section className="glass-panel rounded-3xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Account</h3>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className={`mb-6 rounded-2xl p-4 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</p>
                  {isEditing ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="flex-1 rounded-xl bg-slate-800/80 px-4 py-2 text-sm text-slate-200 outline-none ring-1 ring-slate-700/50 focus:ring-indigo-500/50"
                        placeholder="Your full name"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateName}
                          disabled={isUpdating || !fullName.trim()}
                          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Save
                        </button>
                        <button
                          onClick={() => { setIsEditing(false); setFullName(user?.user_metadata?.full_name || ""); }}
                          className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-slate-300">
                      {user?.user_metadata?.full_name || "Not set"}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-300">{user?.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Account Created</p>
                  <p className="text-sm font-medium text-slate-300">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="glass-panel rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-100">Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300">AI Model</p>
                    <p className="text-xs text-slate-500">GPT-4o via GitHub Models</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Transcription Engine</p>
                    <p className="text-xs text-slate-500">Groq Whisper Large v3 Turbo</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">Active</span>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-red-400">Account Actions</h3>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/30 ring-1 ring-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
