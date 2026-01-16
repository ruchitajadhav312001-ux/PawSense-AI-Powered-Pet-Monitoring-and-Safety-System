import { useEffect } from "react";

const REPORT_API =
    "https://quantummechanical-tamesha-cytophagic.ngrok-free.dev/generate_report";

export default function Reports() {
    useEffect(() => {
        const data = localStorage.getItem("pawsense_report");

        if (!data) {
            alert("Please analyze image or audio first");
            return;
        }

        const download = async () => {
            const res = await fetch(REPORT_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "PawSense_Report.pdf";
            a.click();
        };

        download();
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <h2>Generating Report…</h2>
            <p>Your report will download automatically.</p>
        </div>
    );
}
