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

export function FormulaPreview({ operands, className }: FormulaPreviewProps) {
  const formulaElements = useMemo(() => {
    if (operands.length === 0) return null;

    return operands.map((operand, index) => {
      const isConstant = operand.type === 'constant';
      const displayLabel = isConstant ? `[${operand.value}]` : operand.label;

      return (
        <span key={operand.id} className="inline-flex items-center gap-2">
          {index > 0 && (
            <span
              className={cn(
                "mx-1 font-semibold",
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
              "inline-flex items-center rounded px-2 py-0.5 text-sm font-medium",
              isConstant
                ? "bg-constant/10 text-constant"
                : "bg-accent text-accent-foreground"
            )}
          >
            {displayLabel}
          </span>
        </span>
      );
    });
  }, [operands]);

  if (operands.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border bg-muted/30 p-4", className)}>
        <p className="text-center text-sm text-muted-foreground">
          Your formula will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-muted/30 p-4", className)}>
      <p className="nexoya-label mb-2">Formula Preview</p>
      <div className="flex flex-wrap items-center gap-1">
        {formulaElements}
        <span className="ml-2 text-muted-foreground">=</span>
        <span className="ml-1 font-semibold text-primary">Result</span>
      </div>
    </div>
  );
}
