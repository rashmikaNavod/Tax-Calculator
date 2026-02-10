export interface TaxBracket {
    rate: number;
    limit: number;
}

export type FilingStatus = 'single' | 'married' | 'head_of_household';

export interface TaxData {
    single: TaxBracket[];
    married: TaxBracket[];
    head_of_household: TaxBracket[];
}

export interface StateTaxRates {
    [key: string]: number;
}

export interface CalculationResult {
    gross: number;
    federal: number;
    fica: number;
    additionalMedicare: number;
    state: number;
    totalTax: number;
    net: number;
}

export interface InitialDataProps {
    income?: string;
    state?: string;
}