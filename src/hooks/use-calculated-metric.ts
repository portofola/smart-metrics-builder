import { useState, useCallback } from 'react';
import { Operand, OperatorType } from '@/types/calculated-metric';
import { arrayMove } from '@dnd-kit/sortable';

export function useCalculatedMetric() {
  const [operands, setOperands] = useState<Operand[]>([]);
  const [metricName, setMetricName] = useState('');

  const addOperand = useCallback((operand: Omit<Operand, 'id'>) => {
    const newOperand: Operand = {
      ...operand,
      id: `operand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setOperands(prev => [...prev, newOperand]);
  }, []);

  const updateOperand = useCallback((id: string, updates: Partial<Operand>) => {
    setOperands(prev => 
      prev.map(op => op.id === id ? { ...op, ...updates } : op)
    );
  }, []);

  const removeOperand = useCallback((id: string) => {
    setOperands(prev => prev.filter(op => op.id !== id));
  }, []);

  const updateOperator = useCallback((id: string, operator: OperatorType) => {
    setOperands(prev =>
      prev.map(op => op.id === id ? { ...op, operator } : op)
    );
  }, []);

  const reorderOperands = useCallback((activeId: string, overId: string) => {
    setOperands(prev => {
      const oldIndex = prev.findIndex(op => op.id === activeId);
      const newIndex = prev.findIndex(op => op.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const getFormulaPreview = useCallback(() => {
    if (operands.length === 0) return '';
    
    return operands.map((op, index) => {
      const label = op.type === 'constant' ? `[${op.value}]` : op.label;
      if (index === 0) return label;
      
      const operatorSymbol = {
        add: '+',
        subtract: '-',
        multiply: '×',
      }[op.operator || 'add'];
      
      return `${operatorSymbol} ${label}`;
    }).join(' ');
  }, [operands]);

  const isValid = useCallback(() => {
    return operands.length >= 2 && metricName.trim().length > 0;
  }, [operands, metricName]);

  const reset = useCallback(() => {
    setOperands([]);
    setMetricName('');
  }, []);

  return {
    operands,
    metricName,
    setMetricName,
    addOperand,
    updateOperand,
    removeOperand,
    updateOperator,
    reorderOperands,
    getFormulaPreview,
    isValid,
    reset,
  };
}
