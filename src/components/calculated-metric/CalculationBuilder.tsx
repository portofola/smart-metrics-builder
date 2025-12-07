import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Operand, OperatorType, Metric, Constant } from '@/types/calculated-metric';
import { DraggableOperand } from './DraggableOperand';
import { OperandSelector } from './OperandSelector';
import { FormulaPreview } from './FormulaPreview';
import { CustomConversionModal } from './modals/CustomConversionModal';
import { UTMConfigModal } from './modals/UTMConfigModal';
import { CustomImportModal } from './modals/CustomImportModal';
import { CustomKPIModal } from './modals/CustomKPIModal';
import { ManageConstantsModal } from './modals/ManageConstantsModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CalculationBuilderProps {
  operands: Operand[];
  metricName: string;
  availableMetrics: Metric[];
  availableConstants: Constant[];
  onMetricNameChange: (name: string) => void;
  onAddOperand: (operand: Omit<Operand, 'id'>) => void;
  onUpdateOperator: (id: string, operator: OperatorType) => void;
  onRemoveOperand: (id: string) => void;
  onReorderOperands: (activeId: string, overId: string) => void;
}

export function CalculationBuilder({
  operands,
  metricName,
  availableMetrics,
  availableConstants,
  onMetricNameChange,
  onAddOperand,
  onUpdateOperator,
  onRemoveOperand,
  onReorderOperands,
}: CalculationBuilderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [utmModalOpen, setUtmModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [constantsModalOpen, setConstantsModalOpen] = useState(false);
  const [localConstants, setLocalConstants] = useState(availableConstants);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderOperands(active.id as string, over.id as string);
    }
  };

  const handleSelectMetric = (metric: Metric) => {
    onAddOperand({
      type: 'metric',
      label: metric.name,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSelectConstant = (constant: Constant) => {
    onAddOperand({
      type: 'constant',
      label: constant.name,
      value: constant.value,
      operator: operands.length > 0 ? 'multiply' : undefined,
    });
  };

  const handleSelectCustomConversion = (config: { id: string; name: string }) => {
    onAddOperand({
      type: 'custom-conversion',
      label: config.name,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSelectUTM = (config: { id: string; name: string }) => {
    onAddOperand({
      type: 'utm',
      label: config.name,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSelectCustomImport = (config: { id: string; title: string }) => {
    onAddOperand({
      type: 'custom-import',
      label: config.title,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSelectCustomKPI = (config: { id: string; title: string }) => {
    onAddOperand({
      type: 'custom-kpi',
      label: config.title,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSaveCustomConversion = (config: { name: string; goals: any[] }) => {
    onAddOperand({
      type: 'custom-conversion',
      label: config.name,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSaveUTM = (config: { name: string }) => {
    onAddOperand({
      type: 'utm',
      label: config.name,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSaveCustomImport = (config: { title: string }) => {
    onAddOperand({
      type: 'custom-import',
      label: config.title,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleSaveCustomKPI = (config: { title: string }) => {
    onAddOperand({
      type: 'custom-kpi',
      label: config.title,
      operator: operands.length > 0 ? 'add' : undefined,
    });
  };

  const handleAddConstant = (constant: Constant) => {
    setLocalConstants([...localConstants, constant]);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Metric Name Input */}
        <div className="space-y-2">
          <Label htmlFor="metric-name" className="nexoya-label">
            Calculated metric name
          </Label>
          <Input
            id="metric-name"
            placeholder="e.g., Net Revenue, Qualified Leads, Adjusted Conversions"
            value={metricName}
            onChange={(e) => onMetricNameChange(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Build Your Calculation Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="nexoya-section-title">Build your calculation</h3>
              <p className="nexoya-description mt-1">
                Add operands and drag to reorder.
              </p>
            </div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add operand
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4" align="end">
                <OperandSelector
                  metrics={availableMetrics}
                  constants={localConstants}
                  onSelectMetric={handleSelectMetric}
                  onSelectConstant={handleSelectConstant}
                  onSelectCustomConversion={handleSelectCustomConversion}
                  onSelectUTM={handleSelectUTM}
                  onSelectCustomImport={handleSelectCustomImport}
                  onSelectCustomKPI={handleSelectCustomKPI}
                  onCreateCustomConversion={() => setConversionModalOpen(true)}
                  onCreateUTM={() => setUtmModalOpen(true)}
                  onCreateCustomImport={() => setImportModalOpen(true)}
                  onCreateCustomKPI={() => setKpiModalOpen(true)}
                  onManageConstants={() => setConstantsModalOpen(true)}
                  onClose={() => setPopoverOpen(false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Operands List */}
          <div
            className={cn(
              "min-h-[120px] rounded-lg border p-4",
              operands.length === 0
                ? "border-dashed border-border bg-muted/20"
                : "border-border bg-background"
            )}
          >
            {operands.length === 0 ? (
              <div className="flex h-full min-h-[80px] flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No operands added yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click "Add operand" to start building your calculation
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={operands.map((op) => op.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {operands.map((operand, index) => (
                      <DraggableOperand
                        key={operand.id}
                        operand={operand}
                        index={index}
                        onOperatorChange={(operator) =>
                          onUpdateOperator(operand.id, operator)
                        }
                        onRemove={() => onRemoveOperand(operand.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Formula Preview */}
        <FormulaPreview operands={operands} />
      </div>

      {/* Modals */}
      <CustomConversionModal
        open={conversionModalOpen}
        onOpenChange={setConversionModalOpen}
        onSave={handleSaveCustomConversion}
      />
      <UTMConfigModal
        open={utmModalOpen}
        onOpenChange={setUtmModalOpen}
        onSave={handleSaveUTM}
      />
      <CustomImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onSave={handleSaveCustomImport}
      />
      <CustomKPIModal
        open={kpiModalOpen}
        onOpenChange={setKpiModalOpen}
        onSave={handleSaveCustomKPI}
      />
      <ManageConstantsModal
        open={constantsModalOpen}
        onOpenChange={setConstantsModalOpen}
        constants={localConstants}
        onSave={setLocalConstants}
        onAddConstant={handleAddConstant}
      />
    </>
  );
}
