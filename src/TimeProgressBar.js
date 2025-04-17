import React from "react";
import "./TimeProgressBar.css";

export default function TimeProgressBar() {
    const START_HOUR = 7;
    const END_HOUR = 18;
    const TOTAL_HOURS = END_HOUR - START_HOUR;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const progress =
        ((currentHour + currentMin / 60 - START_HOUR) / TOTAL_HOURS) * 100;

    return (
        <div className="time-bar-container px-3 pt-2">
            <p className="mb-2 fw-semibold">출입문 개방 시간: 07:00 ~ 18:00 (점심시간: 12:00 ~ 13:00)</p>
            <div className="progress position-relative rounded-4" style={{ height: "30px", backgroundColor: "#e9ecef" }}>
                {/* 점심시간 영역 (물결 효과) */}
                <div
                    className="wave-lunch"
                    style={{
                        left: `${(12 - START_HOUR) * 100 / TOTAL_HOURS}%`,
                        width: `${(1 * 100) / TOTAL_HOURS}%`,
                    }}
                ></div>

                {/* 현재 시각 진행 바 */}
                <div
                    className="progress-bar bg-success position-relative"
                    role="progressbar"
                    style={{
                        width: `${Math.min(progress, 100)}%`,
                        zIndex: 2,
                    }}
                >
                    {currentHour}:{currentMin.toString().padStart(2, "0")}
                </div>
            </div>
        </div>
    );
}
