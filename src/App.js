import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TestToggleButton from "./components/TestToggleButton"; // 분리된 버튼 컴포넌트 import

export default function App() {
    const [doctors, setDoctors] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [search, setSearch] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [timePercent, setTimePercent] = useState(0);
    const [showTestMark, setShowTestMark] = useState(false); // 테스트 버튼 상태

    const toggleTestMark = () => setShowTestMark((prev) => !prev);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                //NCMH
                const response = await fetch("http://172.16.2.196:5000/api/doctors?dept=adult");



                //시흥
                //const response = await fetch("http://192.168.45.233:5000/api/doctors?dept=adult");
                const data = await response.json();
                const filtered = data.filter((doc) => doc.name && doc.specialty && doc.experience);
                setDoctors(filtered);
            } catch (error) {
                console.error("❌ 데이터 요청 실패:", error);
            }
        };

        fetchDoctors();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateTimePercent = () => {
            const now = new Date();
            const start = new Date();
            start.setHours(7, 0, 0);
            const end = new Date();
            end.setHours(18, 0, 0);
            const total = end - start;
            const passed = now - start;
            const percent = Math.max(0, Math.min(100, (passed / total) * 100));
            setTimePercent(percent);
        };
        updateTimePercent();
        const interval = setInterval(updateTimePercent, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const getCurrentHour = () => new Date().getHours();
    const isDuringConsultation = () => {
        const hour = getCurrentHour();
        return hour >= 8 && hour < 18;
    };

    const filteredDoctors = doctors.filter((doc) => {
        const matchesSearch =
            doc.name.includes(search) ||
            doc.specialty.includes(search) ||
            doc.experience.includes(search) ||
            (doc.activity && doc.activity.includes(search));
        return matchesSearch && (isDuringConsultation() ? true : false);
    });

    return (
        <div className={isDarkMode ? "bg-dark text-white" : "bg-light text-dark"} style={{ minHeight: "100vh" }}>
            <nav
                className={`navbar navbar-expand-lg fixed-top shadow-sm p-3 mb-5 ${
                    isScrolled ? "backdrop-blur border-bottom" : "bg-opacity-100"
                }`}
                style={{
                    backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.75)" : "#fff",
                    backdropFilter: isScrolled ? "blur(10px)" : "none",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">
                        국립정신건강센터 의료진
                    </a>
                    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={toggleDarkMode}>
                        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                    <input
                        type="search"
                        className="form-control w-50 ms-2"
                        placeholder="#해시태그로 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </nav>

            <div className="container mt-5 pt-5">
                <div className="my-4">
                    <div className="d-flex justify-content-between">
                        <span>⏰ 출입문 개방시간 07:00~18:00</span>
                        <span>{timePercent.toFixed(1)}%</span>
                    </div>
                    <div className="progress rounded-pill overflow-hidden" style={{ height: "14px", background: "#e9ecef" }}>
                        <div
                            className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: `${timePercent}%` }}
                        />
                    </div>
                </div>

                {/* ✅ 테스트 버튼 */}
                <TestToggleButton showTestMark={showTestMark} toggleTestMark={toggleTestMark} />

                <h2 className="my-4">
                    성인정신과 의료진 목록{" "}
                    {!isDuringConsultation() && <span className="badge bg-warning text-dark">비진료시간</span>}
                </h2>

                {filteredDoctors.length === 0 ? (
                    <p className="text-muted">검색 결과가 없거나 현재 진료 중인 의사가 없습니다.</p>
                ) : (
                    <div className="row">
                        {filteredDoctors.map((doc, index) => (
                            <div className="col-md-6 mb-4" key={index}>
                                <div className={`card shadow rounded-4 border-0 h-100 ${isDarkMode ? "bg-secondary text-white" : ""}`}>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">
                                            👨‍⚕️ {doc.name}
                                            {showTestMark && index === 0 && " ✅"} {/* 테스트 마크 표시 */}
                                        </h5>
                                        <p className="card-text">
                                            <strong>진료분야:</strong> {doc.specialty}
                                        </p>
                                        <p className="card-text">
                                            <strong>주요경력:</strong> {doc.experience}
                                        </p>
                                        <p className="card-text">
                                            <strong>학회활동:</strong> {doc.activity || "정보 없음"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
