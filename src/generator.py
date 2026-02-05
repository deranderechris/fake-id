import random
import json
from pathlib import Path
from datetime import date, timedelta

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_list(filename):
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]

# ---------------------------------------------------------
# BASIC RANDOM HELPERS
# ---------------------------------------------------------

def random_birthdate(min_age=18, max_age=70):
    today = date.today()
    start = today - timedelta(days=max_age * 365)
    end = today - timedelta(days=min_age * 365)
    random_days = random.randint(0, (end - start).days)
    return (start + timedelta(days=random_days)).isoformat()

def random_phone():
    return f"+49 1{random.randint(50,79)} {random.randint(1000000,9999999)}"

def random_house_number():
    return str(random.randint(1, 199))

# ---------------------------------------------------------
# NAME + ADDRESS
# ---------------------------------------------------------

def generate_name(country="de"):
    firstnames = load_list(f"firstnames_{country}.txt")
    lastnames = load_list(f"lastnames_{country}.txt")

    if not firstnames or not lastnames:
        return {"error": f"No name data for country '{country}'"}

    firstname = random.choice(firstnames)
    lastname = random.choice(lastnames)

    return {
        "firstname": firstname,
        "lastname": lastname
    }

def generate_address(country="de"):
    streets = load_list(f"streets_{country}.txt")
    cities = load_list(f"cities_{country}.txt")
    postcodes = load_list(f"postcodes_{country}.txt")

    if not streets or not cities or not postcodes:
        return {"error": f"No address data for country '{country}'"}

    return {
        "street": random.choice(streets),
        "house_number": random_house_number(),
        "postcode": random.choice(postcodes),
        "city": random.choice(cities)
    }

# ---------------------------------------------------------
# BANK + CREDIT CARD (FAKE)
# ---------------------------------------------------------

def generate_fake_bank_account(country="de"):
    bank_names = [
        "Testbank AG",
        "Demo Kreditinstitut",
        "Beispielbank eG",
        "Fantasie Bank",
        "Mock Finanz AG"
    ]

    iban = f"DE00 0000 0000 {random.randint(1000,9999)} {random.randint(1000,9999)}"
    bic = "TESTDEFFXXX"

    return {
        "bank_name": random.choice(bank_names),
        "iban": iban,
        "bic": bic,
        "note": "Fake test account – not valid"
    }

def generate_fake_credit_card():
    number = "9999" + "".join(str(random.randint(0, 9)) for _ in range(12))
    expiry_month = random.randint(1, 12)
    expiry_year = random.randint(25, 30)
    cvv = random.randint(100, 999)

    return {
        "card_number": number,
        "expiry": f"{expiry_month:02d}/{expiry_year}",
        "cvv": str(cvv),
        "note": "Fake test card – not valid"
    }

# ---------------------------------------------------------
# FULL IDENTITY
# ---------------------------------------------------------

def generate_full_identity(country="de"):
    name = generate_name(country)
    if "error" in name:
        return name

    address = generate_address(country)
    if "error" in address:
        return address

    birthdate = random_birthdate()
    phone = random_phone()

    username = f"{name['firstname'].lower()}{name['lastname'].lower()}{random.randint(10,99)}"
    email = f"{username}@example.com"

    bank = generate_fake_bank_account(country)
    card = generate_fake_credit_card()

    return {
        "name": f"{name['firstname']} {name['lastname']}",
        "firstname": name["firstname"],
        "lastname": name["lastname"],
        "birthdate": birthdate,
        "address": address,
        "phone": phone,
        "username": username,
        "email": email,
        "bank_account": bank,
        "credit_card": card
    }
