// components/TestToggleButton.js
import React from "react";

export default function TestToggleButton({ showTestMark, toggleTestMark }) {
    return (
        <button
            className="btn btn-outline-primary my-3"
            onClick={toggleTestMark}
        >
            {showTestMark ? "✅ 월요일 오전 9:30" : "Test 버튼"}
        </button>
    );
}
