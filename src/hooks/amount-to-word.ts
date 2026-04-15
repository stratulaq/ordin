const units: string[] = [
    "", "unu", "doi", "trei", "patru", "cinci",
    "șase", "șapte", "opt", "nouă"
];

const teens: string[] = [
    "zece", "unsprezece", "doisprezece", "treisprezece",
    "paisprezece", "cincisprezece", "șaisprezece",
    "șaptesprezece", "optsprezece", "nouăsprezece"
];

const tens: string[] = [
    "", "", "douăzeci", "treizeci", "patruzeci",
    "cincizeci", "șaizeci", "șaptezeci",
    "optzeci", "nouăzeci"
];

function under1000(n: number): string {
    let result = "";

    if (n >= 100) {
        const hundreds = Math.floor(n / 100);
        if (hundreds === 1) {
            result += "o sută";
        } else {
            result += units[hundreds] + " sute";
        }
        n %= 100;
        if (n) result += " ";
    }

    if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        if (n % 10) {
            result += " și " + units[n % 10];
        }
    } else if (n >= 10) {
        result += teens[n - 10];
    } else if (n > 0) {
        result += units[n];
    }

    return result;
}

function numberToWordsRo(n: number): string {
    if (n === 0) return "zero";

    let result = "";

    if (n >= 1_000_000) {
        const millions = Math.floor(n / 1_000_000);
        if (millions === 1) {
            result += "un milion";
        } else {
            result += numberToWordsRo(millions) + " milioane";
        }
        n %= 1_000_000;
        if (n) result += " ";
    }

    if (n >= 1000) {
        const thousands = Math.floor(n / 1000);
        if (thousands === 1) {
            result += "o mie";
        } else {
            result += numberToWordsRo(thousands) + " mii";
        }
        n %= 1000;
        if (n) result += " ";
    }

    if (n > 0) {
        result += under1000(n);
    }

    return result.trim();
}

export function amountToRomanianWords(amount: number): string {
    const [leiPart, baniPart] = amount.toFixed(2).split(".");

    const lei = parseInt(leiPart, 10);
    const bani = parseInt(baniPart, 10);

    const leiWords = numberToWordsRo(lei);

    const leiLabel = lei === 1 ? "leu" : "lei";
    const baniLabel = bani === 1 ? "ban" : "bani";

    return `${leiWords} ${leiLabel} și ${bani} ${baniLabel}`;
}