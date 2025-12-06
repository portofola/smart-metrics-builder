import { Metric, Constant } from '@/types/calculated-metric';

export const AVAILABLE_METRICS: Metric[] = [
  { id: 'impressions-paid', name: 'Impressions (paid)', source: 'Google Ads', category: 'Performance' },
  { id: 'clicks-paid', name: 'Clicks (paid)', source: 'Google Ads', category: 'Performance' },
  { id: 'conversions-paid', name: 'Conversions (paid)', source: 'Google Ads', category: 'Conversions' },
  { id: 'conversions-value', name: 'Conversions value (paid)', source: 'Google Ads', category: 'Revenue' },
  { id: 'cost-paid', name: 'Cost (paid)', source: 'Google Ads', category: 'Cost' },
  { id: 'ctr-paid', name: 'CTR (paid)', source: 'Google Ads', category: 'Performance' },
  { id: 'cpc-paid', name: 'Average CPC (paid)', source: 'Google Ads', category: 'Cost' },
  { id: 'cpm-paid', name: 'Average CPM (paid)', source: 'Google Ads', category: 'Cost' },
  { id: 'active-view-impressions', name: 'Active view impressions (paid)', source: 'Google Ads', category: 'Viewability' },
  { id: 'active-view-measurable', name: 'Active view measurable impressions (paid)', source: 'Google Ads', category: 'Viewability' },
  { id: 'conversion-all-sources', name: 'Conversions (all sources) (paid)', source: 'Google Ads', category: 'Conversions' },
];

export const AVAILABLE_CONSTANTS: Constant[] = [
  { id: 'vat-rate', name: 'VAT Rate', value: 0.077, unit: '%', timeSeries: false },
  { id: 'return-rate-de', name: 'Return Rate (DE)', value: 0.12, unit: '%', timeSeries: true },
  { id: 'return-rate-ch', name: 'Return Rate (CH)', value: 0.08, unit: '%', timeSeries: true },
  { id: 'margin-factor', name: 'Margin Factor', value: 0.35, unit: '%', timeSeries: false },
  { id: 'ltv-multiplier', name: 'LTV Multiplier', value: 2.5, timeSeries: false },
  { id: 'flown-factor', name: 'Flown Factor', value: 0.92, timeSeries: true },
];

export const FUNNEL_STEPS = [
  { id: 'cost', name: 'COST', isAssigned: false },
  { id: 'impressions', name: 'Impressions', isAssigned: true, assignmentType: 'Assign metric', value: 'Impressions (paid)' },
  { id: 'clicks', name: 'Clicks', isAssigned: true, assignmentType: 'Assign metric', value: 'Clicks (paid)' },
  { id: 'registration', name: 'Registration', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
  { id: 'first-deposit', name: 'First Deposit', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
  { id: 'deposit-balance-load', name: 'Deposit Balance Load', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
];
