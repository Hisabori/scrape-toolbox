// React + Bootstrap UI to display scraped doctor info with scroll blur effect
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

//TEST


export default function App() {
    const [doctors, setDoctors] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/doctors?dept=adult", {
                    method: "GET"
                });
                const data = await response.json();
                console.log("✅ 응답 데이터:", data);

                const formatted = data.map(doc => ({
                    name: doc.name || "이름 없음",
                    specialty: doc.specialty || "정보 없음",
                    experience: doc.experience || "정보 없음",
                    activity: doc.activity || "정보 없음",
                }));

                setDoctors(formatted);
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

    return (
        <div>
            <nav
                className={`navbar navbar-expand-lg fixed-top shadow-sm p-3 mb-5 bg-white ${
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
                </div>
            </nav>

            <div className="container mt-5 pt-5">
                <h2 className="my-4">성인정신과 의료진 목록</h2>
                {doctors.length === 0 ? (
                    <p className="text-muted">의료진 정보를 불러오는 중이거나 정보가 없습니다.</p>
                ) : (
                    <div className="row">
                        {doctors.map((doc, index) => (
                            <div className="col-md-6 mb-4" key={index}>
                                <div className="card shadow rounded-4 border-0 h-100">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">👨‍⚕️ {doc.name}</h5>
                                        <p className="card-text">
                                            <strong>진료분야:</strong> {doc.specialty}
                                        </p>
                                        <p className="card-text">
                                            <strong>주요경력:</strong> {doc.experience}
                                        </p>
                                        <p className="card-text">
                                            <strong>학회활동:</strong> {doc.activity}
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
