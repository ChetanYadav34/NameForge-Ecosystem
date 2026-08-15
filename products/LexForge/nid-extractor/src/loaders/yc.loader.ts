import fs from 'fs';
import csv from 'csv-parser';
import { ingestRecord, beginTransaction, commitTransaction } from '../db/access';

const YC_FILE = 'D:/Projects/resourses/Data/Brand Corpus/2023-07-13-yc-companies.csv';

export async function loadYC() {
    return new Promise<void>((resolve, reject) => {
        let count = 0;
        console.log(`Starting YC loader: ${YC_FILE}`);
        beginTransaction();

        fs.createReadStream(YC_FILE)
            .pipe(csv())
            .on('data', (data) => {
                const name = data.company_name;
                
                let industry = 'Unknown';
                if (data.tags) {
                    const cleanTags = data.tags.replace(/[\\[\\]']/g, '');
                    const tagsArray = cleanTags.split(',');
                    industry = tagsArray[0]?.trim() || 'Unknown';
                }

                const yearFound = parseInt(data.year_founded) || null;
                
                ingestRecord(name, 'yc', industry, yearFound, 1.0); // YC baseline weight = 1.0
                count++;
            })
            .on('end', () => {
                commitTransaction();
                console.log(`Loaded ${count} YC companies.`);
                resolve();
            })
            .on('error', (err) => {
                console.error("YC Loader Error:", err);
                reject(err);
            });
    });
}
