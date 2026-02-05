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
        return `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }
    if (country === "it") {
        return `+39 3${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 9000000 + 1000000)}`;
    }
    if (country === "at") {
        return `+43 6${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 9000000 + 1000000)}`;
    }
    return `+49 1${Math.floor(Math.random() * 30 + 50)} ${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

function randomHouseNumber() {
    return Math.floor(Math.random() * 199 + 1).toString();
}

function ageFromBirthdate(dateString) {
    const birth = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age;
}

function randomDigits(length) {
    let value = "";
    for (let i = 0; i < length; i += 1) {
        value += Math.floor(Math.random() * 10).toString();
    }
    return value;
}

function ibanChecksum(countryCode, bban) {
    const rearranged = `${bban}${countryCode}00`;
    let numeric = "";
    for (const char of rearranged) {
        if (char >= "A" && char <= "Z") {
            numeric += (char.charCodeAt(0) - 55).toString();
        } else {
            numeric += char;
        }
    }
    let remainder = 0;
    for (let i = 0; i < numeric.length; i += 1) {
        remainder = (remainder * 10 + Number(numeric[i])) % 97;
    }
    const check = 98 - remainder;
    return String(check).padStart(2, "0");
}

function formatIban(countryCode, bban) {
    const check = ibanChecksum(countryCode, bban);
    const raw = `${countryCode}${check}${bban}`;
    return raw.replace(/(.{4})/g, "$1 ").trim();
}

function generateIban(country, bankProfile) {
    if (country === "de") {
        const bankCode = bankProfile?.bank_code || randomDigits(8);
        const account = randomDigits(10);
        return formatIban("DE", `${bankCode}${account}`);
    }
    if (country === "at") {
        const bankCode = bankProfile?.bank_code || randomDigits(5);
        const account = randomDigits(11);
        return formatIban("AT", `${bankCode}${account}`);
    }
    if (country === "it") {
        const cin = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const bankCode = bankProfile?.bank_code || randomDigits(5);
        const branchCode = bankProfile?.branch_code || randomDigits(5);
        const account = randomDigits(12);
        return formatIban("IT", `${cin}${bankCode}${branchCode}${account}`);
    }
    return formatIban("DE", `${randomDigits(8)}${randomDigits(10)}`);
}

function pickBankProfile(ds, city) {
    const entry = ds.banks[Math.floor(Math.random() * ds.banks.length)];
    const cityMatches = city
        ? ds.banks.filter((bank) => typeof bank === "object" && bank.cities?.includes(city))
        : [];
    const selected = cityMatches.length
        ? cityMatches[Math.floor(Math.random() * cityMatches.length)]
        : entry;
    if (typeof selected === "string") {
        return { name: selected };
    }
    return selected;
}

function pickUsAccountLength(bankProfile) {
    const range = bankProfile.account_length;
    if (!range) return 12;
    const min = Math.max(6, range.min || range.max || 12);
    const max = Math.max(min, range.max || range.min || 12);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------
// DATA LISTS
// ---------------------------------------------------------

const dataSets = {
    de: {
        firstnames_m: ["Markus", "Christian", "Peter", "Lukas", "Michael", "Tobias", "Jan", "Leon", "Nico", "Felix"],
        firstnames_f: ["Julia", "Anna", "Sarah", "Laura", "Lea", "Marie", "Nina", "Sophie", "Lena", "Mia"],
        firstnames: ["Markus", "Christian", "Peter", "Lukas", "Michael", "Tobias", "Jan", "Leon", "Nico", "Felix", "Julia", "Anna", "Sarah", "Laura", "Lea", "Marie", "Nina", "Sophie", "Lena", "Mia"],
        lastnames: ["Müller", "Schmidt", "Fischer", "Weber", "Klein", "Feldmann", "Richter", "Schneider", "Wolf", "Krause"],
        streets: ["Hauptstraße", "Bahnhofstraße", "Gartenweg", "Lindenweg", "Schulstraße", "Bergstraße", "Wiesenweg", "Mühlenweg", "Dorfstraße", "Sonnenallee"],
        cities: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Dresden", "Leipzig", "Gera", "Nürnberg"],
        postcodes: ["10115", "20095", "80331", "50667", "60311", "70173", "01067", "04109", "07545", "90402"],
        banks: [
            { name: "Deutsche Bank", bic: "DEUTDEFF", bank_code: "10070000" },
            { name: "Commerzbank", bic: "COBADEFF", bank_code: "10040000" },
            { name: "DZ Bank", bic: "GENODEFF", bank_code: "50070010" },
            { name: "KfW", bic: "KFWIDEFF", bank_code: "50020400" },
            { name: "HypoVereinsbank", bic: "HYVEDEMM", bank_code: "70020270" },
            { name: "Postbank", bic: "PBNKDEFF", bank_code: "10010010" },
            { name: "ING", bic: "INGDDEFF", bank_code: "50010517" },
            { name: "DKB", bic: "BYLADEM1", bank_code: "12030000" },
            { name: "Berliner Sparkasse", bic: "BELADEBEXXX", bank_code: "10050000", cities: ["Berlin"] },
            { name: "Hamburger Sparkasse", bic: "HASPDEHHXXX", bank_code: "20050550", cities: ["Hamburg"] },
            { name: "Stadtsparkasse Muenchen", bic: "SSKMDEMMXXX", bank_code: "70150000", cities: ["Muenchen"] },
            { name: "Frankfurter Sparkasse", bic: "HELADEF1XXX", bank_code: "50050201", cities: ["Frankfurt"] },
            { name: "Sparkasse KoelnBonn", bic: "COLSDE33XXX", bank_code: "37050198", cities: ["Koeln"] }
        ],
        ibanPrefix: "DE12 3456 7890"
    },
    at: {
        firstnames_m: ["Lukas", "Tobias", "Maximilian", "Felix", "David", "Julian", "Simon", "Philipp", "Paul", "Jakob"],
        firstnames_f: ["Anna", "Lena", "Sophie", "Marie", "Laura", "Julia", "Hannah", "Emma", "Mia", "Sarah"],
        firstnames: ["Lukas", "Tobias", "Maximilian", "Felix", "David", "Julian", "Simon", "Philipp", "Paul", "Jakob", "Anna", "Lena", "Sophie", "Marie", "Laura", "Julia", "Hannah", "Emma", "Mia", "Sarah"],
        lastnames: ["Gruber", "Huber", "Bauer", "Wagner", "Mueller", "Pichler", "Steiner", "Moser", "Mayer", "Hofer", "Leitner", "Fuchs", "Egger", "Schwarz", "Wolf"],
        streets: ["Hauptstrasse", "Bahnhofstrasse", "Schulstrasse", "Gartenweg", "Lindenweg", "Bergstrasse", "Wiesenweg", "Dorfstrasse", "Mozartstrasse", "Kirchenweg"],
        cities: ["Wien", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "St. Poelten", "Bregenz"],
        postcodes: ["1010", "8010", "4020", "5020", "6020", "9020", "9500", "4600", "3100", "6900"],
        banks: [
            { name: "Erste Bank", bic: "GIBAATWW", bank_code: "20111" },
            { name: "Raiffeisen Bank", bic: "RZBAATWW", bank_code: "32000" },
            { name: "Bank Austria", bic: "BKAUATWW", bank_code: "12000" },
            { name: "BAWAG", bic: "BWAUATW1", bank_code: "14000" },
            { name: "Oberbank", bic: "OBKLAT2L", bank_code: "15150" },
            { name: "Volksbank Wien", bic: "VBOEATWW", bank_code: "43000", cities: ["Wien"] },
            { name: "Sparkasse Graz", bic: "STSPAT2G", bank_code: "20830", cities: ["Graz"] },
            { name: "Sparkasse Linz", bic: "LISKAT2L", bank_code: "20320", cities: ["Linz"] },
            { name: "Tiroler Sparkasse", bic: "SPKAAT2L", bank_code: "20503", cities: ["Innsbruck"] },
            { name: "Raiffeisen Salzburg", bic: "RVSAAT2S", bank_code: "34000", cities: ["Salzburg"] }
        ],
        ibanPrefix: "AT12 3456 7890"
    },
    it: {
        firstnames_m: ["Luca", "Marco", "Matteo", "Lorenzo", "Alessandro", "Andrea", "Francesco", "Riccardo", "Gabriele", "Davide"],
        firstnames_f: ["Sofia", "Giulia", "Martina", "Chiara", "Sara", "Alice", "Francesca", "Elisa", "Valentina", "Aurora"],
        firstnames: ["Luca", "Marco", "Matteo", "Lorenzo", "Alessandro", "Andrea", "Francesco", "Riccardo", "Gabriele", "Davide", "Sofia", "Giulia", "Martina", "Chiara", "Sara", "Alice", "Francesca", "Elisa", "Valentina", "Aurora"],
        lastnames: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Conti", "De Luca", "Mancini", "Costa", "Giordano"],
        streets: ["Via Roma", "Via Garibaldi", "Via Milano", "Via Verdi", "Via Dante", "Corso Italia", "Via Venezia", "Via Torino", "Via Firenze", "Via Napoli"],
        cities: ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Verona"],
        postcodes: ["00100", "20100", "80100", "10100", "90100", "16100", "40100", "50100", "70100", "37100"],
        banks: [
            { name: "Intesa Sanpaolo", bic: "BCITITMM", bank_code: "03069", branch_code: "09606" },
            { name: "UniCredit", bic: "UNCRITMM", bank_code: "02008", branch_code: "05214" },
            { name: "Banco BPM", bic: "BPMOIT22", bank_code: "05034", branch_code: "01600" },
            { name: "BPER Banca", bic: "BIEBITMM", bank_code: "05387", branch_code: "02000" },
            { name: "Monte dei Paschi", bic: "PSSTITMM", bank_code: "01030", branch_code: "02000" },
            { name: "Credito Emiliano", bic: "CREMITMM", bank_code: "03032", branch_code: "01200" },
            { name: "Banco di Sardegna", bic: "BDSAITMM", bank_code: "01015", branch_code: "01000" },
            { name: "Credito Valtellinese", bic: "BPCVIT2S", bank_code: "04224", branch_code: "01000" },
            { name: "Banco di Napoli", bic: "BCITITMM", bank_code: "01030", branch_code: "01000", cities: ["Napoli"] },
            { name: "Banca di Roma", bic: "BCITITMM", bank_code: "03069", branch_code: "02000", cities: ["Roma"] },
            { name: "Banca di Milano", bic: "BCITITMM", bank_code: "03069", branch_code: "01000", cities: ["Milano"] },
            { name: "Banca di Torino", bic: "BCITITMM", bank_code: "03069", branch_code: "03000", cities: ["Torino"] }
        ],
        ibanPrefix: "IT12 3456 7890"
    },
    us: {
        firstnames_m: ["John", "Michael", "David", "Chris", "Daniel", "Matthew", "Ryan", "Lucas", "Ethan", "Noah"],
        firstnames_f: ["Emily", "Jessica", "Ashley", "Amanda", "Sarah", "Olivia", "Emma", "Sophia", "Ava", "Mia"],
        firstnames: ["John", "Michael", "David", "Chris", "Daniel", "Matthew", "Ryan", "Lucas", "Ethan", "Noah", "Emily", "Jessica", "Ashley", "Amanda", "Sarah", "Olivia", "Emma", "Sophia", "Ava", "Mia"],
        lastnames: ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"],
        streets: ["Main Street", "Oak Avenue", "Pine Street", "Maple Drive", "Cedar Lane", "Elm Street", "Sunset Boulevard", "Highland Road", "Park Avenue", "River Street"],
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
        postcodes: ["10001", "90001", "60601", "77001", "85001", "19101", "78201", "92101", "75201", "95101"],
        banks: [
            { name: "JPMorgan Chase", bic: "CHASUS33", routing_numbers: ["021000021", "322271627", "067000045"], account_length: { min: 10, max: 12 } },
            { name: "Bank of America", bic: "BOFAUS3N", routing_numbers: ["026009593", "121000358", "051000017"], account_length: { min: 10, max: 12 } },
            { name: "Wells Fargo", bic: "WFBIUS6S", routing_numbers: ["121042882", "091000019", "061101375"], account_length: { min: 9, max: 12 } },
            { name: "Citibank", bic: "CITIUS33", routing_numbers: ["021000089", "271002415", "083000137"], account_length: { min: 10, max: 12 } },
            { name: "U.S. Bank", bic: "USBKUS44", routing_numbers: ["091000022", "104000029", "122235821"], account_length: { min: 10, max: 12 } },
            { name: "PNC Bank", bic: "PNCCUS33", routing_numbers: ["043000096", "031000053", "271070801"], account_length: { min: 8, max: 12 } },
            { name: "Capital One", bic: "NFBKUS33", routing_numbers: ["051405515", "056073612", "111101062"], account_length: { min: 10, max: 12 } },
            { name: "Truist", bic: "TRUIUS33", routing_numbers: ["061000104", "054001547", "062203984"], account_length: { min: 10, max: 12 } }
        ],
        ibanPrefix: "US12 3456 7890"
    }
};

async function loadList(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) return [];
    const text = await response.text();
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

async function loadDataSets() {
    try {
        const [firstnames, lastnames, streets, cities, postcodes] = await Promise.all([
            loadList("../data/firstnames_de.txt"),
            loadList("../data/lastnames_de.txt"),
            loadList("../data/streets_de.txt"),
            loadList("../data/cities_de.txt"),
            loadList("../data/postcodes_de.txt")
        ]);
        if (firstnames.length) dataSets.de.firstnames = firstnames;
        if (lastnames.length) dataSets.de.lastnames = lastnames;
        if (streets.length) dataSets.de.streets = streets;
        if (cities.length) dataSets.de.cities = cities;
        if (postcodes.length) dataSets.de.postcodes = postcodes;

        const [usFirstnames, usLastnames, usStreets, usCities, usPostcodes] = await Promise.all([
            loadList("../data/firstnames_us.txt"),
            loadList("../data/lastnames_us.txt"),
            loadList("../data/streets_us.txt"),
            loadList("../data/cities_us.txt"),
            loadList("../data/postcodes_us.txt")
        ]);
        if (usFirstnames.length) dataSets.us.firstnames = usFirstnames;
        if (usLastnames.length) dataSets.us.lastnames = usLastnames;
        if (usStreets.length) dataSets.us.streets = usStreets;
        if (usCities.length) dataSets.us.cities = usCities;
        if (usPostcodes.length) dataSets.us.postcodes = usPostcodes;

        const [atFirstnames, atLastnames, atStreets, atCities, atPostcodes] = await Promise.all([
            loadList("../data/firstnames_at.txt"),
            loadList("../data/lastnames_at.txt"),
            loadList("../data/streets_at.txt"),
            loadList("../data/cities_at.txt"),
            loadList("../data/postcodes_at.txt")
        ]);
        if (atFirstnames.length) dataSets.at.firstnames = atFirstnames;
        if (atLastnames.length) dataSets.at.lastnames = atLastnames;
        if (atStreets.length) dataSets.at.streets = atStreets;
        if (atCities.length) dataSets.at.cities = atCities;
        if (atPostcodes.length) dataSets.at.postcodes = atPostcodes;

        const [itFirstnames, itLastnames, itStreets, itCities, itPostcodes] = await Promise.all([
            loadList("../data/firstnames_it.txt"),
            loadList("../data/lastnames_it.txt"),
            loadList("../data/streets_it.txt"),
            loadList("../data/cities_it.txt"),
            loadList("../data/postcodes_it.txt")
        ]);
        if (itFirstnames.length) dataSets.it.firstnames = itFirstnames;
        if (itLastnames.length) dataSets.it.lastnames = itLastnames;
        if (itStreets.length) dataSets.it.streets = itStreets;
        if (itCities.length) dataSets.it.cities = itCities;
        if (itPostcodes.length) dataSets.it.postcodes = itPostcodes;
    } catch (error) {
        // Keep defaults if data files are not accessible.
    }
}

// ---------------------------------------------------------
// BANK + CREDIT CARD
// ---------------------------------------------------------

function generateFakeBankAccount(country, city) {
    const ds = dataSets[country] || dataSets.de;
    const bankProfile = pickBankProfile(ds, city);
    const bankName = bankProfile.name || "Bank";
    const bic = bankProfile.bic || "TESTDEFFXXX";
    if (country === "us") {
        const routingNumbers = bankProfile.routing_numbers;
        const accountLength = pickUsAccountLength(bankProfile);
        return {
            bank_name: bankName,
            routing_number: Array.isArray(routingNumbers) && routingNumbers.length
                ? routingNumbers[Math.floor(Math.random() * routingNumbers.length)]
                : `${Math.floor(Math.random() * 900000000 + 100000000)}`,
            account_number: randomDigits(accountLength),
            bic,
            note: "Fake test account – not valid"
        };
    }
    return {
        bank_name: bankName,
        iban: generateIban(country, bankProfile),
        bic,
        note: "Fake test account – not valid"
    };
}

function generateFakeCreditCard() {
    const number = "9999" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
    const expiryMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, "0");
    const expiryYear = Math.floor(Math.random() * 5 + 25);

    return {
        card_number: number,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv: String(Math.floor(Math.random() * 900 + 100)),
        note: "Fake test card – not valid"
    };
}

// ---------------------------------------------------------
// FULL IDENTITY
// ---------------------------------------------------------

let lastData = null;

function getFirstnamePool(ds, gender) {
    if (gender === "male" && ds.firstnames_m && ds.firstnames_m.length) {
        return ds.firstnames_m;
    }
    if (gender === "female" && ds.firstnames_f && ds.firstnames_f.length) {
        return ds.firstnames_f;
    }
    return ds.firstnames;
}

function generateIdentity(country, gender, minAge, maxAge) {
    const ds = dataSets[country] || dataSets.de;
    const namePool = getFirstnamePool(ds, gender);

    const firstname = namePool[Math.floor(Math.random() * namePool.length)];
    const lastname = ds.lastnames[Math.floor(Math.random() * ds.lastnames.length)];
    const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}${Math.floor(Math.random() * 90 + 10)}`;
    const birthdate = randomBirthdate(minAge, maxAge);
    const age = ageFromBirthdate(birthdate);
    const address = {
        street: ds.streets[Math.floor(Math.random() * ds.streets.length)],
        house_number: randomHouseNumber(),
        postcode: ds.postcodes[Math.floor(Math.random() * ds.postcodes.length)],
        city: ds.cities[Math.floor(Math.random() * ds.cities.length)]
    };

    return {
        country,
        gender,
        age,
        name: `${firstname} ${lastname}`,
        firstname,
        lastname,
        birthdate,
        address,
        phone: randomPhone(country),
        username,
        email: `${username}@example.com`,
        bank_account: generateFakeBankAccount(country, address.city),
        credit_card: generateFakeCreditCard()
    };
}

// ---------------------------------------------------------
// UI RENDERING
// ---------------------------------------------------------

function formatGenderLabel(gender) {
    if (gender === "female") return "Weiblich";
    if (gender === "male") return "Maennlich";
    return "Egal";
}

function renderSummary(data) {
    const initials = `${data.firstname?.[0] || ""}${data.lastname?.[0] || ""}`.toUpperCase();
    const avatar = document.getElementById("summary-avatar");
    avatar.textContent = initials || "ID";
    avatar.dataset.gender = data.gender || "any";
    document.getElementById("summary-name").textContent = data.name;
    document.getElementById("summary-gender").textContent = formatGenderLabel(data.gender);
    document.getElementById("summary-age").textContent = `${data.age} Jahre`;
    document.getElementById("summary-country").textContent = data.country.toUpperCase();
}

function renderPerson(data) {
    const el = document.getElementById("tab-person");
    el.innerHTML = `
<div class="panel-grid">
    <div class="panel">
        <div class="section-title">Person</div>
        <div class="field"><span class="label">Name:</span> ${data.name}</div>
        <div class="field"><span class="label">Geschlecht:</span> ${formatGenderLabel(data.gender)}</div>
        <div class="field"><span class="label">Alter:</span> ${data.age} Jahre</div>
        <div class="field"><span class="label">Geburtsdatum:</span> ${data.birthdate}</div>
        <div class="field"><span class="label">Telefon:</span> ${data.phone}</div>
    </div>
    <div class="panel">
        <div class="section-title">Adresse</div>
        <div class="field"><span class="label">Straße:</span> ${data.address.street} ${data.address.house_number}</div>
        <div class="field"><span class="label">PLZ / Ort:</span> ${data.address.postcode} ${data.address.city}</div>
    </div>
    <div class="panel">
        <div class="section-title">Login</div>
        <div class="field"><span class="label">Username:</span> ${data.username}</div>
        <div class="field"><span class="label">E-Mail:</span> ${data.email}</div>
    </div>
</div>
`;
}

function renderBank(data) {
    const el = document.getElementById("tab-bank");
    const b = data.bank_account;
    const ibanRow = b.iban
        ? `<div class="field"><span class="label">IBAN:</span> ${b.iban}</div>`
        : `<div class="field"><span class="label">Routing:</span> ${b.routing_number}</div>
<div class="field"><span class="label">Account:</span> ${b.account_number}</div>`;
    el.innerHTML = `
<div class="panel-grid">
    <div class="panel">
        <div class="section-title">Bankkonto (Fake)</div>
        <div class="field"><span class="label">Bank:</span> ${b.bank_name}</div>
        ${ibanRow}
        <div class="field"><span class="label">BIC:</span> ${b.bic}</div>
        <div class="field"><span class="label">Hinweis:</span> ${b.note}</div>
    </div>
</div>
`;
}

function renderCard(data) {
    const el = document.getElementById("tab-card");
    const c = data.credit_card;
    el.innerHTML = `
<div class="panel-grid">
    <div class="panel">
        <div class="section-title">Kreditkarte (Fake)</div>
        <div class="field"><span class="label">Kartennummer:</span> ${c.card_number}</div>
        <div class="field"><span class="label">Gültig bis:</span> ${c.expiry}</div>
        <div class="field"><span class="label">CVV:</span> ${c.cvv}</div>
        <div class="field"><span class="label">Hinweis:</span> ${c.note}</div>
    </div>
</div>
`;
}

function renderRaw(data) {
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function normalizeAgeRange(minAge, maxAge) {
    let min = Number.isFinite(minAge) ? minAge : 18;
    let max = Number.isFinite(maxAge) ? maxAge : 70;
    min = Math.max(18, Math.min(90, min));
    max = Math.max(18, Math.min(90, max));
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    return { min, max };
}

function generate() {
    const country = document.getElementById("country").value;
    const gender = document.getElementById("gender").value;
    const minAgeInput = parseInt(document.getElementById("age-min").value, 10);
    const maxAgeInput = parseInt(document.getElementById("age-max").value, 10);
    const range = normalizeAgeRange(minAgeInput, maxAgeInput);
    const data = generateIdentity(country, gender, range.min, range.max);
    lastData = data;
    renderSummary(data);
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
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
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
    const blob = new Blob([JSON.stringify(lastData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-id.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeCsv(value) {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function buildCsv(data) {
    const row = [
        data.name,
        data.firstname,
        data.lastname,
        data.gender,
        data.age,
        data.birthdate,
        data.email,
        data.phone,
        data.address.street,
        data.address.house_number,
        data.address.postcode,
        data.address.city,
        data.country,
        data.username,
        data.bank_account.bank_name,
        data.bank_account.iban || "",
        data.bank_account.routing_number || "",
        data.bank_account.account_number || "",
        data.bank_account.bic,
        data.credit_card.card_number,
        data.credit_card.expiry,
        data.credit_card.cvv
    ];
    const header = [
        "name",
        "firstname",
        "lastname",
        "gender",
        "age",
        "birthdate",
        "email",
        "phone",
        "street",
        "house_number",
        "postcode",
        "city",
        "country",
        "username",
        "bank_name",
        "iban",
        "routing_number",
        "account_number",
        "bic",
        "card_number",
        "card_expiry",
        "card_cvv"
    ];
    return [header, row].map((line) => line.map(escapeCsv).join(",")).join("\n");
}

function downloadCsv() {
    if (!lastData) return;
    const csv = buildCsv(lastData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-id.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function buildVcard(data) {
    const countryLabel =
        data.country === "de"
            ? "Deutschland"
            : data.country === "at"
                ? "Oesterreich"
                : data.country === "it"
                    ? "Italia"
                    : data.country.toUpperCase();
    return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${data.lastname};${data.firstname};;;`,
        `FN:${data.name}`,
        `BDAY:${data.birthdate}`,
        `TEL;TYPE=CELL:${data.phone}`,
        `EMAIL:${data.email}`,
        `ADR:;;${data.address.street} ${data.address.house_number};${data.address.city};;${data.address.postcode};${countryLabel}`,
        "NOTE:Fake test identity - not valid",
        "END:VCARD"
    ].join("\n");
}

function downloadVcard() {
    if (!lastData) return;
    const vcard = buildVcard(lastData);
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-id.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadPdf() {
    window.print();
}

// erste Fake-ID direkt beim Laden
window.addEventListener("load", async () => {
    await loadDataSets();
    generate();
});
