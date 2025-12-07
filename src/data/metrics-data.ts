import { Metric, Constant, CustomConversionConfig, UTMConfig, CustomImportConfig, CustomKPIConfig } from '@/types/calculated-metric';

export const AVAILABLE_METRICS: Metric[] = [
  { id: 'impressions-paid', name: 'Impressions (paid)', category: 'Performance' },
  { id: 'clicks-paid', name: 'Clicks (paid)', category: 'Performance' },
  { id: 'conversions-paid', name: 'Conversions (paid)', category: 'Conversions' },
  { id: 'conversions-value', name: 'Conversions value (paid)', category: 'Revenue' },
  { id: 'cost-paid', name: 'Cost (paid)', category: 'Cost' },
  { id: 'ctr-paid', name: 'CTR (paid)', category: 'Performance' },
  { id: 'cpc-paid', name: 'Average CPC (paid)', category: 'Cost' },
  { id: 'cpm-paid', name: 'Average CPM (paid)', category: 'Cost' },
  { id: 'active-view-impressions', name: 'Active view impressions (paid)', category: 'Viewability' },
  { id: 'active-view-measurable', name: 'Active view measurable impressions (paid)', category: 'Viewability' },
  { id: 'conversion-all-sources', name: 'Conversions (all sources) (paid)', category: 'Conversions' },
];

export const AVAILABLE_CONSTANTS: Constant[] = [
  { id: 'vat-rate-de', name: 'VAT Rate (Germany)', value: 19, unit: '%', timeSeries: true, location: 'Germany', periods: 1 },
  { id: 'vat-rate-ch', name: 'VAT Rate (Switzerland)', value: 7.7, unit: '%', timeSeries: false, location: 'Switzerland' },
  { id: 'return-rate-de', name: 'Return Rate (DE)', value: 12, unit: '%', timeSeries: true, location: 'Germany', periods: 4 },
  { id: 'return-rate-ch', name: 'Return Rate (CH)', value: 8, unit: '%', timeSeries: true, location: 'Switzerland', periods: 3 },
  { id: 'margin-factor', name: 'Margin factor', value: 0.85, timeSeries: false },
  { id: 'ltv-multiplier', name: 'LTV Multiplier', value: 2.5, timeSeries: false },
  { id: 'flown-factor', name: 'Flown Factor', value: 0.92, timeSeries: true, periods: 12 },
];

export const SAVED_CUSTOM_CONVERSIONS: CustomConversionConfig[] = [
  {
    id: 'purchase-config',
    name: 'Purchase Conversions',
    goals: [
      { id: 'g1', goalName: 'Purchase (PURCHASE)', metric: 'Conversions (paid)', type: 'simple' },
      { id: 'g2', goalName: 'Conversions (PURCHASE)', metric: 'Conversions (paid)', type: 'simple' },
    ],
  },
  {
    id: 'lead-config',
    name: 'Lead Generation',
    goals: [
      { id: 'g3', goalName: 'Form Submit', metric: 'Conversions (paid)', type: 'event-name', eventName: 'form_submit' },
    ],
  },
];

export const SAVED_UTM_CONFIGS: UTMConfig[] = [
  {
    id: 'utm-1',
    name: 'Campaign Tracking DE',
    ga4Property: 'GA4 - Main Property',
    utmParameters: [{ id: 'p1', dimension: 'utm_source', value: 'google' }],
    metric: 'Conversions (paid)',
  },
];

export const SAVED_CUSTOM_IMPORTS: CustomImportConfig[] = [
  { id: 'import-1', title: 'Revenue Import', metric: 'Currency' },
];

export const SAVED_CUSTOM_KPIS: CustomKPIConfig[] = [
  { id: 'kpi-1', title: 'Custom Revenue KPI', metric: 'Custom KPI (currency)' },
  { id: 'kpi-2', title: 'Average Order Value', metric: 'Custom KPI (average in currency)' },
];

export const CONVERSION_GOALS = [
  { id: 'user-bonus-code', name: 'User Bonus Code (01 - Reporting) (I)' },
  { id: 'calls-adwords', name: 'Calls from AdWords Express Ads (F)' },
  { id: 'purchase', name: 'Purchase (PURCHASE)' },
  { id: 'add-to-cart', name: 'Add to Carts' },
  { id: 'form-submit', name: 'Form Submit' },
];

export const METRIC_OPTIONS = [
  'Active view impressions (paid)',
  'Active view measurable impressions (paid)',
  'Conversions (all sources) (paid)',
  'Conversions (paid)',
  'Conversions value (paid)',
  'Average CPC (paid)',
  'Average CPM (paid)',
  'Cost (paid)',
  'CTR (paid)',
  'Add to Carts',
];

export const EVENT_NAMES = [
  'purchase',
  'add_to_cart',
  'begin_checkout',
  'view_item',
  'form_submit',
  'page_view',
  'scroll',
];

export const GA4_PROPERTIES = [
  'GA4 - Main Property',
  'GA4 - E-commerce',
  'GA4 - Marketing',
];

export const UTM_DIMENSIONS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

export const CUSTOM_IMPORT_METRICS = [
  'Currency',
  'Percentage',
  'Number',
];

export const CUSTOM_KPI_METRICS = [
  'Custom KPI (currency)',
  'Custom KPI (average in currency)',
  'Custom KPI (percentage)',
  'Custom KPI (count)',
];

export const FUNNEL_STEPS = [
  { id: 'cost', name: 'COST', isAssigned: false },
  { id: 'impressions', name: 'Impressions', isAssigned: true, assignmentType: 'Assign metric', value: 'Impressions (paid)' },
  { id: 'clicks', name: 'Clicks', isAssigned: true, assignmentType: 'Assign metric', value: 'Clicks (paid)' },
  { id: 'registration', name: 'Registration', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
  { id: 'first-deposit', name: 'First Deposit', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
  { id: 'deposit-balance-load', name: 'Deposit Balance Load', isAssigned: true, assignmentType: 'Custom conversions', value: 'Multiple custom conversions' },
];
