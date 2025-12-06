import { MappingType } from '@/types/calculated-metric';
import { cn } from '@/lib/utils';

interface MappingTypeSelectorProps {
  selectedType: MappingType;
  onSelectType: (type: MappingType) => void;
}

const mappingTypes: { value: MappingType; label: string; badge?: string; icon?: string }[] = [
  { value: 'assign-metric', label: 'Assign metric' },
  { value: 'custom-conversions', label: 'Custom conversions' },
  { value: 'utm-tracking', label: 'UTM tracking' },
  { value: 'custom-import', label: 'Custom import' },
  { value: 'custom-metric', label: 'Custom metric', badge: '🎲' },
  { value: 'calculated-metric', label: 'Calculated metric', icon: 'calc' },
  { value: 'ignore-mapping', label: 'Ignore mapping' },
];

export function MappingTypeSelector({
  selectedType,
  onSelectType,
}: MappingTypeSelectorProps) {
  return (
    <div className="space-y-3">
      {mappingTypes.map((type) => (
        <label
          key={type.value}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors",
            selectedType === type.value
              ? "bg-accent"
              : "hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              selectedType === type.value
                ? "border-primary bg-primary"
                : "border-border"
            )}
          >
            {selectedType === type.value && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            )}
          </div>
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              selectedType === type.value ? "font-medium text-foreground" : "text-foreground"
            )}
          >
            {type.icon === 'calc' && (
              <span className="flex h-4 w-4 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                fx
              </span>
            )}
            {type.label}
            {type.badge && <span>{type.badge}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}
