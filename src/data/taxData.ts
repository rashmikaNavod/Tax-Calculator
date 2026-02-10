import { TaxData, StateTaxRates } from '@/types';

// 1. Federal Tax Brackets 2026 (Official IRS – Post-OBBBA)
export const taxBrackets: TaxData = {
    single: [
        { rate: 0.10, limit: 12400 },
        { rate: 0.12, limit: 50400 },
        { rate: 0.22, limit: 105700 },
        { rate: 0.24, limit: 201775 },
        { rate: 0.32, limit: 256225 },
        { rate: 0.35, limit: 640600 },
        { rate: 0.37, limit: Infinity },
    ],
    married: [
        { rate: 0.10, limit: 24800 },
        { rate: 0.12, limit: 100800 },
        { rate: 0.22, limit: 211400 },
        { rate: 0.24, limit: 403550 },
        { rate: 0.32, limit: 512450 },
        { rate: 0.35, limit: 768700 },
        { rate: 0.37, limit: Infinity },
    ],
    head_of_household: [
        { rate: 0.10, limit: 17700 },
        { rate: 0.12, limit: 67450 },
        { rate: 0.22, limit: 105700 },
        { rate: 0.24, limit: 201775 },
        { rate: 0.32, limit: 256225 },
        { rate: 0.35, limit: 640600 },
        { rate: 0.37, limit: Infinity },
    ]
};

// 2. Standard Deduction 2026
export const standardDeduction: Record<string, number> = {
    single: 16100,
    married: 32200,
    head_of_household: 24150,
};

// 3. FICA Tax Rates 2026
export const ficaRates = {
    socialSecurity: 0.062,
    medicare: 0.0145,
    additionalMedicare: 0.009,
    socialSecurityLimit: 184500,
    // Additional Medicare Tax thresholds
    additionalMedicareThreshold: {
        single: 200000,
        married: 250000,
        head_of_household: 200000,
    },
};

// 4. State Tax Rates 2026 (Estimated Effective Rates)
export const stateTaxRates: StateTaxRates = {
    'Alabama': 0.04,
    'Alaska': 0,
    'Arizona': 0.025,
    'Arkansas': 0.039,
    'California': 0.093,
    'Colorado': 0.044,
    'Connecticut': 0.0699,
    'Delaware': 0.066,
    'Florida': 0,
    'Georgia': 0.0499,
    'Hawaii': 0.11,
    'Idaho': 0.058,
    'Illinois': 0.0495,
    'Indiana': 0.0305,
    'Iowa': 0.038,
    'Kansas': 0.057,
    'Kentucky': 0.04,
    'Louisiana': 0.0425,
    'Maine': 0.0715,
    'Maryland': 0.0575,
    'Massachusetts': 0.05,
    'Michigan': 0.0425,
    'Minnesota': 0.0985,
    'Mississippi': 0.047,
    'Missouri': 0.048,
    'Montana': 0.059,
    'Nebraska': 0.0584,
    'Nevada': 0,
    'New Hampshire': 0,
    'New Jersey': 0.1075,
    'New Mexico': 0.059,
    'New York': 0.065,
    'North Carolina': 0.0399,
    'North Dakota': 0.0195,
    'Ohio': 0.035,
    'Oklahoma': 0.0475,
    'Oregon': 0.099,
    'Pennsylvania': 0.0307,
    'Rhode Island': 0.0599,
    'South Carolina': 0.064,
    'South Dakota': 0,
    'Tennessee': 0,
    'Texas': 0,
    'Utah': 0.0465,
    'Vermont': 0.0875,
    'Virginia': 0.0575,
    'Washington': 0,
    'West Virginia': 0.055,
    'Wisconsin': 0.0765,
    'Wyoming': 0,
    'District of Columbia': 0.0895,
};