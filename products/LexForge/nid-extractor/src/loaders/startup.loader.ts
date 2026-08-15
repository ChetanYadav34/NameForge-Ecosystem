import fs from 'fs';
import csv from 'csv-parser';
import { ingestRecord, beginTransaction, commitTransaction } from '../db/access';

const STARTUP_FILE = 'D:/Projects/resourses/Data/Brand Corpus/startups.csv';

export async function loadStartups() {
    return new Promise<void>((resolve, reject) => {
        let count = 0;
        console.log(`Starting Startup loader: ${STARTUP_FILE}`);
        beginTransaction();

        fs.createReadStream(STARTUP_FILE)
            .pipe(csv())
            .on('data', (data) => {
                const name = data.name;
                // startups.csv doesn't have explicit industry, we use 'Unknown Startup'
                const industry = 'Unknown Startup';
                
                ingestRecord(name, 'startup', industry, null, 0.8); // Generic startup weight = 0.8
                count++;
            })
            .on('end', () => {
                commitTransaction();
                console.log(`Loaded ${count} Generic Startups.`);
                resolve();
            })
            .on('error', (err) => {
                console.error("Startup Loader Error:", err);
                reject(err);
            });
    });
}
