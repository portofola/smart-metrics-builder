import { cn } from '@/lib/utils';
import { FunnelStep as FunnelStepType } from '@/types/calculated-metric';
import { CheckCircle2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FunnelStepProps {
  step: FunnelStepType;
  isSelected: boolean;
  onClick: () => void;
}

export function FunnelStep({ step, isSelected, onClick }: FunnelStepProps) {
  const showInfoIcon = step.id === 'cost';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-md border-l-4 bg-card px-4 py-3 text-left transition-all",
        isSelected
          ? "border-l-primary bg-accent/30 shadow-nexoya-sm"
          : "border-l-transparent hover:border-l-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{step.name}</span>
          {showInfoIcon && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>COST is a required funnel step for tracking ad spend</p>
              </TooltipContent>
            </Tooltip>
          )}
          {step.isAssigned && (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          )}
        </div>
        {step.isAssigned ? (
          <div className="mt-1">
            <p className="truncate text-sm text-foreground">{step.value}</p>
            <p className="text-xs text-muted-foreground">Type: {step.assignmentType}</p>
          </div>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">No assignment yet</p>
        )}
      </div>
    </button>
  );
}

interface FunnelVisualizationProps {
  steps: FunnelStepType[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
}

export function FunnelVisualization({
  steps,
  selectedStepId,
  onSelectStep,
}: FunnelVisualizationProps) {
  return (
    <div className="flex gap-6">
      {/* Step list */}
      <div className="flex-1 space-y-1">
        {steps.map((step) => (
          <FunnelStep
            key={step.id}
            step={step}
            isSelected={selectedStepId === step.id}
            onClick={() => onSelectStep(step.id)}
          />
        ))}
      </div>

      {/* Funnel graphic */}
      <div className="relative flex w-[140px] flex-shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 120 220"
          className="h-full w-full max-h-[320px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(199, 89%, 60%)" />
              <stop offset="100%" stopColor="hsl(199, 89%, 75%)" />
            </linearGradient>
          </defs>
          {/* Funnel shape - trapezoid segments */}
          <path
            d="M 10 0 L 110 0 L 100 35 L 20 35 Z"
            fill="url(#funnelGradient)"
            opacity="0.95"
          />
          <path
            d="M 20 38 L 100 38 L 90 73 L 30 73 Z"
            fill="url(#funnelGradient)"
            opacity="0.85"
          />
          <path
            d="M 30 76 L 90 76 L 80 111 L 40 111 Z"
            fill="url(#funnelGradient)"
            opacity="0.75"
          />
          <path
            d="M 40 114 L 80 114 L 72 149 L 48 149 Z"
            fill="url(#funnelGradient)"
            opacity="0.65"
          />
          <path
            d="M 48 152 L 72 152 L 66 187 L 54 187 Z"
            fill="url(#funnelGradient)"
            opacity="0.55"
          />
          <path
            d="M 54 190 L 66 190 L 62 220 L 58 220 Z"
            fill="url(#funnelGradient)"
            opacity="0.45"
          />
        </svg>
      </div>
    </div>
  );
}
