// ---------------------------------------------------------
// RANDOM HELPERS
// ---------------------------------------------------------

function randomBirthdate(minAge = 18, maxAge = 70) {
    const today = new Date();
    const start = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split("T")[0];
}

function randomPhone() {
    return `+49 1${Math.floor(Math.random() * 30 + 50)} ${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

function randomHouseNumber() {
    return Math.floor(Math.random() * 199 + 1).toString();
}

// ---------------------------------------------------------
// DATA LISTS (embedded for browser use)
// ---------------------------------------------------------

const firstnames = ["Markus", "Julia", "Christian", "Anna", "Peter", "Lukas", "Sarah", "Michael", "Laura", "Tobias"];
const lastnames = ["Müller", "Schmidt", "Fischer", "Weber", "Klein", "Feldmann", "Richter", "Schneider", "Wolf", "Krause"];
const streets = ["Hauptstraße", "Bahnhofstraße", "Gartenweg", "Lindenweg", "Schulstraße", "Bergstraße", "Wiesenweg", "Mühlenweg", "Dorfstraße", "Sonnenallee"];
const cities = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Dresden", "Leipzig", "Gera", "Nürnberg"];
const postcodes = ["10115", "20095", "80331", "50667", "60311", "70173", "01067", "04109", "07545", "90402"];

// ---------------------------------------------------------
// BANK + CREDIT CARD
// ---------------------------------------------------------

function generateFakeBankAccount() {
    const banks = [
        "Testbank AG",
        "Demo Kreditinstitut",
        "Beispielbank eG",
        "Fantasie Bank",
        "Mock Finanz AG"
    ];

    return {
        bank_name: banks[Math.floor(Math.random() * banks.length)],
        iban: `DE00 0000 0000 ${Math.floor(Math.random()*9000+1000)} ${Math.floor(Math.random()*9000+1000)}`,
        bic: "TESTDEFFXXX",
        note: "Fake test account – not valid"
    };
}

function generateFakeCreditCard() {
    const number = "9999" + Array.from({length: 12}, () => Math.floor(Math.random()*10)).join("");
    const expiryMonth = String(Math.floor(Math.random()*12 + 1)).padStart(2, "0");
    const expiryYear = Math.floor(Math.random()*5 + 25);

    return {
        card_number: number,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv: String(Math.floor(Math.random()*900 + 100)),
        note: "Fake test card – not valid"
    };
}

// ---------------------------------------------------------
// FULL IDENTITY
// ---------------------------------------------------------

function generateIdentity() {
    const firstname = firstnames[Math.floor(Math.random() * firstnames.length)];
    const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];

    const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}${Math.floor(Math.random()*90+10)}`;

    return {
        name: `${firstname} ${lastname}`,
        firstname,
        lastname,
        birthdate: randomBirthdate(),
        address: {
            street: streets[Math.floor(Math.random()*streets.length)],
            house_number: randomHouseNumber(),
            postcode: postcodes[Math.floor(Math.random()*postcodes.length)],
            city: cities[Math.floor(Math.random()*cities.length)]
        },
        phone: randomPhone(),
        username,
        email: `${username}@example.com`,
        bank_account: generateFakeBankAccount(),
        credit_card: generateFakeCreditCard()
    };
}

// ---------------------------------------------------------
// UI HANDLER
// ---------------------------------------------------------

function generate() {
    const data = generateIdentity();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

