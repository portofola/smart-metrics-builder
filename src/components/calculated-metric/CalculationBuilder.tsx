import { useState, useMemo } from 'react';
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
import { Plus, Group } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CalculationBuilderProps {
  operands: Operand[];
  availableMetrics: Metric[];
  availableConstants: Constant[];
  onAddOperand: (operand: Omit<Operand, 'id'>) => void;
  onUpdateOperator: (id: string, operator: OperatorType) => void;
  onRemoveOperand: (id: string) => void;
  onReorderOperands: (activeId: string, overId: string) => void;
  onSetOperands?: (operands: Operand[]) => void;
}

export function CalculationBuilder({
  operands,
  availableMetrics,
  availableConstants,
  onAddOperand,
  onUpdateOperator,
  onRemoveOperand,
  onReorderOperands,
  onSetOperands,
}: CalculationBuilderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [utmModalOpen, setUtmModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [constantsModalOpen, setConstantsModalOpen] = useState(false);
  const [localConstants, setLocalConstants] = useState(availableConstants);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const toggleSelection = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const canGroup = selectedIds.size >= 2;

  const handleGroupSelected = () => {
    if (!onSetOperands || selectedIds.size < 2) return;

    const selectedOperands: Operand[] = [];
    const remainingOperands: Operand[] = [];
    let firstSelectedIndex = -1;

    operands.forEach((op, index) => {
      if (selectedIds.has(op.id) && op.type !== 'group') {
        if (firstSelectedIndex === -1) firstSelectedIndex = index;
        selectedOperands.push(op);
      } else {
        remainingOperands.push(op);
      }
    });

    if (selectedOperands.length < 2) return;

    // Clear operators for children except the first one in the group
    const groupChildren = selectedOperands.map((op, i) => ({
      ...op,
      operator: i === 0 ? undefined : (op.operator || 'add'),
    }));

    const groupOperand: Operand = {
      id: `group-${Date.now()}`,
      type: 'group',
      label: 'Grouped',
      children: groupChildren,
      operator: firstSelectedIndex > 0 ? 'multiply' : undefined,
    };

    // Insert group at the position of first selected operand
    const newOperands = [...remainingOperands];
    newOperands.splice(firstSelectedIndex, 0, groupOperand);

    onSetOperands(newOperands);
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleUngroup = (groupId: string) => {
    if (!onSetOperands) return;

    const groupOperand = operands.find(op => op.id === groupId);
    if (!groupOperand || groupOperand.type !== 'group' || !groupOperand.children) return;

    const groupIndex = operands.findIndex(op => op.id === groupId);
    const newOperands = [...operands];
    
    // Restore original operators to children
    const ungroupedChildren = groupOperand.children.map((child, i) => ({
      ...child,
      operator: i === 0 && groupIndex === 0 ? undefined : (child.operator || (groupIndex > 0 && i === 0 ? groupOperand.operator : 'add')),
    }));

    newOperands.splice(groupIndex, 1, ...ungroupedChildren);
    onSetOperands(newOperands);
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      setSelectedIds(new Set());
    }
    setSelectionMode(!selectionMode);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Build Your Calculation Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="nexoya-section-title">Build your calculation</h3>
              <p className="nexoya-description mt-1">
                Add operands, drag to reorder, and group for order of operations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {operands.length >= 2 && (
                <Button
                  variant={selectionMode ? "secondary" : "outline"}
                  size="sm"
                  onClick={toggleSelectionMode}
                  className="gap-1.5"
                >
                  <Group className="h-4 w-4" />
                  {selectionMode ? 'Cancel' : 'Select to group'}
                </Button>
              )}
              {selectionMode && canGroup && (
                <Button
                  size="sm"
                  onClick={handleGroupSelected}
                  className="gap-1.5"
                >
                  Group selected ({selectedIds.size})
                </Button>
              )}
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
                        selectionMode={selectionMode}
                        isSelected={selectedIds.has(operand.id)}
                        onSelectionChange={(selected) => toggleSelection(operand.id, selected)}
                        onUngroup={operand.type === 'group' ? () => handleUngroup(operand.id) : undefined}
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
