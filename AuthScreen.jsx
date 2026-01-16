import React, { useState } from "react";
import {
    LogIn,
    UserPlus,
    Mail,
    Lock,
    PawPrint,
    Heart,
    Users,
    Phone,
    MapPin,
    User as UserIcon,
} from "lucide-react";
import { supabase } from "../supabase";

export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState("");

    const userCategories = [
        { value: "pet_owner", label: "Pet Owner", icon: <PawPrint size={16} /> },
        { value: "vet", label: "Veterinarian", icon: <Heart size={16} /> },
        { value: "ngo", label: "Animal NGO", icon: <Users size={16} /> },
    ];

    /* ---------------- SIGN IN ---------------- */
    const handleSignIn = async (e) => {
        e.preventDefault();
        setNotice("");

        if (!email || !password) {
            setNotice("Please enter email & password.");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Fetch role after login
            const { data: profile, error: roleError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (!roleError && profile?.role) {
                localStorage.setItem("user_role", profile.role);
            }

            window.location.href = "/";
        } catch (err) {
            setNotice(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- REGISTER ---------------- */
    const handleRegister = async (e) => {
        e.preventDefault();
        setNotice("");

        if (!name || !email || !password || !role) {
            setNotice("Please fill all required fields.");
            return;
        }

        setLoading(true);
        try {
            // 1️⃣ Sign up user (NO auto-login expected)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            if (!data?.user) throw new Error("User creation failed");

            // 2️⃣ Save profile data
            const { error: profileError } = await supabase
                .from("profiles")
                .insert([
                    {
                        id: data.user.id,
                        name,
                        email,
                        phone: phone || "",
                        address: address || "",
                        role,
                    },
                ]);

            if (profileError) throw profileError;

            // 3️⃣ SUCCESS → switch to Sign In
            setNotice("✅ Registration successful. Please sign in.");
            setIsSignUp(false);
            setPassword("");
        } catch (err) {
            setNotice(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- FORGOT PASSWORD ---------------- */
    const handleForgotPassword = async () => {
        if (!email) {
            setNotice("Please enter your email first.");
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "http://localhost:5173/auth",
            });

            if (error) throw error;
            setNotice("Password reset email sent.");
        } catch (err) {
            setNotice(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F8FAFC" }}>
            <div className="w-full" style={{ maxWidth: 520 }}>
                <div className="rounded-3xl shadow-xl border" style={cardStyle}>
                    <div style={{ padding: 32 }}>
                        {/* LOGO */}
                        <div style={{ textAlign: "center", marginBottom: 18 }}>
                            <img src="/logo.jpg" alt="logo" style={{ width: 80, borderRadius: 16 }} />
                        </div>

                        {/* HEADER */}
                        <div style={headerWrap}>
                            <div style={headerIcon}>
                                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                            </div>
                            <div>
                                <h1 style={titleText}>
                                    {isSignUp ? "Create PawSense Account" : "Sign In to PawSense"}
                                </h1>
                                <p style={subtitleText}>
                                    {isSignUp
                                        ? "Register to monitor and keep your pets safe."
                                        : "Enter your credentials to sign in."}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={isSignUp ? handleRegister : handleSignIn}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {!isSignUp ? (
                                    <>
                                        <div style={fieldWrap}>
                                            <Mail size={18} style={iconStyle} />
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" style={inputStyle} />
                                        </div>

                                        <div style={fieldWrap}>
                                            <Lock size={18} style={iconStyle} />
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
                                        </div>

                                        <button type="submit" disabled={loading} style={signInButton}>
                                            {loading ? "Signing..." : "Sign In"}
                                        </button>

                                        <button type="button" onClick={handleForgotPassword} style={switchButton}>
                                            Forgot password?
                                        </button>

                                        <div style={{ textAlign: "center", marginTop: 12 }}>
                                            <span>Don’t have an account? </span>
                                            <button type="button" onClick={() => setIsSignUp(true)} style={switchButton}>
                                                Sign Up
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={fieldWrap}>
                                            <UserIcon size={18} style={iconStyle} />
                                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={inputStyle} />
                                        </div>

                                        <div style={fieldWrap}>
                                            <Mail size={18} style={iconStyle} />
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
                                        </div>

                                        <div style={fieldWrap}>
                                            <Lock size={18} style={iconStyle} />
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
                                        </div>

                                        <div style={fieldWrap}>
                                            <Phone size={18} style={iconStyle} />
                                            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={inputStyle} />
                                        </div>

                                        <div style={fieldWrap}>
                                            <MapPin size={18} style={iconStyle} />
                                            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" style={inputStyle} />
                                        </div>

                                        <div>
                                            <label style={{ fontWeight: 600 }}>I am a:</label>
                                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                                {userCategories.map((c) => (
                                                    <button
                                                        key={c.value}
                                                        type="button"
                                                        onClick={() => setRole(c.value)}
                                                        style={{
                                                            padding: "8px 14px",
                                                            borderRadius: 999,
                                                            border: role === c.value ? "none" : "1px solid #E6EEF6",
                                                            background: role === c.value ? "#2563EB" : "#FFFFFF",
                                                            color: role === c.value ? "#fff" : "#0F172A",
                                                        }}
                                                    >
                                                        {c.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} style={signInButton}>
                                            {loading ? "Registering..." : "Register"}
                                        </button>

                                        <div style={{ textAlign: "center", marginTop: 12 }}>
                                            <span>Already have an account? </span>
                                            <button type="button" onClick={() => setIsSignUp(false)} style={switchButton}>
                                                Sign In
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </form>

                        {notice && <div style={{ marginTop: 14, color: "#2563EB" }}>{notice}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------- STYLES (UNCHANGED) -------- */

const cardStyle = { background: "#FFFFFF", border: "1px solid #E6EEF6" };

const inputStyle = {
    width: "100%",
    padding: "14px 16px 14px 48px",
    borderRadius: 12,
    border: "1px solid #E6EEF6",
    background: "#F8FAFC",
    color: "#0F172A",
    outline: "none",
};

const fieldWrap = { position: "relative" };

const iconStyle = { position: "absolute", left: 14, top: 12, color: "#64748B" };

const signInButton = {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    background: "#2563EB",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
};

const switchButton = {
    background: "none",
    border: "none",
    color: "#2563EB",
    fontWeight: 700,
    cursor: "pointer",
};

const headerWrap = { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 };

const headerIcon = {
    width: 48,
    height: 48,
    borderRadius: 10,
    background: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const titleText = { margin: 0, color: "#0F172A", fontSize: 26, fontWeight: 800 };

const subtitleText = { margin: 0, color: "#475569", fontSize: 13 };
