import { loadYC } from './yc.loader';
import { loadStartups } from './startup.loader';
import { loadUnicorns } from './unicorn.loader';
import { loadFortune } from './fortune.loader';

export async function runLoaders() {
    console.log("=== PHASE 2: Dataset Loaders & Normalization ===");
    try {
        await loadYC();
        await loadStartups();
        await loadUnicorns();
        await loadFortune();
        console.log("All datasets loaded successfully.");
    } catch (err) {
        console.error("Failed to load datasets:", err);
    }
}

if (require.main === module) {
    runLoaders().then(() => process.exit(0));
}
