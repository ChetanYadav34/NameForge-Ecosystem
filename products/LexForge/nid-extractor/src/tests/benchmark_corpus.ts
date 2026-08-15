export const BENCHMARK_CORPORA = {
    saas: [
        'Slack', 'Zoom', 'Vercel', 'Datadog', 'Airtable', 'Notion', 'Figma', 'Linear',
        'Zendesk', 'HubSpot', 'Atlassian', 'Twilio', 'Okta', 'Splunk', 'Snowflake',
        'Salesforce', 'Workday', 'ServiceNow', 'DocuSign', 'Shopify', 'Gusto', 'Rippling',
        'Glean', 'Miro', 'Canva', 'Zapier', 'Asana', 'Monday', 'Smartsheet', 'Tableau'
    ],
    fintech: [
        'Stripe', 'Plaid', 'Brex', 'Ramp', 'Chime', 'Square', 'Revolut', 'Monzo',
        'Coinbase', 'Robinhood', 'Affirm', 'Klarna', 'SoFi', 'Adyen', 'Nubank',
        'Plaid', 'Carta', 'Toast', 'Marqeta', 'Bill', 'Gusto', 'Ripple', 'Plaid',
        'Mercury', 'Wise', 'N26', 'Venmo', 'PayPal', 'Zelle', 'Wealthfront'
    ],
    ai: [
        'OpenAI', 'Anthropic', 'Cohere', 'Perplexity', 'Glean', 'Jasper', 'Midjourney',
        'Stability', 'HuggingFace', 'Scale', 'ScaleAI', 'Runway', 'Inflection',
        'Adept', 'Character', 'Replicate', 'Descript', 'CopyAI', 'Grammarly', 'Synthesia',
        'Tome', 'Harvey', 'Typeface', 'Pinecone', 'Weaviate', 'Chroma', 'LangChain'
    ],
    consumer: [
        'Airbnb', 'Spotify', 'Netflix', 'Peloton', 'Roku', 'Hulu', 'Uber', 'Lyft',
        'Instacart', 'DoorDash', 'Postmates', 'Grubhub', 'Pinterest', 'Snapchat',
        'TikTok', 'Discord', 'Twitch', 'Reddit', 'Tinder', 'Bumble', 'Duolingo',
        'Zillow', 'Opendoor', 'Poshmark', 'Etsy', 'Warby', 'Casper', 'Glossier'
    ],
    enterprise: [
        'Oracle', 'Palantir', 'Cisco', 'IBM', 'Microsoft', 'Amazon', 'Google', 'Apple',
        'Meta', 'Intel', 'AMD', 'Nvidia', 'Qualcomm', 'Broadcom', 'VMware', 'SAP',
        'Adobe', 'Intuit', 'Autodesk', 'Symantec', 'PaloAlto', 'CrowdStrike', 'Fortinet',
        'Zscaler', 'Cloudflare', 'Fastly', 'Akamai', 'Equinix', 'DigitalOcean', 'MongoDB'
    ]
};

export const ALL_BENCHMARKS = [
    ...new Set([
        ...BENCHMARK_CORPORA.saas,
        ...BENCHMARK_CORPORA.fintech,
        ...BENCHMARK_CORPORA.ai,
        ...BENCHMARK_CORPORA.consumer,
        ...BENCHMARK_CORPORA.enterprise
    ])
];
