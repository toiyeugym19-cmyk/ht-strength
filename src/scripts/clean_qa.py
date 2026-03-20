import json

with open('d:/gym 2/tap gyp/src/data/qa.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

unique_data = []
seen_questions = set()

for item in data:
    q = item['question'].strip().lower()
    if q not in seen_questions:
        seen_questions.add(q)
        unique_data.append(item)

with open('d:/gym 2/tap gyp/src/data/qa.json', 'w', encoding='utf-8') as f:
    json.dump(unique_data, f, ensure_ascii=False, indent=4)

print(f"Cleaned qa.json. Kept {len(unique_data)} unique items.")
