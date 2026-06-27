import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isSimulator = location.pathname === "/simulator";

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <nav
            id="main-navbar"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                height: "62px",
                display: "flex",
                alignItems: "center",
                padding: "0 2rem",
                background: "#fff",
                borderBottom: "1px solid #E4E4E7",
                transition: "box-shadow 0.2s",
                boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
            }}
        >
            {/* Logo */}
            <button
                id="nav-logo"
                onClick={() => navigate("/")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.02em",
                    color: "#0A0A0A",
                    padding: 0,
                }}
            >
                {/* Logo mark - simple square */}
                <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "#635BFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h4M8 7h4M7 2v4M7 8v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                PayPipeline
            </button>

            <div style={{ flex: 1 }} />

            {/* Landing nav links */}
            {!isSimulator && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginRight: "1rem" }}>
                    {[
                        { label: "How it works", id: "how-it-works" },
                        { label: "Pipeline", id: "pipeline-section" },
                        { label: "Features", id: "features-section" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() =>
                                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                            }
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#555",
                                fontSize: "0.875rem",
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                padding: "0.375rem 0.75rem",
                                borderRadius: 6,
                                transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#0A0A0A";
                                e.currentTarget.style.background = "#F4F4F5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#555";
                                e.currentTarget.style.background = "none";
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Right CTAs */}
            {isSimulator ? (
                <button
                    id="nav-back-btn"
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "1px solid #E4E4E7",
                        borderRadius: 8,
                        color: "#52525B",
                        padding: "0.375rem 0.875rem",
                        fontSize: "0.8125rem",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#0A0A0A";
                        e.currentTarget.style.borderColor = "#9CA3AF";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#52525B";
                        e.currentTarget.style.borderColor = "#E4E4E7";
                    }}
                >
                    ← Home
                </button>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#555",
                            fontSize: "0.875rem",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            padding: "0.375rem 0.75rem",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#0A0A0A"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#555"}
                    >
                        Sign in
                    </button>
                    <button
                        id="nav-launch-btn"
                        onClick={() => navigate("/simulator")}
                        style={{
                            background: "#635BFF",
                            border: "none",
                            borderRadius: 8,
                            color: "white",
                            padding: "0.5rem 1.125rem",
                            fontSize: "0.875rem",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#5148E8"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#635BFF"}
                    >
                        Get started →
                    </button>
                </div>
            )}
        </nav>
    );
}
