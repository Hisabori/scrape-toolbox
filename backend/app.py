from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# 진료과 코드 매핑
DEPT_URL_MAP = {
    "adult": "A",
    "senior": "G",
    "child": "B",
}

@app.route('/api/doctors')
def get_doctors():
    print("🚀 /api/doctors 요청 들어옴")  # ✅ 요기!

    dept = request.args.get('dept', 'adult')
    part_cate = DEPT_URL_MAP.get(dept, "A")

    url = f"https://www.ncmh.go.kr/medical/board/deptMemberList.do?part_cate={part_cate}&menu_cd=01_03_00_01"
    res = requests.get(url)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text, 'html.parser')

    doctors = []
    for li in soup.select('.medical_team_introduction > ul > li'):
        name = li.select_one('.mtip_name')
        specialty = li.select_one("span.mtil_title:contains('진료분야') + p")
        experience = li.select_one("span.mtil_title:contains('주요경력') + p")
        activity = li.select_one("span.mtil_title:contains('학회활동') + p")

        doctors.append({
            "name": name.get_text(strip=True) if name else "",
            "specialty": specialty.get_text(strip=True) if specialty else "",
            "experience": experience.get_text(strip=True) if experience else "",
            "activity": activity.get_text(strip=True) if activity else ""
        })

    print(f"📦 총 {len(doctors)}명 수집됨")
    return jsonify(doctors)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
