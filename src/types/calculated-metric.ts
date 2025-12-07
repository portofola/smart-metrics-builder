export type OperatorType = 'add' | 'subtract' | 'multiply';

export type OperandType = 'metric' | 'constant' | 'custom-conversion' | 'utm' | 'custom-import' | 'custom-kpi';

export interface Operand {
  id: string;
  type: OperandType;
  label: string;
  value?: string | number;
  source?: string;
  operator?: OperatorType;
}

export interface Metric {
  id: string;
  name: string;
  source?: string;
  category?: string;
}

export interface Constant {
  id: string;
  name: string;
  value: number;
  unit?: string;
  timeSeries?: boolean;
  location?: string;
  periods?: number;
}

export interface CustomConversionConfig {
  id: string;
  name: string;
  goals: ConversionGoal[];
}

export interface ConversionGoal {
  id: string;
  goalName: string;
  metric: string;
  type: 'simple' | 'event-name';
  eventName?: string;
}

export interface UTMConfig {
  id: string;
  name: string;
  ga4Property: string;
  utmParameters: UTMParameter[];
  metric: string;
}

export interface UTMParameter {
  id: string;
  dimension: string;
  value: string;
}

export interface CustomImportConfig {
  id: string;
  title: string;
  metric: string;
}

export interface CustomKPIConfig {
  id: string;
  title: string;
  metric: string;
}

export interface CalculatedMetricConfig {
  name: string;
  operands: Operand[];
  resultMetric?: string;
}

export interface FunnelStep {
  id: string;
  name: string;
  isAssigned: boolean;
  assignmentType?: string;
  value?: string;
}

export type MappingType = 
  | 'assign-metric'
  | 'custom-conversions'
  | 'utm-tracking'
  | 'custom-import'
  | 'custom-metric'
  | 'calculated-metric'
  | 'ignore-mapping';

export type OperandTabType = 'metric' | 'custom-conversions' | 'utm' | 'custom-import' | 'custom-kpi' | 'constants';
