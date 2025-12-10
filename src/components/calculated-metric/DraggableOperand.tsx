import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Minus, Plus, X as MultiplyIcon, Ungroup } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Operand, OperatorType } from '@/types/calculated-metric';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface DraggableOperandProps {
  operand: Operand;
  index: number;
  onOperatorChange: (operator: OperatorType) => void;
  onRemove: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onUngroup?: () => void;
}

const operatorIcons = {
  add: Plus,
  subtract: Minus,
  multiply: MultiplyIcon,
};

const operatorLabels = {
  add: 'Add',
  subtract: 'Subtract',
  multiply: 'Multiply',
};

const typeLabels: Record<string, string> = {
  metric: 'Metric',
  constant: 'Constant',
  'custom-conversion': 'Conversion',
  utm: 'UTM',
  'custom-import': 'Import',
  'custom-kpi': 'KPI',
  group: 'Group',
};

export function DraggableOperand({
  operand,
  index,
  onOperatorChange,
  onRemove,
  selectionMode,
  isSelected,
  onSelectionChange,
  onUngroup,
}: DraggableOperandProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: operand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const OperatorIcon = operand.operator ? operatorIcons[operand.operator] : Plus;
  const isGroup = operand.type === 'group';

  // Render group content
  const renderGroupContent = () => {
    if (!operand.children) return null;
    
    return (
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-muted-foreground font-medium">(</span>
        {operand.children.map((child, childIndex) => {
          const childIsConstant = child.type === 'constant';
          const childLabel = childIsConstant ? `[${child.value}]` : child.label;
          
          return (
            <span key={child.id} className="inline-flex items-center gap-1">
              {childIndex > 0 && (
                <span className={cn(
                  "mx-0.5 text-xs font-bold",
                  child.operator === 'add' && "text-operator-add",
                  child.operator === 'subtract' && "text-operator-subtract",
                  child.operator === 'multiply' && "text-operator-multiply"
                )}>
                  {child.operator === 'add' ? '+' : child.operator === 'subtract' ? '−' : '×'}
                </span>
              )}
              <span className={cn(
                "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
                childIsConstant
                  ? "bg-constant/10 text-constant"
                  : "bg-muted text-foreground"
              )}>
                {childLabel}
              </span>
            </span>
          );
        })}
        <span className="text-muted-foreground font-medium">)</span>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "animate-fade-in",
        isDragging && "z-50"
      )}
    >
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-all duration-200",
          isDragging 
            ? "border-primary shadow-drag scale-[1.02] opacity-90" 
            : "border-border hover:border-primary/30 hover:shadow-nexoya-sm",
          isSelected && "border-primary bg-primary/5",
          isGroup && "border-dashed border-primary/50 bg-primary/5"
        )}
      >
        {/* Selection checkbox */}
        {selectionMode && !isGroup && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectionChange}
            className="mr-1"
          />
        )}

        {/* Drag handle */}
        <button
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
          title="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Operator selector (hidden for first operand) */}
        {index > 0 && (
          <Select
            value={operand.operator || 'add'}
            onValueChange={(value) => onOperatorChange(value as OperatorType)}
          >
            <SelectTrigger className="h-8 w-[110px] border-border bg-muted/50 text-sm font-medium">
              <SelectValue>
                <span className="flex items-center gap-1.5">
                  <OperatorIcon className="h-3.5 w-3.5" />
                  <span>{operatorLabels[operand.operator || 'add']}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">
                <span className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 text-operator-add" />
                  <span>Add</span>
                </span>
              </SelectItem>
              <SelectItem value="subtract">
                <span className="flex items-center gap-2">
                  <Minus className="h-3.5 w-3.5 text-operator-subtract" />
                  <span>Subtract</span>
                </span>
              </SelectItem>
              <SelectItem value="multiply">
                <span className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 text-operator-multiply" />
                  <span>Multiply</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Operand chip */}
        {isGroup ? (
          <div className="flex-1">
            {renderGroupContent()}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              operand.type === 'constant'
                ? "bg-constant/10 text-constant"
                : "bg-accent text-accent-foreground"
            )}
          >
            {operand.type === 'constant' && (
              <span className="flex h-5 w-5 items-center justify-center rounded bg-constant text-2xs font-bold text-constant-foreground">
                C
              </span>
            )}
            <span className="truncate">{operand.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {typeLabels[operand.type] || operand.type}
            </span>
          </div>
        )}

        {/* Ungroup button for groups */}
        {isGroup && onUngroup && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onUngroup}
          >
            <Ungroup className="h-3.5 w-3.5 mr-1" />
            Ungroup
          </Button>
        )}

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
}
