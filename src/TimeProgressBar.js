// TimeProgressBar.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TimeProgressBar() {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const start = new Date();
            const end = new Date();

            start.setHours(8, 30, 0);
            end.setHours(17, 50, 0);

            const lunchStart = new Date();
            const lunchEnd = new Date();
            lunchStart.setHours(12, 0, 0);
            lunchEnd.setHours(13, 0, 0);

            const totalTime = end - start;
            const elapsed = now - start;

            const clampedElapsed = Math.max(0, Math.min(elapsed, totalTime));
            const percent = (clampedElapsed / totalTime) * 100;
            setPercentage(percent);
        };

        updateTime();
        const interval = setInterval(updateTime, 60 * 1000); // 매 1분마다 업데이트
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between">
                <span>🕗 8:30</span>
                <span>🍽 점심 12:00~13:00</span>
                <span>🕔 17:50</span>
            </div>
            <div className="progress my-2" style={{ height: "30px", borderRadius: "15px" }}>
                {/* 전체 시간 진행 바 */}
                <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${percentage}%` }}
                >
                    <strong>{Math.round(percentage)}%</strong>
                </div>

                {/* 점심 시간 영역 표시 (절대 위치) */}
                <div
                    style={{
                        position: "absolute",
                        left: `${((12.0 - 8.5) / (17.833 - 8.5)) * 100}%`,
                        width: `${(1 / (17.833 - 8.5)) * 100}%`,
                        height: "30px",
                        backgroundColor: "rgba(255, 193, 7, 0.5)",
                        zIndex: 0,
                    }}
                ></div>
            </div>
        </div>
    );
}
