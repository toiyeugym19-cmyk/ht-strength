#!/usr/bin/env python3
"""
Merge GitHub exercise DB vào exerciseDB.ts hiện có,
chỉ thêm bài tập mới chưa có trong file gốc.
Sử dụng ảnh từ jsDelivr CDN của yuhonas/free-exercise-db.
"""
import urllib.request, json, re, os

SRC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data")
ORIG = os.path.join(SRC_DIR, "exerciseDB.ts")
OUT  = os.path.join(SRC_DIR, "exerciseDB.ts")
URL  = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"

MUSCLE_MAP = {
    "abdominals":"Cơ Bụng","abductors":"Dạng Hông","adductors":"Cơ Khép (Adductors)",
    "biceps":"Tay Trước (Biceps)","calves":"Bắp Chân","chest":"Cơ Ngực",
    "forearms":"Cẳng Tay","glutes":"Mông (Glutes)","hamstrings":"Đùi Sau (Hamstrings)",
    "hip flexors":"Gập Hông","lats":"Cơ Lưng Xô (Lats)","lower back":"Lưng Dưới",
    "middle back":"Lưng Giữa","neck":"Cổ","quadriceps":"Đùi Trước (Quads)",
    "shoulders":"Vai","triceps":"Tay Sau (Triceps)","traps":"Cầu Vai (Traps)","upper back":"Lưng Trên",
}
EQUIP_MAP = {
    "barbell":"Thanh đòn","body only":"Thể trọng","cable":"Máy cáp","dumbbell":"Tạ đơn",
    "e-z curl bar":"EZ Bar","exercise ball":"Bóng tập","foam roll":"Con lăn bọt",
    "kettlebells":"Tạ ấm (Kettlebell)","machine":"Máy tập","medicine ball":"Bóng y tế",
    "bands":"Dây kháng lực","other":"Dụng cụ khác","none":"Không cần dụng cụ",
}
MUSCLE_TARGET = {
    "abdominals":"Gym/Bụng","abductors":"Gym/Chân","adductors":"Gym/Chân",
    "biceps":"Gym/Tay","calves":"Gym/Chân","chest":"Gym/Ngực","forearms":"Gym/Tay",
    "glutes":"Gym/Chân","hamstrings":"Gym/Chân","lats":"Gym/Lưng",
    "lower back":"Gym/Lưng","middle back":"Gym/Lưng","neck":"Gym/Khác",
    "quadriceps":"Gym/Chân","shoulders":"Gym/Vai","triceps":"Gym/Tay",
    "traps":"Gym/Vai","upper back":"Gym/Lưng",
}
CAT_TARGET = {
    "cardio":"Cardio","plyometrics":"Cardio/Plyometrics","powerlifting":"Gym/Powerlifting",
    "olympic weightlifting":"Gym/Cử Tạ","strongman":"Gym/Strongman","stretching":"Gym/Giãn Cơ",
}
LEVEL_MAP = {"beginner":"beginner","intermediate":"intermediate","expert":"advanced"}

def vn_muscle(m): return MUSCLE_MAP.get(m.lower(), m.title())
def vn_equip(e): return EQUIP_MAP.get((e or "").lower(), (e or "Thể trọng").title())
def get_target(ex):
    cat = ex.get("category","").lower()
    pm  = ex.get("primaryMuscles",[])
    if cat in CAT_TARGET: return CAT_TARGET[cat]
    if pm: return MUSCLE_TARGET.get(pm[0].lower(), "Gym/Tập Lực")
    return "Gym/Tập Lực"
def safe(s): return s.replace("\\","\\\\").replace("'","\\'")
def make_id(raw_id): return re.sub(r"[^a-zA-Z0-9_-]","_", raw_id)

# Đọc file gốc để lấy tên các bài đã có
with open(ORIG, encoding="utf-8") as f:
    orig_content = f.read()

# Lấy tên tiếng Anh đã có trong file gốc (theo trường nameEn hoặc name)
existing_en = set(re.findall(r"nameEn:\s*'([^']+)'", orig_content))
# Lấy các name bài tập tiếng Việt (để không trùng)
existing_names = set(re.findall(r"name:\s*'([^']+)'", orig_content))

print(f"📖 Existing exercises in file: {len(existing_en)} (by nameEn)")

# Tải GitHub DB
print("📥 Downloading from GitHub...")
with urllib.request.urlopen(URL, timeout=30) as r:
    gh_exercises = json.loads(r.read().decode("utf-8"))
print(f"✅ GitHub DB: {len(gh_exercises)} exercises")

# Chỉ lấy bài tập CHƯA có trong file
new_exercises = []
seen = set()
for ex in gh_exercises:
    name_en = ex.get("name","").strip()
    if name_en.lower() in existing_en or name_en.lower() in seen:
        continue
    seen.add(name_en.lower())
    new_exercises.append(ex)

