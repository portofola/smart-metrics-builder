import { useMemo } from 'react';
import { Operand } from '@/types/calculated-metric';
import { cn } from '@/lib/utils';

interface FormulaPreviewProps {
  operands: Operand[];
  className?: string;
}

const operatorSymbols = {
  add: '+',
  subtract: '−',
  multiply: '×',
};

function renderOperand(operand: Operand, index: number, isInGroup = false): React.ReactNode {
  // Handle grouped operands
  if (operand.type === 'group' && operand.children) {
    return (
      <span key={operand.id} className="inline-flex items-center gap-1">
        {index > 0 && (
          <span
            className={cn(
              "mx-1 font-bold text-lg",
              operand.operator === 'add' && "text-operator-add",
              operand.operator === 'subtract' && "text-operator-subtract",
              operand.operator === 'multiply' && "text-operator-multiply"
            )}
          >
            {operatorSymbols[operand.operator || 'add']}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 px-2 py-1">
          <span className="text-muted-foreground font-medium">(</span>
          {operand.children.map((child, childIndex) => renderOperand(child, childIndex, true))}
          <span className="text-muted-foreground font-medium">)</span>
        </span>
      </span>
    );
  }

  const isConstant = operand.type === 'constant';
  const displayLabel = isConstant ? `[${operand.value}]` : operand.label;

  return (
    <span key={operand.id} className="inline-flex items-center gap-1">
      {index > 0 && (
        <span
          className={cn(
            "mx-1 font-bold text-lg",
            operand.operator === 'add' && "text-operator-add",
            operand.operator === 'subtract' && "text-operator-subtract",
            operand.operator === 'multiply' && "text-operator-multiply"
          )}
        >
          {operatorSymbols[operand.operator || 'add']}
        </span>
      )}
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium",
          isConstant
            ? "bg-constant/15 text-constant border border-constant/30"
            : "bg-accent text-accent-foreground border border-border"
        )}
      >
        {displayLabel}
      </span>
    </span>
  );
}

export function FormulaPreview({ operands, className }: FormulaPreviewProps) {
  const formulaElements = useMemo(() => {
    if (operands.length === 0) return null;
    return operands.map((operand, index) => renderOperand(operand, index));
  }, [operands]);

  // Generate a readable label from the formula
  const generatedLabel = useMemo(() => {
    if (operands.length === 0) return '';
    
    const parts = operands.map((op, index) => {
      if (op.type === 'group' && op.children) {
        const groupParts = op.children.map((child, i) => {
          const label = child.type === 'constant' ? child.value : child.label;
          if (i === 0) return label;
          const symbol = child.operator === 'multiply' ? '×' : child.operator === 'subtract' ? '-' : '+';
          return `${symbol} ${label}`;
        }).join(' ');
        if (index === 0) return `(${groupParts})`;
        const symbol = op.operator === 'multiply' ? '×' : op.operator === 'subtract' ? '-' : '+';
        return `${symbol} (${groupParts})`;
      }
      
      const label = op.type === 'constant' ? op.value : op.label;
      if (index === 0) return label;
      const symbol = op.operator === 'multiply' ? '×' : op.operator === 'subtract' ? '-' : '+';
      return `${symbol} ${label}`;
    });
    
    return parts.join(' ');
  }, [operands]);

  if (operands.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border bg-muted/30 p-6", className)}>
        <p className="text-center text-sm text-muted-foreground">
          Your formula will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-gradient-to-br from-card to-muted/30 p-5", className)}>
      <div className="space-y-4">
        {/* Formula Label */}
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
            fx
          </span>
          <span className="text-base font-semibold text-foreground">
            {generatedLabel}
          </span>
        </div>

        {/* Visual Formula */}
        <div className="flex flex-wrap items-center gap-1 pl-8">
          {formulaElements}
          <span className="ml-3 text-lg font-medium text-muted-foreground">=</span>
          <span className="ml-2 text-lg font-bold text-primary">Result</span>
        </div>
      </div>
    </div>
  );
}
