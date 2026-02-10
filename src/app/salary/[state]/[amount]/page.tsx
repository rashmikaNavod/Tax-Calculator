import { Metadata } from 'next';
import Home from "@/app/page";

interface Props {
    params: Promise<{
        state: string;
        amount: string;
    }>;
}

// 1. Dynamic Meta Data Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { state, amount } = await params;
    const stateDecoded = decodeURIComponent(state);
    const formattedState = stateDecoded.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const formattedAmount = parseInt(amount).toLocaleString();

    return {
        title: `$${formattedAmount} After Tax in ${formattedState} | 2026 Calculator`,
        description: `Calculate your 2026 take-home pay in ${formattedState} with a salary of $${formattedAmount}. See Federal and State tax breakdown instantly.`,
    };
}

// 2. The Page Component
export default async function DynamicSalaryPage({ params }: Props) {
    const { state, amount } = await params;

    return (
        <Home
            initialData={{
                state: decodeURIComponent(state).replace(/-/g, ' '),
                income: amount
            }}
        />
    );
}