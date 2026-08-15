import fs from 'fs';
import csv from 'csv-parser';
import { ingestRecord, beginTransaction, commitTransaction } from '../db/access';

const UNICORN_FILE = 'D:/Projects/resourses/Data/Brand Corpus/Unicorn_Companies.csv';

export async function loadUnicorns() {
    return new Promise<void>((resolve, reject) => {
        let count = 0;
        console.log(`Starting Unicorn loader: ${UNICORN_FILE}`);
        beginTransaction();

        fs.createReadStream(UNICORN_FILE)
            .pipe(csv())
            .on('data', (data) => {
                const name = data.Company;
                const industry = data.Industry || 'Unknown Unicorn';
                const yearFound = parseInt(data['Founded Year']) || null;
                
                // Parse valuation string like "$140" into number
                let valuationTier = 1.0;
                if (data['Valuation ($B)']) {
                    const val = parseFloat(data['Valuation ($B)'].replace(/[^0-9.]/g, ''));
                    if (!isNaN(val)) {
                        // Base weight 1.2, +0.01 per Billion valuation
                        valuationTier = 1.2 + (val * 0.01);
                    }
                }
                
                ingestRecord(name, 'unicorn', industry, yearFound, valuationTier);
                count++;
            })
            .on('end', () => {
                commitTransaction();
                console.log(`Loaded ${count} Unicorn Companies.`);
                resolve();
            })
            .on('error', (err) => {
                console.error("Unicorn Loader Error:", err);
                reject(err);
            });
    });
}
