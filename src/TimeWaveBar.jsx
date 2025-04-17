import React, { useEffect, useState } from "react";
import "./TimeWaveBar.css";

const TimeWaveBar = () => {
    const [progress, setProgress] = useState(0);
    const [isOpenHours, setIsOpenHours] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    const getCurrentTimeString = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // 운영 시간: 08:30 ~ 17:50 → 총 560분
            const startMinutes = 8 * 60 + 30;
            const endMinutes = 17 * 60 + 50;
            const nowMinutes = hours * 60 + minutes;

            const ratio = Math.min(Math.max((nowMinutes - startMinutes) / (endMinutes - startMinutes), 0), 1);
            setProgress(ratio * 100);

            // 출입문 개방 시간: 07:00 ~ 18:00
            setIsOpenHours(nowMinutes >= 420 && nowMinutes <= 1080);

            // 현재 시간 문자열
            setCurrentTime(getCurrentTimeString());
        };

        update();
        const interval = setInterval(update, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="time-wave-bar-container text-center">
            <small className="text-muted d-block mb-1">
                현재 시각: <strong>{currentTime}</strong> |{" "}
                {isOpenHours ? "🔓 출입문 개방 중 (07:00~18:00)" : "🔒 출입문 닫힘"}
            </small>

            <div className="wave-bar">
                <div className="wave-progress" style={{ width: `${progress}%` }} />
                <div className="wave-lunch" />
            </div>

            <small className="text-muted">
                운영시간: <strong>08:30 ~ 17:50</strong> | 점심시간: <strong>12:00 ~ 13:00</strong>
            </small>
        </div>
    );
};

export default TimeWaveBar;
