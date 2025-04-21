
import React, { useEffect, useState } from "react";
import "./TimeProgressBar.css";

export default function TimeProgressBar() {
    const [percentage, setPercentage] = useState(0);
    const [fakeMode, setFakeMode] = useState(false);
    const [fakeDate, setFakeDate] = useState(null);

    const getCurrentTime = () => {
        if (fakeMode && fakeDate) return fakeDate;
        return new Date();
    };

    useEffect(() => {
        const updateProgress = () => {
            const now = getCurrentTime();
            const day = now.getDay(); // 0 (Sun) ~ 6 (Sat)
            const hour = now.getHours();
            const minute = now.getMinutes();
            const totalMinutes = hour * 60 + minute;

            const open = 7 * 60; // 07:00
            const close = 18 * 60; // 18:00

            if (totalMinutes < open) {
                setPercentage(0);
            } else if (totalMinutes > close) {
                setPercentage(100);
            } else {
                const percent = ((totalMinutes - open) / (close - open)) * 100;
                setPercentage(percent);
            }
        };

        updateProgress();
        const interval = setInterval(updateProgress, 60000);
        return () => clearInterval(interval);
    }, [fakeMode, fakeDate]);

    const isLunchTime = () => {
        const now = getCurrentTime();
        const hour = now.getHours();
        return hour === 12;
    };

    const toggleTestTime = () => {
        if (fakeMode) {
            setFakeDate(null);
            setFakeMode(false);
        } else {
            const mock = new Date();
            mock.setHours(8);
            mock.setMinutes(45);
            mock.setSeconds(0);
            mock.setMilliseconds(0);
            mock.setDate(mock.getDate() - mock.getDay() + 1); // 월요일로 강제
            setFakeDate(mock);
            setFakeMode(true);
        }
    };

    return (
        <div className="time-bar-container">
            <div className="time-bar-label">
                출입 가능 시간: 07:00 ~ 18:00 {isLunchTime() && "🍱 점심시간 (12:00~13:00)"}
            </div>
            <div className="progress-wave">
                <div
                    className="wave"
                    style={{
                        width: `${percentage}%`,
                        animationPlayState: fakeMode ? "paused" : "running",
                    }}
                ></div>
            </div>
            <button className="btn btn-outline-secondary mt-2" onClick={toggleTestTime}>
                {fakeMode ? "✅ 테스트 시간 적용 중 (월 08:45)" : "테스트 시간 적용"}
            </button>
        </div>
    );
}
