// React + Bootstrap UI to display scraped doctor info with scroll blur effect

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


// React + Bootstrap UI to display scraped doctor info with scroll blur effect


export default function App() {
    const [doctors, setDoctors] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            console.log("🚀 fetchDoctors 호출됨");

            try {
                console.log("🌐 fetch 요청 시작");
                const response = await fetch("/api/doctors?dept=adult");
                const data = await response.json();
                console.log("🔥 백엔드 응답 데이터:", data);

                const filtered = data.filter(
                    (doc) => doc.name && doc.specialty && doc.experience
                );
                setDoctors(filtered);

                console.log("✅ 데이터 성공적으로 로딩됨");
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
                    <>
                        //디버깅용
                        {/* <pre className="bg-light p-3 rounded-3">{JSON.stringify(doctors, null, 2)}</pre> */}

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
                                                <strong>학회활동:</strong> {doc.activity || "정보 없음"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
