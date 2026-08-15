import fs from 'fs';
import csv from 'csv-parser';
import { ingestRecord, beginTransaction, commitTransaction } from '../db/access';

const FORTUNE_FILE = 'D:/Projects/resourses/Data/Brand Corpus/Fortune_1000.csv'; // Placeholder if we find it later

export async function loadFortune() {
    return new Promise<void>((resolve, reject) => {
        if (!fs.existsSync(FORTUNE_FILE)) {
            console.log(`Fortune loader skipped: ${FORTUNE_FILE} not found.`);
            return resolve();
        }

        let count = 0;
        console.log(`Starting Fortune loader: ${FORTUNE_FILE}`);
        beginTransaction();

        fs.createReadStream(FORTUNE_FILE)
            .pipe(csv())
            .on('data', (data) => {
                const name = data.Company || data.name;
                const industry = data.Sector || data.Industry || 'Enterprise';
                
                // Base weight 1.5 for fortune
                ingestRecord(name, 'fortune', industry, null, 1.5);
                count++;
            })
            .on('end', () => {
                commitTransaction();
                console.log(`Loaded ${count} Fortune Companies.`);
                resolve();
            })
            .on('error', (err) => {
                console.error("Fortune Loader Error:", err);
                reject(err);
            });
    });
}
