export type OperatorType = 'add' | 'subtract' | 'multiply';

export type OperandType = 'metric' | 'constant';

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
  source: string;
  category?: string;
}

export interface Constant {
  id: string;
  name: string;
  value: number;
  unit?: string;
  timeSeries?: boolean;
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
