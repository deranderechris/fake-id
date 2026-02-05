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

function randomPhone(country) {
    if (country === "us") {
        return `+1 ${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*9000+1000)}`;
    }
    return `+49 1${Math.floor(Math.random() * 30 + 50)} ${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

function randomHouseNumber() {
    return Math.floor(Math.random() * 199 + 1).toString();
}

// ---------------------------------------------------------
// DATA LISTS
// ---------------------------------------------------------

const dataSets = {
    de: {
        firstnames: ["Markus", "Julia", "Christian", "Anna", "Peter", "Lukas", "Sarah", "Michael", "Laura", "Tobias"],
        lastnames: ["Müller", "Schmidt", "Fischer", "Weber", "Klein", "Feldmann", "Richter", "Schneider", "Wolf", "Krause"],
        streets: ["Hauptstraße", "Bahnhofstraße", "Gartenweg", "Lindenweg", "Schulstraße", "Bergstraße", "Wiesenweg", "Mühlenweg", "Dorfstraße", "Sonnenallee"],
        cities: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Dresden", "Leipzig", "Gera", "Nürnberg"],
        postcodes: ["10115", "20095", "80331", "50667", "60311", "70173", "01067", "04109", "07545", "90402"],
        banks: ["Testbank AG", "Demo Kreditinstitut", "Beispielbank eG", "Fantasie Bank", "Mock Finanz AG"],
        ibanPrefix: "DE00 0000 0000"
    },
    us: {
        firstnames: ["John", "Emily", "Michael", "Jessica", "David", "Ashley", "Chris", "Amanda", "Daniel", "Sarah"],
        lastnames: ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"],
        streets: ["Main Street", "Oak Avenue", "Pine Street", "Maple Drive", "Cedar Lane", "Elm Street", "Sunset Boulevard", "Highland Road", "Park Avenue", "River Street"],
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
        postcodes: ["10001", "90001", "60601", "77001", "85001", "19101", "78201", "92101", "75201", "95101"],
        banks: ["Test Bank Corp", "Demo Financial", "Sample Credit Union", "Mock National Bank", "Fictional Savings"],
        ibanPrefix: "US00 0000 0000"
    }
};

// ---------------------------------------------------------
// BANK + CREDIT CARD
// ---------------------------------------------------------

function generateFakeBankAccount(country) {
    const ds = dataSets[country] || dataSets.de;
    return {
        bank_name: ds.banks[Math.floor(Math.random() * ds.banks.length)],
        iban: `${ds.ibanPrefix} ${Math.floor(Math.random()*9000+1000)} ${Math.floor(Math.random()*9000+1000)}`,
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

let lastData = null;

function generateIdentity(country) {
    const ds = dataSets[country] || dataSets.de;

    const firstname = ds.firstnames[Math.floor(Math.random() * ds.firstnames.length)];
    const lastname = ds.lastnames[Math.floor(Math.random() * ds.lastnames.length)];
    const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}${Math.floor(Math.random()*90+10)}`;

    return {
        country,
        name: `${firstname} ${lastname}`,
        firstname,
        lastname,
        birthdate: randomBirthdate(),
        address: {
            street: ds.streets[Math.floor(Math.random()*ds.streets.length)],
            house_number: randomHouseNumber(),
            postcode: ds.postcodes[Math.floor(Math.random()*ds.postcodes.length)],
            city: ds.cities[Math.floor(Math.random()*ds.cities.length)]
        },
        phone: randomPhone(country),
        username,
        email: `${username}@example.com`,
        bank_account: generateFakeBankAccount(country),
        credit_card: generateFakeCreditCard()
    };
}

// ---------------------------------------------------------
// UI RENDERING
// ---------------------------------------------------------

function renderPerson(data) {
    const el = document.getElementById("tab-person");
    el.innerHTML = `
<div class="section-title">Person</div>
<div class="field"><span class="label">Name:</span> ${data.name}</div>
<div class="field"><span class="label">Geburtsdatum:</span> ${data.birthdate}</div>
<div class="field"><span class="label">Telefon:</span> ${data.phone}</div>
<div class="section-title">Adresse</div>
<div class="field"><span class="label">Straße:</span> ${data.address.street} ${data.address.house_number}</div>
<div class="field"><span class="label">PLZ / Ort:</span> ${data.address.postcode} ${data.address.city}</div>
<div class="section-title">Login</div>
<div class="field"><span class="label">Username:</span> ${data.username}</div>
<div class="field"><span class="label">E-Mail:</span> ${data.email}</div>
`;
}

function renderBank(data) {
    const el = document.getElementById("tab-bank");
    const b = data.bank_account;
    el.innerHTML = `
<div class="section-title">Bankkonto (Fake)</div>
<div class="field"><span class="label">Bank:</span> ${b.bank_name}</div>
<div class="field"><span class="label">IBAN:</span> ${b.iban}</div>
<div class="field"><span class="label">BIC:</span> ${b.bic}</div>
<div class="field"><span class="label">Hinweis:</span> ${b.note}</div>
`;
}

