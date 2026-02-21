// src/services/api.js

/**
 * Mocks a network request with a given delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates submitting KYC data to the backend.
 * The backend scrapes the URL, extracts documents, generates a profile, and stores it.
 */
export const submitKYC = async (payload) => {
    await delay(2500); // simulate 2.5s processing time
    return {
        success: true,
        message: 'Company profile generated and stored successfully.'
    };
};

/**
 * Simulates fetching OUR company profile from the backend.
 */
export const getCompanyDashboard = async () => {
    await delay(1200);
    return {
        overview: {
            name: 'Acme Corp',
            description: 'Acme Corp provides automated enterprise cloud security architecture and zero-trust implementations. Our AI-driven platform continuously monitors compliance, ensures data privacy governance, and offers 24/7 managed proactive threat hunting for Fortune 500 companies.',
        },
        metrics: [
            { title: 'Total ICP Matches', value: '1,284' },
            { title: 'Active Markets', value: '4 Regions' },
            { title: 'Total Engagements', value: '342' },
            { title: 'Pipeline Value', value: '$4.2M' },
        ],
        services: [
            { name: 'Enterprise Cloud Security Architecture', description: 'Full-stack security audits and Zero-Trust implementations for Fortune 500s.' },
            { name: 'Data Privacy & Compliance Governance', description: 'Automated GDPR/CCPA readiness frameworks and continuous monitoring.' },
            { name: 'Managed Threat Intelligence', description: '24/7 proactive threat hunting and automated incident response integration.' },
        ],
        recentSignals: [
            { title: 'New Product Launch: Auto-Scoring API', date: 'Oct 24, 2023', type: 'Product' },
            { title: 'Expanded into EMEA Market via London Office', date: 'Sep 12, 2023', type: 'Expansion' },
            { title: 'Series A Funding Round Closed ($12M)', date: 'Aug 05, 2023', type: 'Funding' },
        ],
        documentsSummmary: 'Analyzed 45 internal documents, including master service agreements, pitch decks, and architectural schematics.'
    };
};

/**
 * Simulates requesting backend to find similar strategic-fit companies based on OUR documents.
 */
export const getRecommendations = async () => {
    await delay(1500);
    return [
        { id: '1', name: 'Stripe', industry: 'FinTech', matchScore: 94, reason: 'Strong need for automated compliance monitoring scaling with their new crypto payouts.' },
        { id: '2', name: 'Vercel', industry: 'Developer Tools', matchScore: 91, reason: 'Rapidly expanding enterprise tier requiring Zero-Trust security architecture.' },
        { id: '3', name: 'Datadog', industry: 'Cloud Monitoring', matchScore: 88, reason: 'Synergistic managed threat intelligence integration potential.' },
    ];
};

/**
 * Simulates the autonomous multi-agent analysis for a specific target company URL.
 */
export const runTargetAnalysis = async (url) => {
    await delay(3500); // simulate complex multi-agent analysis
    return {
        dossier: [
            { title: 'Company Overview', content: `${url} is rapidly scaling its infrastructure. Businesses rely on them to process critical data and payments.` },
            { title: 'Tech Stack', content: 'React, Node.js, Go, PostgreSQL, AWS, Kubernetes.' },
            { title: 'Recent Signals', content: 'Recently established a new European headquarters and showed signs of technical debt related to sudden traffic spikes.' },
        ],
        verdict: 'STRONG BUY',
        confidence: 94,
        outreachStrategy: `Hi Sarah,\n\nI noticed ${url} recently expanded its operations into Europe—huge congrats on the growth. \n\nGiven your focus on scaling infrastructure alongside this growth, I thought you might be interested in how our platform automates compliance governance and zero-trust security, reducing manual overhead by 40%.\n\nOpen to a quick chat next Tuesday?`,
        agentTrace: [
            { id: 1, name: 'Web Scraper', details: `Crawled 45 pages across ${url} domain and news sources.` },
            { id: 2, name: 'Signal Detector', details: 'Detected recent expansion and technical debt signals.' },
            { id: 3, name: 'Strategic Analyzer', details: 'Determined high alignment with target ICP based on our stored documents.' },
            { id: 4, name: 'Copywriter Agent', details: 'Drafted 2 highly personalized email variants.' },
        ]
    };
};

/**
 * Simulates PDF generation
 */
export const generatePDF = async (url) => {
    await delay(2000);
    return {
        success: true,
        downloadUrl: '#' // Mock URL
    };
};
