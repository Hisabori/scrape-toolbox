import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TimeProgressBar from "./TimeProgressBar"; // ✅ 추가된 부분

export default function App() {
    const [doctors, setDoctors] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("http://172.19.206.104:5000/api/doctors?dept=adult");
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

    const filteredDoctors = doctors.filter(
        (doc) =>
            doc.name.includes(search) ||
            doc.specialty.includes(search) ||
            doc.experience.includes(search) ||
            (doc.activity && doc.activity.includes(search))
    );

    return (
        <div>
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
                    <input
                        type="search"
                        className="form-control w-50 ms-auto"
                        placeholder="#해시태그로 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </nav>

            {/* ✅ 운영시간 프로그래스 바 추가 */}
            <div className="mt-5 pt-2">
                <TimeProgressBar />
            </div>

            <div className="container mt-3">
                <h2 className="my-4">성인정신과 의료진 목록</h2>
                {filteredDoctors.length === 0 ? (
                    <p className="text-muted">검색 결과가 없습니다.</p>
                ) : (
                    <div className="row">
                        {filteredDoctors.map((doc, index) => (
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
                )}
            </div>
        </div>
    );
}
