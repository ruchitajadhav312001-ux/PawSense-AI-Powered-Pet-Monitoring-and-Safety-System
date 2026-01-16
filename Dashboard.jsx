import React, { useState, useEffect } from "react";
import { Image, Headphones } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { supabase } from "../supabase";
import { COLOR_BORDER } from "../Layout";

/* ===== BACKEND URLS ===== */
const DOG_API_URL =
    "https://quantummechanical-tamesha-cytophagic.ngrok-free.dev/predict";
const CAT_API_URL =
    "https://quantummechanical-tamesha-cytophagic.ngrok-free.dev/predict_cat";
const AUDIO_API_URL =
    "https://quantummechanical-tamesha-cytophagic.ngrok-free.dev/predict_audio";

/* ===== COLORS ===== */
const EMOTION_COLORS = {
    Angry: "#EF4444",
    Happy: "#22C55E",
    Relaxed: "#38BDF8",
    Sad: "#6366F1",
    Normal: "#10B981",
    Scared: "#F97316",
};

/* ===== CARD ===== */
const Card = ({ title, children }) => (
    <div
        style={{
            background: "#fff",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 8px 24px rgba(2,6,23,0.04)",
        }}
    >
        {title && (
            <h3 style={{ fontSize: 12, marginBottom: 16, fontWeight: 700 }}>
                {title}
            </h3>
        )}
        {children}
    </div>
);

