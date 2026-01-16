import React, { useState } from "react";
import { Image as ImageIcon, PlusCircle } from "lucide-react";
import { supabase } from "../supabase";

export default function PetProfile() {
    /*  STATE */
    const [petType, setPetType] = useState("Dog");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [medicalFile, setMedicalFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        age: "",
        weight: "",
        sex: "",
        breed: "",
        other: "",
        medical: "",
        vet: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleReportChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMedicalFile(file);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const { data: authData, error: authError } =
                await supabase.auth.getUser();

            if (authError || !authData.user) {
                alert("User not logged in");
                return;
            }

            const user = authData.user;
            let imageUrl = "";
            let reportUrl = "";

            /* PET IMAGE UPLOAD */
            if (imageFile) {
                const imagePath = `${user.id}/${Date.now()}_${imageFile.name}`;

                const { error } = await supabase.storage
                    .from("pet-images")
                    .upload(imagePath, imageFile);

                if (error) throw error;

                imageUrl = supabase.storage
                    .from("pet-images")
                    .getPublicUrl(imagePath).data.publicUrl;
            }

            /* MEDICAL REPORT UPLOAD */
            if (medicalFile) {
                const reportPath = `${user.id}/${Date.now()}_${medicalFile.name}`;

                const { error } = await supabase.storage
                    .from("medical-report")
                    .upload(reportPath, medicalFile);

                if (error) throw error;

                reportUrl = supabase.storage
                    .from("medical-report")
                    .getPublicUrl(reportPath).data.publicUrl;
            }

            /* SAVE PET DATA */
            const { error } = await supabase.from("pets").insert([
                {
                    user_id: user.id,
                    pet_type: petType,
                    ...form,
                    image_url: imageUrl,
                    medical_report_url: reportUrl,
                },
            ]);

            if (error) throw error;

            alert("Pet profile created successfully");

            /* RESET */
            setForm({
                name: "",
                age: "",
                weight: "",
                sex: "",
                breed: "",
                other: "",
                medical: "",
                vet: "",
            });
            setPetType("Dog");
            setImageFile(null);
            setImagePreview(null);
            setMedicalFile(null);

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <div
                style={{
                    width: "520px",
                    maxHeight: "78vh",
                    overflowY: "auto",
                    background: "#fff",
                    borderRadius: 18,
                    padding: 24,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>
                    Create Pet Profile
                </h2>

                {/* IMAGE */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: "#EEF2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 10px",
                            overflow: "hidden",
                        }}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="pet"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <ImageIcon />
                        )}
                    </div>

                    <label
                        style={{
                            background: "#6366F1",
                            color: "#fff",
                            padding: "6px 14px",
                            borderRadius: 20,
                            cursor: "pointer",
                            display: "inline-block",
                        }}
                    >
                        Upload Image
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </label>
                </div>

                {/* PET TYPE */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                    {["Dog", "Cat", "Other"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setPetType(t)}
                            style={{
                                padding: "6px 16px",
                                borderRadius: 20,
                                border: "1px solid #CBD5E1",
                                background: petType === t ? "#6366F1" : "#fff",
                                color: petType === t ? "#fff" : "#111",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* FORM */}
                <div style={{ display: "grid", gap: 10 }}>
                    <label>Pet Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input" />

                    <label>Age (Years)</label>
                    <input name="age" value={form.age} onChange={handleChange} className="input" />

                    <label>Weight (kg)</label>
                    <input name="weight" value={form.weight} onChange={handleChange} className="input" />

                    <label>Sex</label>
                    <select name="sex" value={form.sex} onChange={handleChange} className="input">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <label>Breed</label>
                    <input name="breed" value={form.breed} onChange={handleChange} className="input" />

                    <label>Other</label>
                    <input name="other" value={form.other} onChange={handleChange} className="input" />

                    <label>Known Medical Issues / History</label>
                    <textarea
                        name="medical"
                        value={form.medical}
                        onChange={handleChange}
                        className="input"
                        rows={3}
                    />

                    <label>Primary Veterinarian Name (Optional)</label>
                    <input name="vet" value={form.vet} onChange={handleChange} className="input" />
                </div>

                {/* BUTTONS – SAME LINE */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 18,
                        gap: 12,
                    }}
                >
                    <label
                        style={{
                            background: "#6366F1",
                            color: "#fff",
                            padding: "10px 18px",
                            borderRadius: 20,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Upload Medical Report
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            hidden
                            onChange={handleReportChange}
                        />
                    </label>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            padding: "10px 22px",
                            borderRadius: 20,
                            border: "none",
                            background: "#6366F1",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Saving..." : "Add Pet"}
                        <PlusCircle size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                .input {
                    width: 100%;
                    padding: 8px 10px;
                    border-radius: 10px;
                    border: 1px solid #CBD5E1;
                }
            `}</style>
        </div>
    );
}
