#!/usr/bin/env python3
"""
Tạo mega_database_extra.ts từ GitHub exercise DB
Tuân theo UniversalExercise interface của mega_database.ts
"""
import urllib.request, json, re, os

SRC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data")
OUT     = os.path.join(SRC_DIR, "mega_database_extra.ts")
URL     = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"

# Mapping to UniversalExercise interface
MUSCLE_MAP = {
    "abdominals":"abdominals","abductors":"abductors","adductors":"adductors",
    "biceps":"biceps","calves":"calves","chest":"chest","forearms":"forearms",
    "glutes":"glutes","hamstrings":"hamstrings","hip flexors":"abductors",
    "lats":"lats","lower back":"lower_back","middle back":"middle_back",
    "neck":"neck","quadriceps":"quadriceps","shoulders":"shoulders",
    "triceps":"triceps","traps":"traps","upper back":"middle_back",
}
CAT_MAP = {
    "strength":"strength","stretching":"stretching","cardio":"cardio",
    "plyometrics":"plyometrics","powerlifting":"powerlifting",
    "olympic weightlifting":"olympic_weightlifting","strongman":"strongman",
}
LEVEL_MAP = {"beginner":"beginner","intermediate":"intermediate","expert":"expert"}
EQUIP_MAP = {
    "barbell":"barbell","body only":"body_only","cable":"cable","dumbbell":"dumbbell",
    "e-z curl bar":"ez_bar","exercise ball":"exercise_ball","foam roll":"foam_roll",
    "kettlebells":"kettlebell","machine":"machine","medicine ball":"medicine_ball",
    "bands":"bands","other":"other",
}

def safe(s): return s.replace("\\","\\\\").replace("'","\\'")
def map_m(m): return MUSCLE_MAP.get(m.lower(), "shoulders")
def map_cat(c): return CAT_MAP.get(c.lower(), "strength")
def map_level(l): return LEVEL_MAP.get(l, "beginner")
def map_equip(e): return EQUIP_MAP.get((e or "").lower(), "other")

EXISTING_NAMES = {
    "barbell bench press","incline dumbbell press","weighted chest dip",
    "barbell squat (high bar)","leg press","romanian deadlift","conventional deadlift",
    "pull up","overhead press","lateral raise","barbell curl","tricep pushdown",
    "treadmill hiit sprints","concept2 rowing"
}

print("📥 Downloading GitHub exercise DB...")
with urllib.request.urlopen(URL, timeout=30) as r:
    gh = json.loads(r.read().decode("utf-8"))
print(f"✅ {len(gh)} exercises loaded")

new_exs, seen = [], set()
for ex in gh:
    n = ex.get("name","").strip()
    nl = n.lower()
    if nl in EXISTING_NAMES or nl in seen: continue
    seen.add(nl)
    new_exs.append(ex)
print(f"➕ New exercises: {len(new_exs)}")

out = []
out.append("// ========================================================")
out.append("// mega_database_extra.ts")
out.append("// Auto-generated từ yuhonas/free-exercise-db (GitHub)")
out.append("// https://github.com/yuhonas/free-exercise-db")
out.append(f"// {len(new_exs)} bài tập - có ảnh từ jsDelivr CDN")
out.append("// ========================================================")
out.append("")
out.append("import type { UniversalExercise } from './mega_database';")
out.append("")
out.append("export const EXTRA_EXERCISE_DB: UniversalExercise[] = [")

for i, ex in enumerate(new_exs):
    raw_id   = ex.get("id", f"gh_{i:04d}")
    safe_id  = re.sub(r"[^a-zA-Z0-9_]", "_", raw_id).lower()
    name     = ex.get("name","")
    pm       = ex.get("primaryMuscles",[])
    cat      = ex.get("category","strength")
    level    = ex.get("level","beginner")
    equip    = ex.get("equipment")
    insts    = ex.get("instructions",[])
    images   = ex.get("images",[])

    muscle   = map_m(pm[0]) if pm else "shoulders"
    ex_type  = map_cat(cat)
    diff     = map_level(level)
    equipment= map_equip(equip)
    gif_url  = f"https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/{images[0]}" if images else ""

    out.append("    {")
    out.append(f"        id: 'gh_{safe_id}',")
    out.append(f"        name: '{safe(name)}',")
    out.append(f"        type: '{ex_type}',")
    out.append(f"        muscle: '{muscle}',")
    out.append(f"        equipment: '{equipment}',")
    out.append(f"        difficulty: '{diff}',")
    if gif_url:
        out.append(f"        gifUrl: '{gif_url}',")
    out.append(f"        instructions: [")
    for inst in insts[:5]:
        out.append(f"            '{safe(inst)}',")
    out.append(f"        ],")
    out.append("    },")

out.append("];")
out.append("")
out.append("export default EXTRA_EXERCISE_DB;")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(out))

kb = os.path.getsize(OUT)//1024
print(f"✅ Written: {OUT} ({kb} KB)")
print(f"🎉 {len(new_exs)} exercises ready!")