function renderCard(data) {
    const el = document.getElementById("tab-card");
    const c = data.credit_card;
    el.innerHTML = `
<div class="section-title">Kreditkarte (Fake)</div>
<div class="field"><span class="label">Kartennummer:</span> ${c.card_number}</div>
<div class="field"><span class="label">Gültig bis:</span> ${c.expiry}</div>
<div class="field"><span class="label">CVV:</span> ${c.cvv}</div>
<div class="field"><span class="label">Hinweis:</span> ${c.note}</div>
`;
}

function renderRaw(data) {
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function generate() {
    const country = document.getElementById("country").value;
    const data = generateIdentity(country);
    lastData = data;
    renderPerson(data);
    renderBank(data);
    renderCard(data);
    renderRaw(data);
}

// ---------------------------------------------------------
// TABS, DARK MODE, COPY, DOWNLOAD
// ---------------------------------------------------------

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-btn")) {
        const tab = e.target.getAttribute("data-tab");
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        document.getElementById("tab-" + tab).classList.add("active");
    }
});

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

function copyJson() {
    if (!lastData) return;
    const text = JSON.stringify(lastData, null, 2);
    navigator.clipboard.writeText(text).catch(() => {});
}

function downloadJson() {
    if (!lastData) return;
    const blob = new Blob([JSON.stringify(lastData, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-id.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadPdf() {
    window.print();
}

// erste Fake-ID direkt beim Laden
window.addEventListener("load", generate);
    const lastname = ds.lastnames[Math.floor(Math.random() * ds.lastnames.length)];
    const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}${Math.floor(Math.random()*90+10)}`;

    return {
        country,
        name: `${firstname} ${lastname}`,
        firstname,
        lastname,
        birthdate: randomBirthdate(),
        address: {
            street: ds.streets[Math.floor(Math.random()*ds.streets.length)],
            house_number: randomHouseNumber(),
            postcode: ds.postcodes[Math.floor(Math.random()*ds.postcodes.length)],
            city: ds.cities[Math.floor(Math.random()*ds.cities.length)]
        },
        phone: randomPhone(country),
        username,
        email: `${username}@example.com`,
        bank_account: generateFakeBankAccount(country),
        credit_card: generateFakeCreditCard()
    };
}

// ---------------------------------------------------------
// UI RENDERING
// ---------------------------------------------------------

function renderPerson(data) {
    const el = document.getElementById("tab-person");
    el.innerHTML = `
<div class="section-title">Person</div>
<div class="field"><span class="label">Name:</span> ${data.name}</div>
<div class="field"><span class="label">Geburtsdatum:</span> ${data.birthdate}</div>
<div class="field"><span class="label">Telefon:</span> ${data.phone}</div>
<div class="section-title">Adresse</div>
<div class="field"><span class="label">Straße:</span> ${data.address.street} ${data.address.house_number}</div>
<div class="field"><span class="label">PLZ / Ort:</span> ${data.address.postcode} ${data.address.city}</div>
<div class="section-title">Login</div>
<div class="field"><span class="label">Username:</span> ${data.username}</div>
<div class="field"><span class="label">E-Mail:</span> ${data.email}</div>
`;
}

function renderBank(data) {
    const el = document.getElementById("tab-bank");
    const b = data.bank_account;
    el.innerHTML = `
<div class="section-title">Bankkonto (Fake)</div>
<div class="field"><span class="label">Bank:</span> ${b.bank_name}</div>
<div class="field"><span class="label">IBAN:</span> ${b.iban}</div>
<div class="field"><span class="label">BIC:</span> ${b.bic}</div>
<div class="field"><span class="label">Hinweis:</span> ${b.note}</div>
`;
}

function renderCard(data) {
    const el = document.getElementById("tab-card");
    const c = data.credit_card;
    el.innerHTML = `
<div class="section-title">Kreditkarte (Fake)</div>
<div class="field"><span class="label">Kartennummer:</span> ${c.card_number}</div>
<div class="field"><span class="label">Gültig bis:</span> ${c.expiry}</div>
<div class="field"><span class="label">CVV:</span> ${c.cvv}</div>
<div class="field"><span class="label">Hinweis:</span> ${c.note}</div>
`;
}

function renderRaw(data) {
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function generate() {
    const country = document.getElementById("country").value;
    const data = generateIdentity(country);
    lastData = data;
    renderPerson(data);
    renderBank(data);
    renderCard(data);
    renderRaw(data);
}

// ---------------------------------------------------------
// TABS, DARK MODE, COPY, DOWNLOAD
// ---------------------------------------------------------

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-btn")) {
        const tab = e.target.getAttribute("data-tab");
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        document.getElementById("tab-" + tab).classList.add("active");
    }
});

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

function copyJson() {
    if (!lastData) return;
    const text = JSON.stringify(lastData, null, 2);
    navigator.clipboard.writeText(text).catch(() => {});
}

function downloadJson() {
    if (!lastData) return;
    const blob = new Blob([JSON.stringify(lastData, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-id.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadPdf() {
    // Browser-Standard: Drucken-Dialog → „Als PDF speichern“
    window.print();
}

// erste Fake-ID direkt beim Laden
window.addEventListener("load", generate);
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