export default function Dashboard() {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [animal, setAnimal] = useState("dog");

    const [emotion, setEmotion] = useState("—");
    const [confidence, setConfidence] = useState(0);

    const [preview, setPreview] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);

    const [emotionData, setEmotionData] = useState([
        { name: "Angry", value: 0 },
        { name: "Happy", value: 0 },
        { name: "Relaxed", value: 0 },
        { name: "Sad", value: 0 },
        { name: "Normal", value: 0 },
        { name: "Scared", value: 0 },
    ]);

    /* POPUP STATES */
    const [showPopup, setShowPopup] = useState(false);
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [showAskPopup, setShowAskPopup] = useState(false);

    const [pendingType, setPendingType] = useState(null);
    const [filterType, setFilterType] = useState("dog");
    const [chosenPet, setChosenPet] = useState("");

    useEffect(() => {
        const fetchPets = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData?.user) return;

            const { data } = await supabase
                .from("pets")
                .select("*")
                .eq("user_id", authData.user.id);

            setPets(data || []);

            if (data?.length) {
                setSelectedPet(data[0]);
                setAnimal(data[0].pet_type.toLowerCase());
            }
        };
        fetchPets();
    }, []);

    /* IMAGE */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setAudioPreview(null);

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
            animal === "dog" ? DOG_API_URL : CAT_API_URL,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        setEmotion(data.emotion);
        setConfidence(Math.round(data.confidence));
    };

    /* AUDIO */
    const handleAudioUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "audio/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setAudioPreview(URL.createObjectURL(file));
            setPreview(null);

            const formData = new FormData();
            formData.append("audio", file);

            const response = await fetch(AUDIO_API_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setEmotion(data.emotion);
            setConfidence(Math.round(data.confidence));
        };

        input.click();
    };

    return (
        <>
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 32,
                }}
            >
                <h1 style={{ fontSize: 36 }}>Live Feed</h1>

                <select
                    value={selectedPet?.id || ""}
                    onChange={(e) => {
                        const pet = pets.find((p) => p.id === e.target.value);
                        if (!pet) return;
                        setSelectedPet(pet);
                        setAnimal(pet.pet_type.toLowerCase());
                    }}
                    style={{
                        height: 40,
                        borderRadius: 10,
                        border: "1px solid #CBD5E1",
                        padding: "0 12px",
                        background: "#FFFFFF",
                        cursor: "pointer",
                    }}
                >
                    {pets.length === 0 && <option>No pets added</option>}
                    {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            🐾 {pet.name} ({pet.pet_type})
                        </option>
                    ))}
                </select>
            </div>

            {/* MAIN GRID */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "320px 1fr 320px",
                    gap: 32,
                }}
            >
                {/* LEFT */}
                <div style={{ display: "grid", gap: 24 }}>
                    <Card title="CURRENT EMOTION">
                        <div style={{ fontSize: 48, textAlign: "center" }}>
                            {emotion}
                        </div>
                    </Card>

                    <Card title="EMOTION ANALYSIS">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={emotionData}>
                                <XAxis dataKey="name" />
                                <YAxis hide />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {emotionData.map((e, i) => (
                                        <Cell key={i} fill={EMOTION_COLORS[e.name]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* CENTER */}
                <Card title="UPLOAD IMAGE">
                    <input
                        id="imgUpload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />

                    <div
                        onClick={() => {
                            setPendingType("image");
                            setShowPopup(true);
                        }}
                        style={{
                            height: 320,
                            border: `2px dashed ${COLOR_BORDER}`,
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            marginBottom: 18,
                            overflow: "hidden",
                        }}
                    >
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        )}

                        {audioPreview && (
                            <audio
                                controls
                                src={audioPreview}
                                style={{ width: "100%" }}
                            />
                        )}

                        {!preview && !audioPreview && "Click to upload image"}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                        {/* IMAGE BUTTON */}
                        <button
                            style={btnStyle}
                            onClick={() => {
                                setPendingType("image");
                                setShowPopup(true);
                            }}
                        >
                            <Image size={18} /> Image
                        </button>

                        {/* AUDIO BUTTON */}
                        <button
                            style={btnStyle}
                            onClick={() => {
                                setPendingType("audio");
                                setShowPopup(true);
                            }}
                        >
                            <Headphones size={18} /> Audio
                        </button>
                    </div>
                </Card>

                {/* RIGHT */}
                <div style={{ display: "grid", gap: 24 }}>
                    <Card title="AI CONFIDENCE">
                        <div style={{ fontSize: 48, textAlign: "center" }}>
                            {confidence}%
                        </div>
                    </Card>

                    <Card title="EMOTION DISTRIBUTION">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={emotionData}
                                    dataKey="value"
                                    outerRadius={80}
                                >
                                    {emotionData.map((e, i) => (
                                        <Cell key={i} fill={EMOTION_COLORS[e.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>

            {/* FIRST POPUP */}
            {showPopup && (
                <div style={overlay}>
                    <div style={popup}>
                        <h3 style={popupTitle}>Register Animal</h3>
                        <p style={popupText}>
                            Is this animal already registered?
                        </p>

                        <div style={btnRow}>
                            <button
                                style={secondaryBtn}
                                onClick={() => {
                                    setShowPopup(false);
                                    setShowAskPopup(true);
                                }}
                            >
                                No, Add Pet
                            </button>

                            <button
                                style={primaryBtn}
                                onClick={() => {
                                    setShowPopup(false);
                                    setShowRegisterPopup(true);
                                }}
                            >
                                Yes, Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECOND POPUP */}
            {showRegisterPopup && (
                <div style={overlay}>
                    <div style={popup}>
                        <h3 style={popupTitle}>Select Registered Pet</h3>

                        <select
                            value={filterType}
                            onChange={(e) =>
                                setFilterType(e.target.value)
                            }
                            style={selectStyle}
                        >
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                        </select>

                        <select
                            value={chosenPet}
                            onChange={(e) =>
                                setChosenPet(e.target.value)
                            }
                            style={selectStyle}
                        >
                            <option value="">Select pet name</option>
                            {pets
                                .filter(
                                    (p) =>
                                        p.pet_type.toLowerCase() ===
                                        filterType
                                )
                                .map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                        </select>

                        <div style={btnRow}>
                            <button
                                style={secondaryBtn}
                                onClick={() =>
                                    setShowRegisterPopup(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                style={primaryBtn}
                                onClick={() => {
                                    const pet = pets.find(
                                        (p) =>
                                            p.id === chosenPet
                                    );
                                    if (!pet) return;

                                    setSelectedPet(pet);
                                    setAnimal(
                                        pet.pet_type.toLowerCase()
                                    );
                                    setShowRegisterPopup(false);

                                    pendingType === "image"
                                        ? document
                                            .getElementById(
                                                "imgUpload"
                                            )
                                            .click()
                                        : handleAudioUpload();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASK REGISTER */}
            {showAskPopup && (
                <div style={overlay}>
                    <div style={popup}>
                        <h3 style={popupTitle}>Register Pet?</h3>
                        <p style={popupText}>
                            Do you want to register this pet?
                        </p>

                        <div style={btnRow}>
                            <button
                                style={secondaryBtn}
                                onClick={() =>
                                    setShowAskPopup(false)
                                }
                            >
                                No
                            </button>

                            <button
                                style={primaryBtn}
                                onClick={() =>
                                (window.location.href =
                                    "/pet_profile")
                                }
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ===== STYLES ===== */

const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
};

const popup = {
    width: 360,
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: `1px solid ${COLOR_BORDER}`,
    boxShadow: "0 20px 40px rgba(2,6,23,0.25)",
};

const popupTitle = {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
};

const popupText = {
    fontSize: 14,
    color: "#475569",
    marginBottom: 20,
};

const selectStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    marginBottom: 12,
};

const btnRow = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
};

const primaryBtn = {
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    background: "#2563EB",
    color: "#fff",
    cursor: "pointer",
};

const secondaryBtn = {
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #CBD5E1",
    background: "#F1F5F9",
    cursor: "pointer",
};

const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px solid #CBD5E1",
    background: "#F8FAFC",
    cursor: "pointer",
};
