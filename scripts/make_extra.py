#!/usr/bin/env python3
"""
Tạo exerciseDB_extra.ts chứa bài tập từ GitHub,
không chạm vào exerciseDB.ts gốc.
"""
import urllib.request, json, re, os

SRC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data")
ORIG    = os.path.join(SRC_DIR, "exerciseDB.ts")
OUT     = os.path.join(SRC_DIR, "exerciseDB_extra.ts")
URL     = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"

MUSCLE_MAP = {
    "abdominals":"Cơ Bụng","abductors":"Dạng Hông","adductors":"Cơ Khép",
    "biceps":"Tay Trước (Biceps)","calves":"Bắp Chân","chest":"Cơ Ngực",
    "forearms":"Cẳng Tay","glutes":"Mông (Glutes)","hamstrings":"Đùi Sau",
    "hip flexors":"Gập Hông","lats":"Cơ Lưng Xô (Lats)","lower back":"Lưng Dưới",
    "middle back":"Lưng Giữa","neck":"Cổ","quadriceps":"Đùi Trước (Quads)",
    "shoulders":"Vai","triceps":"Tay Sau (Triceps)","traps":"Cầu Vai (Traps)",
    "upper back":"Lưng Trên",
}
EQUIP_MAP = {
    "barbell":"Thanh đòn","body only":"Thể trọng","cable":"Máy cáp",
    "dumbbell":"Tạ đơn","e-z curl bar":"EZ Bar","exercise ball":"Bóng tập",
    "foam roll":"Con lăn bọt","kettlebells":"Tạ ấm (Kettlebell)","machine":"Máy tập",
    "medicine ball":"Bóng y tế","bands":"Dây kháng lực","other":"Dụng cụ khác",
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
    "cardio":"Cardio","plyometrics":"Cardio/Plyometrics",
    "powerlifting":"Gym/Powerlifting","olympic weightlifting":"Gym/Cử Tạ",
    "strongman":"Gym/Strongman","stretching":"Gym/Giãn Cơ",
}
LEVEL_MAP = {"beginner":"beginner","intermediate":"intermediate","expert":"advanced"}

def vn_muscle(m): return MUSCLE_MAP.get(m.lower(), m.title())
def vn_equip(e):  return EQUIP_MAP.get((e or "").lower(), (e or "Thể trọng").title())
def get_target(ex):
    cat = ex.get("category","").lower()
    pm  = ex.get("primaryMuscles",[])
    if cat in CAT_TARGET: return CAT_TARGET[cat]
    if pm: return MUSCLE_TARGET.get(pm[0].lower(), "Gym/Tập Lực")
    return "Gym/Tập Lực"
def safe(s): return s.replace("\\","\\\\").replace("'","\\'")

# Đọc tên tiếng Anh đã có trong file gốc
print("📖 Reading original exerciseDB.ts...")
with open(ORIG, encoding="utf-8") as f:
    orig = f.read()
# Lấy all name values trong file gốc
existing = set(n.lower() for n in re.findall(r"name:\s*'([^']+)'", orig))
print(f"  Found {len(existing)} existing exercise names")

# Tải GitHub
print("📥 Downloading from GitHub...")
with urllib.request.urlopen(URL, timeout=30) as r:
    gh = json.loads(r.read().decode("utf-8"))
print(f"✅ {len(gh)} exercises from GitHub")

# Lọc bài mới
new_exs, seen = [], set()
for ex in gh:
    n = ex.get("name","").strip()
    nl = n.lower()
    if nl in existing or nl in seen: continue
    seen.add(nl)
    new_exs.append(ex)
print(f"➕ New exercises to add: {len(new_exs)}")

# Tạo file mới
out_lines = []
out_lines.append("// ================================================================")
out_lines.append("// exerciseDB_extra.ts")
out_lines.append("// Auto-generated từ yuhonas/free-exercise-db (GitHub)")
out_lines.append("// https://github.com/yuhonas/free-exercise-db")
out_lines.append(f"// Tổng: {len(new_exs)} bài tập")
out_lines.append("// ================================================================")
out_lines.append("")
out_lines.append("import type { Exercise } from './exerciseDB';")
out_lines.append("")
out_lines.append("export const EXTRA_EXERCISES: Exercise[] = [")

for i, ex in enumerate(new_exs):
    raw_id = ex.get("id", f"gh-{i:04d}")
    safe_id = re.sub(r"[^a-zA-Z0-9_-]","_", raw_id)
    name_en = ex.get("name","")
    pm      = ex.get("primaryMuscles",[])
    sm      = ex.get("secondaryMuscles",[])
    level   = ex.get("level","beginner")
    equip   = ex.get("equipment")
    insts   = ex.get("instructions",[])
    images  = ex.get("images",[])

    primary_vn = vn_muscle(pm[0]) if pm else "Toàn thân"
    sec_vn     = [vn_muscle(m) for m in sm]
    equip_vn   = vn_equip(equip)
    target     = get_target(ex)
    diff       = LEVEL_MAP.get(level,"beginner")
    gif_url    = f"https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/{images[0]}" if images else ""

    out_lines.append("    {")
    out_lines.append(f"        id: 'gh-{safe_id}',")
    out_lines.append(f"        name: '{safe(name_en)}',")
    out_lines.append(f"        target: '{target}',")
    out_lines.append(f"        equipment: '{equip_vn}',")
    out_lines.append(f"        difficulty: '{diff}',")
    out_lines.append(f"        primaryMuscle: '{primary_vn}',")
    out_lines.append(f"        secondaryMuscles: [{', '.join(repr(m) for m in sec_vn)}],")
    if gif_url:
        out_lines.append(f"        gifUrl: '{gif_url}',")
    out_lines.append(f"        instructions: [")
    for inst in insts[:6]:
        out_lines.append(f"            '{safe(inst)}',")
    out_lines.append(f"        ],")
    out_lines.append("    },")

out_lines.append("];")
out_lines.append("")
out_lines.append("export default EXTRA_EXERCISES;")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

kb = os.path.getsize(OUT) // 1024
print(f"✅ Written: {OUT} ({kb} KB)")
