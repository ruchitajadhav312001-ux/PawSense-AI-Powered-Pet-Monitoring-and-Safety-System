import React, { useState } from "react";
import { Camera, MapPin } from "lucide-react";
import {
    COLOR_ACCENT,
    COLOR_BG_CARD,
    COLOR_TEXT_DIM,
    COLOR_BORDER,
} from "../Layout";

const COLOR_ACTIVE_BG = "#3D3D5A";

// ✅ Backend base
const API_BASE = "http://localhost:8000";
const SOS_URL = `${API_BASE}/sos-alert`;

const HealthDetection = () => {
    // 🔹 LOGIC ONLY (NO UI CHANGE)
    const [animal, setAnimal] = useState("dog"); // dog | cat

    const [uploadedImage, setUploadedImage] = useState(null);
    const [disease, setDisease] = useState("—");
    const [confidence, setConfidence] = useState(0);
    const [advice, setAdvice] = useState(
        "Upload an image to receive AI-based health guidance."
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🔹 Dynamic API (dog / cat)
    const API_URL =
        animal === "cat"
            ? `${API_BASE}/cat-skin`
            : `${API_BASE}/dog-skin`;

    // ---------------------------
    // Disease → important actions
    // ---------------------------
    const importantActions = {
        ringworm: [
            "Highly contagious – isolate your pet immediately.",
            "Wash hands thoroughly after touching your pet.",
            "Disinfect bedding, toys, and living areas regularly.",
            "Visit a veterinarian for antifungal treatment.",
        ],
        fungal: [
            "Keep the affected area dry and clean.",
            "Do not apply home remedies or human creams.",
            "A veterinarian should prescribe antifungal medication.",
        ],
        dermatitis: [
            "Prevent your pet from scratching or licking the skin.",
            "Avoid using steroid creams without vet advice.",
            "Vet visit is important to find the exact cause.",
        ],
        hypersensitivity: [
            "Check for recent changes in food or environment.",
            "Do not give human allergy medicines.",
            "Consult a vet for allergy testing and safe treatment.",
        ],
        demodicosis: [
            "Do not shave or apply harsh chemicals to the skin.",
            "Requires vet-prescribed medication and monitoring.",
            "Follow-up visits are important until cleared.",
        ],
        healthy: [
            "Skin appears healthy based on the image.",
            "Continue regular grooming and hygiene.",
        ],
    };

    // 🚨 SOS rules
    const SOS_DISEASES = [
        "ringworm",
        "demodicosis",
        "hypersensitivity",
        "fungal",
        "dermatitis",
        "scabies",
        "flea_allergy",
    ];

    const sendSOSAlert = async (diseaseValue, confValue) => {
        try {
            await fetch(SOS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    disease: diseaseValue,
                    confidence: confValue,
                }),
            });
        } catch (err) {
            console.error("SOS failed", err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedImage(URL.createObjectURL(file));
        setLoading(true);
        setError(null);
        setDisease("Analyzing...");
        setConfidence(0);
        setAdvice("Analyzing image, please wait...");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("API error");

            const data = await res.json();

            const detected = (data.disease || "unknown").toLowerCase();
            setDisease(detected);

            const conf =
                typeof data.confidence === "number"
                    ? Math.round(Math.min(Math.max(data.confidence, 0), 100))
                    : 0;

            setConfidence(conf);
            setAdvice(
                data.advice ||
                "Consult a veterinarian for proper diagnosis and treatment."
            );

            if (SOS_DISEASES.includes(detected) && conf >= 60) {
                await sendSOSAlert(detected, conf);
            }
        } catch (err) {
            setError("Failed to analyze image. Please try again.");
            setDisease("—");
            setConfidence(0);
            setAdvice("Could not get a valid response from the server.");
        } finally {
            setLoading(false);
        }
    };

    // 📍 Find nearby veterinarians (LOGIC ONLY)
    const findVetsNearMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsUrl = `https://www.google.com/maps/search/veterinary+clinic/@${latitude},${longitude},15z`;
                window.open(mapsUrl, "_blank");
            },
            () => {
                alert("Location access denied. Please enable location services.");
            }
        );
    };

    const Card = ({ title, children, className, style }) => (
        <div
            className={`rounded-xl border shadow-md flex flex-col ${className || ""}`}
            style={{
                backgroundColor: COLOR_BG_CARD,
                borderColor: COLOR_BORDER,
                padding: "1.25rem 1.5rem",
                ...style,
            }}
        >
            {title && (
                <h3
                    className="text-sm font-bold uppercase mb-4"
                    style={{ color: COLOR_TEXT_DIM }}
                >
                    {title}
                </h3>
            )}
            {children}
        </div>
    );

    const confidenceLabel = loading
        ? "Analyzing..."
        : confidence >= 60
            ? "High Confidence"
            : "Low Confidence";

    return (
        <section className="mt-8">
            <select
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                className="hidden"
            >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
            </select>

            <div className="health-grid">
                {/* LEFT – Upload */}
                <Card className="area-upload" title="Upload for AI Health Scan">
                    <label
                        htmlFor="health-upload"
                        className="cursor-pointer flex-1 flex items-center justify-center"
                    >
                        <div
                            style={{
                                width: "100%",
                                height: 220,
                                borderRadius: 14,
                                backgroundColor: COLOR_ACTIVE_BG,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}
                        >
                            {uploadedImage ? (
                                <img
                                    src={uploadedImage}
                                    alt="Uploaded"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-center px-4">
                                    <Camera size={48} style={{ color: COLOR_ACCENT }} />
                                    <p
                                        className="text-xs mt-3 opacity-80"
                                        style={{ color: COLOR_TEXT_DIM }}
                                    >
                                        Click to upload a clear photo of the affected
                                        skin / eye area.
                                    </p>
                                </div>
                            )}
                        </div>
                    </label>

                    <input
                        id="health-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />

                    <div className="mt-4 text-center">
                        <p className="text-xs opacity-80" style={{ color: COLOR_TEXT_DIM }}>
                            Detected Condition
                        </p>
                        <p className="text-sm font-semibold" style={{ color: COLOR_TEXT_DIM }}>
                            {loading ? "Analyzing..." : disease}
                        </p>
                        {error && (
                            <p className="text-xs mt-1" style={{ color: "#F97373" }}>
                                {error}
                            </p>
                        )}
                    </div>
                </Card>

                {/* RIGHT – AI Analysis */}
                <Card className="area-analysis" title="AI Health Analysis">
                    <div className="flex flex-col items-center justify-center flex-1 gap-4">
                        <div className="relative" style={{ width: 180, height: 180 }}>
                            <svg width="180" height="180" className="-rotate-90">
                                <circle cx="90" cy="90" r="70" stroke="#1C1C2C" strokeWidth="14" fill="none" />
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="70"
                                    stroke={COLOR_ACCENT}
                                    strokeWidth="14"
                                    fill="none"
                                    strokeDasharray="439"
                                    strokeDashoffset={439 - (439 * confidence) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-3xl font-bold" style={{ color: COLOR_TEXT_DIM }}>
                                {confidence}%
                            </p>
                            <p className="text-sm font-semibold mt-1 uppercase" style={{ color: COLOR_TEXT_DIM }}>
                                {confidenceLabel}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* BOTTOM – URGENT */}
                <Card className="area-urgent">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                            className="px-3 py-1 rounded-md font-bold text-[11px]"
                            style={{ backgroundColor: "#EF4444", color: "white" }}
                        >
                            URGENT
                        </span>
                        <span className="font-semibold text-sm" style={{ color: COLOR_TEXT_DIM }}>
                            Important Actions
                        </span>
                    </div>

                    <ul className="space-y-2 text-sm list-disc list-inside mb-6">
                        {(importantActions[disease] || [
                            "Consult a veterinarian for proper diagnosis and treatment.",
                        ]).map((item, index) => (
                            <li key={index} style={{ color: COLOR_TEXT_DIM }}>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col md:flex-row gap-3">
                        <button
                            className="px-4 py-2.5 rounded-lg font-bold w-full md:w-56"
                            style={{ backgroundColor: COLOR_ACCENT, color: "#0F172A" }}
                        >
                            BOOK VET CONSULTATION
                        </button>
                        <button
                            onClick={findVetsNearMe}
                            className="px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2 w-full md:w-56"
                            style={{
                                backgroundColor: "transparent",
                                borderColor: COLOR_BORDER,
                                color: COLOR_TEXT_DIM,
                            }}
                        >
                            <MapPin size={16} />
                            Find Vets Near Me
                        </button>
                    </div>
                </Card>
            </div>

            <style>{`
                .health-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    grid-template-rows: auto auto;
                    gap: 1.5rem;
                    grid-template-areas:
                      "upload analysis"
                      "urgent urgent";
                    width: 100%;
                }
                .area-upload { grid-area: upload; }
                .area-analysis { grid-area: analysis; }
                .area-urgent { grid-area: urgent; }

                @media (max-width: 900px) {
                    .health-grid {
                        grid-template-columns: 1fr;
                        grid-template-areas:
                          "upload"
                          "analysis"
                          "urgent";
                    }
                }
            `}</style>
        </section>
    );
};

export default HealthDetection;
