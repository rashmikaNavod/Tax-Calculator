"use client";

import { useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { taxBrackets, stateTaxRates, standardDeduction, ficaRates } from '@/data/taxData';
import { CalculationResult, FilingStatus } from '@/types';

interface HomeProps {
  initialData?: {
    income?: string;
    state?: string;
  };
}

export default function Home({ initialData }: HomeProps) {

  // State Management
  const [income, setIncome] = useState<string>(initialData?.income || '');
  const [state, setState] = useState<string>(() => {
    if (initialData?.state) {
      const decoded = decodeURIComponent(initialData.state);
      return Object.keys(stateTaxRates).find(
        key => key.toLowerCase() === decoded.toLowerCase()
      ) || 'Texas';
    }
    return 'Texas';
  });
  const [status, setStatus] = useState<FilingStatus>('single');
  const [result, setResult] = useState<CalculationResult | null>(() => {
    // Auto-calculate on mount if initialData is present
    if (initialData?.income && initialData?.state) {
      const grossIncome = parseFloat(initialData.income || '0');
      const decoded = decodeURIComponent(initialData.state);
      const matchedState = Object.keys(stateTaxRates).find(
        key => key.toLowerCase() === decoded.toLowerCase()
      ) || 'Texas';

      return calculateTax(grossIncome, matchedState, 'single');
    }
    return null;
  });

  // --- Calculation Logic (pure function, no stale closures) ---
  function calculateTax(grossIncome: number, selectedState: string, filingStatus: FilingStatus): CalculationResult {
    // 1. Standard Deduction
    const deduction = standardDeduction[filingStatus] || standardDeduction.single;
    const taxableIncome = Math.max(0, grossIncome - deduction);

    // 2. Federal Tax (progressive brackets)
    let federalTax = 0;
    let previousLimit = 0;
    const brackets = taxBrackets[filingStatus];

    for (const bracket of brackets) {
      if (taxableIncome > previousLimit) {
        const incomeInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
        federalTax += incomeInBracket * bracket.rate;
        previousLimit = bracket.limit;
      } else {
        break;
      }
    }

    // 3. FICA Tax
    const socialSecurityTax = Math.min(grossIncome, ficaRates.socialSecurityLimit) * ficaRates.socialSecurity;
    const medicareTax = grossIncome * ficaRates.medicare;

    // Additional Medicare Tax (0.9% on income exceeding threshold)
    const medicareThreshold = ficaRates.additionalMedicareThreshold[filingStatus] || 200000;
    const additionalMedicareTax = grossIncome > medicareThreshold
      ? (grossIncome - medicareThreshold) * ficaRates.additionalMedicare
      : 0;

    const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax;

    // 4. State Tax
    const stateRate = stateTaxRates[selectedState] || 0;
    const stateTax = grossIncome * stateRate;

    const totalTax = federalTax + ficaTax + stateTax;
    const netPay = grossIncome - totalTax;

    return {
      gross: grossIncome,
      federal: federalTax,
      fica: ficaTax,
      additionalMedicare: additionalMedicareTax,
      state: stateTax,
      totalTax,
      net: netPay,
    };
  }

  const handleCalculate = useCallback((e?: FormEvent) => {
    if (e) e.preventDefault();
    const grossIncome = parseFloat(income);
    if (!grossIncome || isNaN(grossIncome)) return;

    const res = calculateTax(grossIncome, state, status);
    setResult(res);
    window.open('https://www.effectivegatecpm.com/jqta7e0a?key=dd32b3531f08bcedad4acd20f8f787e4', '_blank');
    // window.open('https://www.google.com', '_blank');
  }, [income, state, status]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4">

      {/* Header */}
      <header className="w-full max-w-4xl py-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900">
          {initialData ? `Salary after Tax in ${state}` : "US Smart Tax 2026"}
        </h1>
        {/* <div className="hidden md:block bg-gray-200 text-xs text-gray-400 p-2 rounded">
          Sponsored Ad
        </div> */}
      </header>

      {/* Calculator Card */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          2026 Salary Paycheck Calculator
        </h2>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Annual Income ($)</label>
            <input
              type="number"
              id="gross-income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 75000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              id="state-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black"
            >
              {Object.keys(stateTaxRates).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio" name="status" value="single"
                  checked={status === 'single'}
                  onChange={() => setStatus('single')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Single</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio" name="status" value="married"
                  checked={status === 'married'}
                  onChange={() => setStatus('married')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Married</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio" name="status" value="head_of_household"
                  checked={status === 'head_of_household'}
                  onChange={() => setStatus('head_of_household')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Head of Household</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg">
            Calculate My Tax
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-8 bg-white shadow-xl rounded-2xl w-full max-w-md p-6 border-t-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Estimated Paycheck Breakdown</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Gross Income:</span><span className="font-medium text-gray-900">${result.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <hr className="my-1 border-gray-100" />
            <div className="flex justify-between text-gray-600">
              <span>Federal Tax:</span><span className="font-medium text-red-500">-${result.federal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>State Tax ({state}):</span><span className="font-medium text-red-500">-${result.state.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>FICA (SS + Medicare):</span><span className="font-medium text-red-500">-${result.fica.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {result.additionalMedicare > 0 && (
              <div className="flex justify-between text-gray-600 text-xs">
                <span className="pl-4 italic">↳ Includes Additional Medicare Tax:</span>
                <span className="font-medium text-red-400">-${result.additionalMedicare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between text-gray-600">
              <span>Total Tax:</span><span className="font-bold text-red-600">-${result.totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Effective Tax Rate:</span><span className="font-medium text-gray-800">{((result.totalTax / result.gross) * 100).toFixed(1)}%</span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Net Pay:</span><span className="text-green-600">${result.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / yr</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Monthly:</span><span>${(result.net / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Bi-weekly:</span><span>${(result.net / 26).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Internal SEO Linking --- */}
      <section className="mt-12 w-full max-w-4xl mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Popular Calculations for {state}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000].map((amt) => (
            <Link
              key={amt}
              href={`/salary/${state.toLowerCase().replace(/ /g, "-")}/${amt}`}
              className="block p-3 bg-white border border-gray-200 rounded-lg text-center text-blue-600 hover:bg-blue-50 text-sm"
            >
              ${amt.toLocaleString()} in {state}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}