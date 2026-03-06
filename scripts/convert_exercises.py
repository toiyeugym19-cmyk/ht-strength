#!/usr/bin/env python3
"""
Script download exercise database từ yuhonas/free-exercise-db GitHub
và convert sang TypeScript format cho app gym
"""
import urllib.request
import json
import re
import os

URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
OUTPUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data", "exerciseDB_github.ts")

MUSCLE_MAP = {
    "abdominals": "Bụng",
    "abductors": "Dạng Hông",
    "adductors": "Khép Hông",
    "biceps": "Tay Trước (Biceps)",
    "calves": "Bắp Chân",
    "chest": "Ngực",
    "forearms": "Cẳng Tay",
    "glutes": "Mông (Glutes)",
    "hamstrings": "Đùi Sau (Hamstrings)",
    "hip flexors": "Gập Hông",
    "it band": "IT Band",
    "lats": "Xô (Lats)",
    "lower back": "Lưng Dưới",
    "middle back": "Lưng Giữa",
    "neck": "Cổ",
    "quadriceps": "Đùi Trước (Quads)",
    "shoulders": "Vai",
    "triceps": "Tay Sau (Triceps)",
    "traps": "Cầu Vai (Traps)",
    "upper back": "Lưng Trên",
}

EQUIPMENT_MAP = {
    "barbell": "Thanh đòn",
    "body only": "Thể trọng",
    "cable": "Máy cáp",
    "dumbbell": "Tạ đơn",
    "e-z curl bar": "EZ Bar",
    "exercise ball": "Bóng tập",
    "foam roll": "Con lăn bọt",
    "kettlebells": "Tạ ấm (Kettlebell)",
    "machine": "Máy tập",
    "medicine ball": "Bóng y tế",
    "other": "Dụng cụ khác",
    "bands": "Dây kháng lực",
    "none": "Không cần dụng cụ",
}

CATEGORY_TARGET_MAP = {
    "strength": "Gym/Tập Lực",
    "stretching": "Gym/Giãn Cơ",
    "cardio": "Cardio",
    "plyometrics": "Cardio/Plyometrics",
    "powerlifting": "Gym/Powerlifting",
    "olympic weightlifting": "Gym/Cử Tạ",
    "strongman": "Gym/Strongman",
}

MUSCLE_CATEGORY = {
    "abdominals": "Gym/Bụng",
    "abductors": "Gym/Chân",
    "adductors": "Gym/Chân",
    "biceps": "Gym/Tay",
    "calves": "Gym/Chân",
    "chest": "Gym/Ngực",
    "forearms": "Gym/Tay",
    "glutes": "Gym/Chân",
    "hamstrings": "Gym/Chân",
    "lats": "Gym/Lưng",
    "lower back": "Gym/Lưng",
    "middle back": "Gym/Lưng",
    "neck": "Gym/Khác",
    "quadriceps": "Gym/Chân",
    "shoulders": "Gym/Vai",
    "triceps": "Gym/Tay",
    "traps": "Gym/Vai",
    "upper back": "Gym/Lưng",
}

def map_muscle(m):
    return MUSCLE_MAP.get(m.lower(), m.title())

def map_equipment(e):
    if not e:
        return "Thể trọng"
    return EQUIPMENT_MAP.get(e.lower(), e.title())

def get_target(ex):
    cat = ex.get("category", "").lower()
    primary = ex.get("primaryMuscles", [])
    if cat in ["cardio", "plyometrics"]:
        return CATEGORY_TARGET_MAP.get(cat, "Cardio")
    if primary:
        return MUSCLE_CATEGORY.get(primary[0].lower(), CATEGORY_TARGET_MAP.get(cat, "Gym/Tập Lực"))
    return CATEGORY_TARGET_MAP.get(cat, "Gym/Tập Lực")

def map_level(level):
    m = {"beginner": "beginner", "intermediate": "intermediate", "expert": "advanced"}
    return m.get(level, "intermediate")

