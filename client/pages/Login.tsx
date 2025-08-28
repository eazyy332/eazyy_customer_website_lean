import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check for pending order and redirect after login
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is already logged in, check for pending order
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          try {
            const orderData = JSON.parse(pendingOrder);
            localStorage.removeItem('pendingOrder');
            navigate(orderData.returnTo || '/order/address', { state: orderData });
            return;
          } catch {
            // Invalid data, just go to home
          }
        }
        navigate('/');
      }
    };
    checkAuthAndRedirect();
  }, [navigate]);

  // Test Supabase connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        // Skip connection test - handled by mock client
        console.log('Supabase client initialized');
      } catch (err) {
        console.log('Supabase initialization error:', err);
      }
    };
    testConnection();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      
      // Check for pending order after successful login
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (pendingOrder) {
        try {
          const orderData = JSON.parse(pendingOrder);
          localStorage.removeItem('pendingOrder');
          navigate(orderData.returnTo || '/order/address', { state: orderData });
          return;
        } catch {
          // Invalid data, just go to home
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting signup with email:', email);
      
      const { data, error: err } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`
          }
        }
      });
      
      console.log('Signup response:', { data, error: err });
      
      if (err) {
        console.error('Signup error:', err);
        throw err;
      }
      
      if (data?.user && !data?.session) {
        setError("Check your email for a confirmation link!");
      } else if (data?.session) {
        // Create profile after successful signup
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            first_name: firstName.trim(),
            last_name: lastName.trim()
          });
        } catch (profileErr) {
          console.log('Profile creation failed:', profileErr);
          // Don't fail signup if profile creation fails
        }

        // Auto-confirmed, redirect to home
        // Check for pending order after successful signup
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          try {
            const orderData = JSON.parse(pendingOrder);
            localStorage.removeItem('pendingOrder');
            navigate(orderData.returnTo || '/order/address', { state: orderData });
            return;
          } catch {
            // Invalid data, just go to home
          }
        }
        navigate('/');
      }
    } catch (err: any) {
      console.error('Signup failed:', err);
      if (err?.status === 500) {
        setError("Server error. Please try again later or contact support.");
      } else {
        setError(err?.message || "Sign up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 md:px-8 lg:px-12 pt-12 pb-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-medium text-black mb-6">Account</h1>
          
          {/* Toggle between Login and Sign Up */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-6">
            <form onSubmit={isSignUp ? signUp : signIn} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2"
                />
              </div>
              {isSignUp && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2"
                  />
                </div>
              )}
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary text-white px-5 py-3 font-semibold"
              >
                {loading ? (isSignUp ? "Signing up…" : "Signing in…") : (isSignUp ? "Sign up" : "Sign in")}
              </button>
            </form>
            <button
              onClick={signOut}
              className="mt-4 w-full rounded-full border border-gray-300 px-5 py-3 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


