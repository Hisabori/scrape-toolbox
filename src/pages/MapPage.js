import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function MapPage() {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        fetch("http://172.16.2.196:5000/api/hospitals")
            .then(res => res.json())
            .then(data => {
                console.log("✅ 병원 데이터 불러오기 성공:", data);
                setHospitals(data);
            })
            .catch(err => console.error("❌ 병원 데이터 로드 실패:", err));
    }, []);

    useEffect(() => {
        console.log("🧭 hospitals 상태:", hospitals);
        console.log("🌍 window.google 존재 여부:", !!window.google);
    }, [hospitals]);

    const mapContainerStyle = {
        width: "100%",
        height: "500px",
    };

    const center = {
        lat: 37.5665, // 서울
        lng: 126.9780,
    };

    return (
        <div>
            <h1>🗺️ 응급의료기관 지도</h1>
            <LoadScript
                googleMapsApiKey="AIzaSyDlFQVk01OR-LF-N-t2nqnvpcQ4gLRo0JY"
                libraries={["places"]}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                >
                    {hospitals.map((hospital, index) => (
                        <Marker
                            key={index}
                            position={{ lat: hospital.lat, lng: hospital.lon }}
                            title={hospital.name}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
