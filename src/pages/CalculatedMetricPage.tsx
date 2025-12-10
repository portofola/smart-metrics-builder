import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { NexoyaLayout } from '@/components/layout/NexoyaLayout';
import { FunnelVisualization } from '@/components/calculated-metric/FunnelVisualization';
import { MappingTypeSelector } from '@/components/calculated-metric/MappingTypeSelector';
import { CalculationBuilder } from '@/components/calculated-metric/CalculationBuilder';
import { useCalculatedMetric } from '@/hooks/use-calculated-metric';
import { MappingType, FunnelStep } from '@/types/calculated-metric';
import { FUNNEL_STEPS, AVAILABLE_METRICS, AVAILABLE_CONSTANTS } from '@/data/metrics-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export default function CalculatedMetricPage() {
  const [selectedStepId, setSelectedStepId] = useState<string>('cost');
  const [mappingType, setMappingType] = useState<MappingType>('calculated-metric');
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>(FUNNEL_STEPS);

  const {
    operands,
    setOperands,
    addOperand,
    updateOperator,
    removeOperand,
    reorderOperands,
    getFormulaPreview,
    isValid,
    reset,
  } = useCalculatedMetric();

  const selectedStep = funnelSteps.find((s) => s.id === selectedStepId);

  const handleSaveProgress = () => {
    if (mappingType === 'calculated-metric' && !isValid()) {
      toast({
        title: 'Incomplete configuration',
        description: 'Please add at least 2 operands to your calculation.',
        variant: 'destructive',
      });
      return;
    }

    // Generate label from formula
    const formulaLabel = getFormulaPreview();

    // Update funnel step with calculated metric
    if (mappingType === 'calculated-metric') {
      setFunnelSteps((prev) =>
        prev.map((step) =>
          step.id === selectedStepId
            ? {
                ...step,
                isAssigned: true,
                assignmentType: 'Calculated metric',
                value: formulaLabel,
              }
            : step
        )
      );
    }

    toast({
      title: 'Progress saved',
      description: 'Your metric mapping has been saved successfully.',
    });
  };

  const handleNextStep = () => {
    const currentIndex = funnelSteps.findIndex((s) => s.id === selectedStepId);
    if (currentIndex < funnelSteps.length - 1) {
      setSelectedStepId(funnelSteps[currentIndex + 1].id);
      reset();
      setMappingType('assign-metric');
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = funnelSteps.findIndex((s) => s.id === selectedStepId);
    if (currentIndex > 0) {
      setSelectedStepId(funnelSteps[currentIndex - 1].id);
      reset();
      setMappingType('assign-metric');
    }
  };

  return (
    <NexoyaLayout>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h1 className="text-xl font-medium text-foreground">
            Assign metrics to funnel steps for Google Ads
          </h1>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Funnel Steps */}
          <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-border p-6">
            <p className="nexoya-description mb-6">
              Configure the metric mappings for each funnel step.
            </p>
            <FunnelVisualization
              steps={funnelSteps}
              selectedStepId={selectedStepId}
              onSelectStep={setSelectedStepId}
            />
          </div>

          {/* Right Panel - Mapping Configuration */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-foreground">
                  Configure {selectedStep?.name}
                </h2>
                <p className="nexoya-description mt-1">
                  Select a mapping type and configure the metric assignment.
                </p>
              </div>

              <MappingTypeSelector
                selectedType={mappingType}
                onSelectType={setMappingType}
              />

              {mappingType === 'calculated-metric' && (
                <>
                  <Separator className="my-6" />
                  <CalculationBuilder
                    operands={operands}
                    availableMetrics={AVAILABLE_METRICS}
                    availableConstants={AVAILABLE_CONSTANTS}
                    onAddOperand={addOperand}
                    onUpdateOperator={updateOperator}
                    onRemoveOperand={removeOperand}
                    onReorderOperands={reorderOperands}
                    onSetOperands={setOperands}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="outline"
            onClick={handleSaveProgress}
            className="text-muted-foreground"
          >
            Save progress and apply
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handlePreviousStep}
              disabled={funnelSteps.findIndex((s) => s.id === selectedStepId) === 0}
              className="gap-1.5 text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous step
            </Button>
            <Button onClick={handleNextStep} className="gap-1.5">
              Next funnel step
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>
    </NexoyaLayout>
  );
}
