import argparse
from generator import generate_name, generate_full_identity
import json

def main():
    parser = argparse.ArgumentParser(description="Fake ID Generator")
    parser.add_argument("--country", default="de", help="Country code (de/us/...)")
    parser.add_argument("--full", action="store_true", help="Generate full identity")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    if args.full:
        data = generate_full_identity(args.country)
    else:
        data = generate_name(args.country)

    if args.json:
        print(json.dumps(data, indent=2))
    else:
        for k, v in data.items():
            print(f"{k}: {v}")

if __name__ == "__main__":
    main()