print(f"➕ New exercises to add: {len(new_exercises)}")

# Nhóm bài mới theo category để thêm vào
lines = []
lines.append("\n    // ============================================================")
lines.append(f"    // GITHUB DB: yuhonas/free-exercise-db ({len(new_exercises)} bài tập)")
lines.append("    // https://github.com/yuhonas/free-exercise-db")
lines.append("    // ============================================================")

# Nhóm theo target muscle
grouped = {}
for ex in new_exercises:
    cat = ex.get("category","strength")
    pm  = ex.get("primaryMuscles",[])
    group_key = pm[0].lower() if pm else cat
    grouped.setdefault(group_key, []).append(ex)

group_order = ["chest","lats","middle back","upper back","lower back",
               "quadriceps","hamstrings","glutes","calves","abductors","adductors",
               "shoulders","traps","biceps","triceps","forearms",
               "abdominals","cardio","plyometrics","powerlifting","olympic weightlifting","strongman"]
# Sắp xếp theo thứ tự ưu tiên
all_keys = group_order + [k for k in grouped if k not in group_order]
SECTION_NAMES = {
    "chest":"Ngực","lats":"Lưng Xô","middle back":"Lưng Giữa","upper back":"Lưng Trên",
    "lower back":"Lưng Dưới","quadriceps":"Đùi Trước","hamstrings":"Đùi Sau",
    "glutes":"Mông","calves":"Bắp Chân","abductors":"Dạng Hông","adductors":"Khép Hông",
    "shoulders":"Vai","traps":"Cầu Vai","biceps":"Tay Trước","triceps":"Tay Sau",
    "forearms":"Cẳng Tay","abdominals":"Bụng","cardio":"Cardio",
    "plyometrics":"Plyometrics","powerlifting":"Powerlifting",
    "olympic weightlifting":"Cử Tạ Olympic","strongman":"Strongman",
}

counter = 0
for key in all_keys:
    exs = grouped.get(key)
    if not exs: continue
    section_vn = SECTION_NAMES.get(key, key.title())
    lines.append(f"\n    // --- {section_vn.upper()} (GitHub) ---")
    for i, ex in enumerate(exs):
        raw_id = ex.get("id", f"gh-{key[:3]}-{i:03d}")
        safe_id = make_id(raw_id)
        name_en = ex.get("name","")
        pm = ex.get("primaryMuscles",[])
        sm = ex.get("secondaryMuscles",[])
        cat = ex.get("category","strength")
        level = ex.get("level","beginner")
        equip = ex.get("equipment")
        insts = ex.get("instructions",[])
        images = ex.get("images",[])

        primary_vn = vn_muscle(pm[0]) if pm else "Toàn thân"
        sec_vn = [vn_muscle(m) for m in sm]
        equip_vn = vn_equip(equip)
        target = get_target(ex)
        diff = LEVEL_MAP.get(level,"beginner")
        
        gif_url = ""
        if images:
            gif_url = f"https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/{images[0]}"

        lines.append("    {")
        lines.append(f"        id: 'gh-{safe_id}',")
        lines.append(f"        name: '{safe(name_en)}',")
        lines.append(f"        nameEn: '{safe(name_en)}',")
        lines.append(f"        target: '{target}',")
        lines.append(f"        equipment: '{equip_vn}',")
        lines.append(f"        difficulty: '{diff}',")
        lines.append(f"        primaryMuscle: '{primary_vn}',")
        sec_str = ", ".join([f"'{m}'" for m in sec_vn])
        lines.append(f"        secondaryMuscles: [{sec_str}],")
        if gif_url:
            lines.append(f"        gifUrl: '{safe(gif_url)}',")
        lines.append(f"        instructions: [")
        for inst in insts[:6]:  # Giới hạn 6 bước
            lines.append(f"            '{safe(inst)}',")
        lines.append(f"        ],")
        lines.append("    },")
        counter += 1

print(f"✅ Generated {counter} exercise entries")

# Chèn vào trước dòng `];` cuối cùng của EXERCISE_DB array
injection = "\n".join(lines)
# Tìm vị trí `];` kết thúc array EXERCISE_DB
pattern = r'(\];\s*\nexport const CALCULATORS)'
replacement = injection + "\n];\nexport const CALCULATORS"

new_content = re.sub(pattern, replacement, orig_content, count=1)
if new_content == orig_content:
    # Thử pattern khác
    new_content = orig_content.replace("];\n\nexport const CALCULATORS", injection + "\n];\n\nexport const CALCULATORS", 1)
    
with open(OUT, "w", encoding="utf-8") as f:
    f.write(new_content)

file_size = os.path.getsize(OUT)
print(f"✅ Updated: {OUT}")
print(f"📁 File size: {file_size/1024:.1f} KB")
print(f"🎉 Done! Tổng cộng đã thêm {counter} bài tập mới từ GitHub!")
