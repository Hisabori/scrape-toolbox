import React from "react";

export default function DoctorCard({ name, specialty, experience, activity }) {
    return (
        <div className="card shadow rounded-4 border-0 h-100">
            <div className="card-body">
                <h5 className="card-title fw-bold">👨‍⚕️ {name}</h5>
                <p><strong>진료분야:</strong> {specialty}</p>
                <p><strong>주요경력:</strong> {experience}</p>
                <p><strong>학회활동:</strong> {activity || "정보 없음"}</p>
            </div>
        </div>
    );
}
