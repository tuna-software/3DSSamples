export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBoolean() {
    return Math.random() < 0.5;
}

export function getRandomDatePast() {
    const twoYearsAgo = new Date(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)); 
    return new Date(getRandomInt(twoYearsAgo.getTime(), Date.now())).toISOString();
}

export function getRandomPhoneNumber() {
    const phoneNumber = `(${getRandomInt(10, 99)}) 9${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`;
    return phoneNumber;
}

export function getRandomCPF() {
    const cpfNumbers = `${getRandomInt(100, 999)}.${getRandomInt(100, 999)}.${getRandomInt(100, 999)}-${getRandomInt(10, 99)}`;
    return cpfNumbers;
}

export function getRandomCNPJ() {
    const cnpjNumbers = `${getRandomInt(10, 99)}.${getRandomInt(100, 999)}.${getRandomInt(100, 999)}/0001-${getRandomInt(10, 99)}`;
    return cnpjNumbers;
}

export function getRandomCompanyName() {
    const companies = ['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D'];
    return companies[getRandomInt(0, companies.length - 1)];
}

export function getRandomProductName() {
    const products = ['Produto X', 'Produto Y', 'Produto Z'];
    return products[getRandomInt(0, products.length - 1)];
}

export function getRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36'
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export function getRandomIP() {
    const ipSegments = [];
    for (let i = 0; i < 4; i++) {
        ipSegments.push(Math.floor(Math.random() * 256).toString()); // Converter para string
    }
    return ipSegments.join('.'); // Retorna o endereço IP no formato "xxx.xxx.xxx.xxx"
}