def safe_ts_str(s):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${").replace("'", "\\'")

print(f"📥 Downloading exercise DB from GitHub...")
with urllib.request.urlopen(URL, timeout=30) as r:
    raw = r.read().decode("utf-8")
exercises = json.loads(raw)
print(f"✅ Loaded {len(exercises)} exercises")

# Filter out duplicates by name (keep first occurrence), and filter useful ones
seen_names = set()
unique = []
for ex in exercises:
    name = ex["name"].lower().strip()
    if name not in seen_names:
        seen_names.add(name)
        unique.append(ex)

print(f"✅ Unique exercises: {len(unique)}")

# Generate TypeScript
lines = []
lines.append("// ============================================================")
lines.append("// AUTO-GENERATED from yuhonas/free-exercise-db (GitHub)")
lines.append(f"// Source: https://github.com/yuhonas/free-exercise-db")
lines.append(f"// Total: {len(unique)} exercises")
lines.append("// ============================================================")
lines.append("")
lines.append("export interface GithubExercise {")
lines.append("  id: string;")
lines.append("  name: string;")
lines.append("  nameEn: string;")
lines.append("  target: string;")
lines.append("  equipment: string;")
lines.append("  difficulty: 'beginner' | 'intermediate' | 'advanced';")
lines.append("  primaryMuscle: string;")
lines.append("  secondaryMuscles: string[];")
lines.append("  instructions: string[];")
lines.append("  category: string;")
lines.append("  gifUrl?: string;")
lines.append("}")
lines.append("")
lines.append("export const GITHUB_EXERCISE_DB: GithubExercise[] = [")

for i, ex in enumerate(unique):
    raw_id = ex.get("id", f"gh-{i:04d}")
    safe_id = re.sub(r"[^a-zA-Z0-9_-]", "_", raw_id)
    
    name_en = ex.get("name", "")
    primary_muscles = ex.get("primaryMuscles", [])
    secondary_muscles = ex.get("secondaryMuscles", [])
    category = ex.get("category", "strength")
    level = ex.get("level", "beginner")
    equipment = ex.get("equipment")
    instructions = ex.get("instructions", [])
    
    primary_vn = map_muscle(primary_muscles[0]) if primary_muscles else "Toàn thân"
    secondary_vn = [map_muscle(m) for m in secondary_muscles]
    equipment_vn = map_equipment(equipment)
    target = get_target(ex)
    difficulty = map_level(level)
    
    # Build GIF URL from yuhonas images
    images = ex.get("images", [])
    gif_url = ""
    if images:
        # Use jsDelivr CDN for images
        img_path = images[0]
        gif_url = f"https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/{img_path}"
    
    lines.append("  {")
    lines.append(f"    id: 'gh-{safe_id}',")
    lines.append(f"    name: '{safe_ts_str(name_en)}',")
    lines.append(f"    nameEn: '{safe_ts_str(name_en)}',")
    lines.append(f"    target: '{target}',")
    lines.append(f"    equipment: '{equipment_vn}',")
    lines.append(f"    difficulty: '{difficulty}',")
    lines.append(f"    primaryMuscle: '{primary_vn}',")
    
    sec_str = ", ".join([f"'{m}'" for m in secondary_vn])
    lines.append(f"    secondaryMuscles: [{sec_str}],")
    lines.append(f"    category: '{category}',")
    
    if gif_url:
        lines.append(f"    gifUrl: '{gif_url}',")
    
    lines.append(f"    instructions: [")
    for inst in instructions:
        lines.append(f"      '{safe_ts_str(inst)}',")
    lines.append(f"    ],")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export default GITHUB_EXERCISE_DB;")

output_content = "\n".join(lines)
with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write(output_content)

print(f"✅ Written to: {OUTPUT}")
print(f"📊 Stats:")
cats = {}
for ex in unique:
    c = ex.get("category", "other")
    cats[c] = cats.get(c, 0) + 1
for c, count in sorted(cats.items(), key=lambda x: -x[1]):
    print(f"  {c}: {count}")
