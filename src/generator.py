import random
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_list(filename):
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]

def generate_name(country="de"):
    firstnames = load_list(f"firstnames_{country}.txt")
    lastnames = load_list(f"lastnames_{country}.txt")

    if not firstnames or not lastnames:
        return {"error": f"No data for country '{country}'"}

    return {
        "firstname": random.choice(firstnames),
        "lastname": random.choice(lastnames)
    }

def generate_full_identity(country="de"):
    name = generate_name(country)
    if "error" in name:
        return name

    email = f"{name['firstname'].lower()}.{name['lastname'].lower()}@example.com"

    return {
        "name": f"{name['firstname']} {name['lastname']}",
        "email": email
    }
