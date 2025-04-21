import React, { useEffect, useState } from "react";

export default function MapPage() {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/hospitals") // ★ IP 수정: localhost 사용!
            .then(res => res.json())
            .then(data => setHospitals(data))
            .catch(err => console.error("❌ 병원 데이터 로드 실패:", err));
    }, []);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (!window.google?.maps) {  // 수정: google.maps 까지 체크
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDlFQVk01OR-LF-N-t2nqnvpcQ4gLRo0JY&libraries=places`;
                script.async = true;   // ✅ 비동기
                script.defer = true;   // ✅ defer 추가
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                initMap();
            }
        };

        const initMap = () => {
            if (!document.getElementById("map")) {
                console.error("❌ map div가 없습니다!");
                return;
            }

            if (hospitals.length === 0) return;

            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: 37.5665, lng: 126.9780 },
                zoom: 10,
            });

            hospitals.forEach(hospital => {
                new window.google.maps.Marker({
                    position: { lat: hospital.lat, lng: hospital.lon },
                    map: map,
                    title: hospital.name,
                });
            });
        };

        loadGoogleMapsScript();
    }, [hospitals]);


    return (
        <div>
            <h1>🗺️ 응급의료기관 지도</h1>
            <div id="map" style={{ width: "100%", height: "500px" }}></div>
        </div>
    );
}
