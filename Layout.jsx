import React, { useRef, useState } from "react";
import {
    Home,
    Activity,
    Upload,
    Bell,
    User,
    Mic,
    HeartPulse,
    Shield,
    PlusCircle,
    FileDown,
    LogOut,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

/* ===== THEME ===== */
export const SIDEBAR_WIDTH = 260;
export const COLOR_BORDER = "#E6EEF6";
export const COLOR_BG_MAIN = "#F8FAFC";
export const COLOR_BG_CARD = "#FFFFFF";
export const COLOR_ACCENT = "#2563EB";
export const COLOR_TEXT_DIM = "#0F172A";

const logoImage = "/logo.jpg";

/* ===== SIDEBAR ===== */
function Sidebar() {
    const navigate = useNavigate();

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = async () => {
        if (!isRecording) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } else {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    /* LOGOUT */
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    return (
        <aside
            style={{
                height: "100vh",
                background: COLOR_BG_MAIN,
                borderRight: `1px solid ${COLOR_BORDER}`,
                padding: 24,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* LOGO */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <img
                    src={logoImage}
                    alt="PawSense"
                    style={{ width: 72, borderRadius: "50%" }}
                />
                <h2>PawSense</h2>
            </div>

            {/* MENU */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <button onClick={() => navigate("/")}>
                    <Home size={18} /> Dashboard
                </button>

                <button>
                    <Activity size={18} /> Pet Emotion Monitor
                </button>

                <button onClick={() => navigate("/upload-history")}>
                    <Upload size={18} /> Upload History
                </button>

                <button onClick={() => navigate("/health")}>
                    <HeartPulse size={18} /> Medical
                </button>

                <button onClick={() => navigate("/reports")}>
                    <FileDown size={18} /> Report Download
                </button>

                <button>
                    <Shield size={18} /> SOS
                </button>

                <button onClick={() => navigate("/pet_profile")}>
                    <PlusCircle size={18} /> Add Pet
                </button>

                {/* LOGOUT */}
                <button onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            {/* LISTEN LIVE (MOVED UP SLIGHTLY) */}
            <div
                style={{
                    marginTop: "auto",
                    marginBottom: 40, // ✅ THIS MOVES IT UP
                    textAlign: "center",
                    cursor: "pointer",
                }}
                onClick={toggleRecording}
            >
                <Mic
                    size={28}
                    color={isRecording ? "red" : COLOR_ACCENT}
                />
                <p>{isRecording ? "Recording..." : "Listen Live"}</p>
            </div>
        </aside>
    );
}

/* ===== TOP NAV ===== */
function TopNav() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                background: COLOR_BG_CARD,
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 14,
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 32,
            }}
        >
            <input
                placeholder="Search pets, history, reports..."
                style={{
                    width: 360,
                    padding: 10,
                    borderRadius: 10,
                    border: `1px solid ${COLOR_BORDER}`,
                }}
            />

            <div style={{ display: "flex", gap: 12 }}>
                <Bell />
                <User onClick={() => navigate("/auth")} />
            </div>
        </div>
    );
}

/* ===== ROOT ===== */
export default function Layout() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
                minHeight: "100vh",
                background: COLOR_BG_MAIN,
            }}
        >
            <Sidebar />
            <main style={{ padding: 24 }}>
                <div style={{ maxWidth: 1400, margin: "0 auto" }}>
                    <TopNav />
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
