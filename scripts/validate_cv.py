"""Check data/cv.json before it goes live. Run: python scripts/validate_cv.py"""
import json
import sys
from pathlib import Path

CV = Path(__file__).resolve().parent.parent / "data" / "cv.json"

# Fields each entry must have, per section
REQUIRED = {
    "experience": ["role", "company", "start"],
    "education": ["degree", "institution", "start"],
    "portfolio": ["title", "description"],
    "skills": ["group", "items"],
    "accolades": ["title"],
}
LIST_FIELDS = ["bullets", "details", "tags", "items", "photos"]
ROOT = CV.parent.parent


def missing_file(path):
    """True if a local (non-URL) path does not exist in the repo."""
    return bool(path) and not path.startswith(("http://", "https://")) and not (ROOT / path).is_file()


def main() -> int:
    try:
        data = json.loads(CV.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"ERROR: cv.json is not valid JSON (line {e.lineno}, column {e.colno}): {e.msg}")
        print("Tip: check for a missing comma, or a trailing comma before ] or }.")
        return 1

    errors = []
    profile = data.get("profile")
    if not isinstance(profile, dict) or not profile.get("name"):
        errors.append('profile: "name" is required')
    elif missing_file(profile.get("photo")):
        errors.append(f'profile: photo not found: {profile["photo"]}')

    for section, fields in REQUIRED.items():
        entries = data.get(section, [])
        if not isinstance(entries, list):
            errors.append(f"{section}: must be a list [ ... ]")
            continue
        for i, entry in enumerate(entries, 1):
            where = f"{section} #{i}"
            if not isinstance(entry, dict):
                errors.append(f"{where}: must be an object {{ ... }}")
                continue
            for f in fields:
                if not entry.get(f):
                    errors.append(f'{where}: missing "{f}"')
            for f in LIST_FIELDS:
                if f in entry and not isinstance(entry[f], list):
                    errors.append(f'{where}: "{f}" must be a list [ ... ]')
            for f in ("url", "demo"):
                url = entry.get(f)
                if url and not url.startswith(("https://", "http://", "mailto:")):
                    errors.append(f'{where}: "{f}" should start with https://')
            local = [entry.get("logo"), entry.get("image")]
            local += [p if isinstance(p, str) else (p or {}).get("src") for p in entry.get("photos", []) if isinstance(entry.get("photos"), list)]
            for path in local:
                if missing_file(path):
                    errors.append(f'{where}: file not found: {path}')
            if entry.get("pending"):
                errors.append(f"{where}: still marked as placeholder (\"pending\": true)")

    if errors:
        print("cv.json has problems:")
        for e in errors:
            print(f"  - {e}")
        return 1
    counts = ", ".join(f"{len(data.get(s, []))} {s}" for s in REQUIRED)
    print(f"cv.json OK ({counts})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
