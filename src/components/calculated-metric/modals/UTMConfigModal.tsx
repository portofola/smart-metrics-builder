import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GA4_PROPERTIES, UTM_DIMENSIONS, METRIC_OPTIONS } from '@/data/metrics-data';

interface UTMParameter {
  id: string;
  dimension: string;
  value: string;
}

interface UTMConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: { name: string; ga4Property: string; utmParameters: UTMParameter[]; metric: string }) => void;
}

export function UTMConfigModal({
  open,
  onOpenChange,
  onSave,
}: UTMConfigModalProps) {
  const [name, setName] = useState('');
  const [ga4Property, setGa4Property] = useState('');
  const [utmParameters, setUtmParameters] = useState<UTMParameter[]>([
    { id: '1', dimension: '', value: '' },
  ]);
  const [metric, setMetric] = useState('');
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const addParameter = () => {
    if (utmParameters.length < 5) {
      setUtmParameters([
        ...utmParameters,
        { id: Date.now().toString(), dimension: '', value: '' },
      ]);
    }
  };

  const removeParameter = (id: string) => {
    if (utmParameters.length > 1) {
      setUtmParameters(utmParameters.filter((p) => p.id !== id));
    }
  };

  const updateParameter = (id: string, updates: Partial<UTMParameter>) => {
    setUtmParameters(utmParameters.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const isValid = () => {
    return name.trim() && ga4Property && metric;
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!isValid()) return;
    
    onSave({ name, ga4Property, utmParameters, metric });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setGa4Property('');
    setUtmParameters([{ id: '1', dimension: '', value: '' }]);
    setMetric('');
    setHasAttemptedSave(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create UTM tracking configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Name */}
          <div className="space-y-2">
            <Label className="nexoya-label">Configuration name</Label>
            <Input
              placeholder="e.g., Campaign Tracking DE"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* GA4 Property */}
          <div className="space-y-2">
            <Label className="nexoya-label">GA4 Property</Label>
            <Select value={ga4Property} onValueChange={setGa4Property}>
              <SelectTrigger>
                <SelectValue placeholder="Select GA4 Property..." />
              </SelectTrigger>
              <SelectContent>
                {GA4_PROPERTIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UTM Parameters */}
          <div className="space-y-4">
            <div>
              <Label className="nexoya-label">UTM Parameters</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Select up to 5 different UTM parameters. This step is optional.
              </p>
            </div>

            <div className="space-y-3">
              {utmParameters.map((param, index) => (
                <div key={param.id} className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label className="nexoya-label">Dimension</Label>
                    <Select
                      value={param.dimension}
                      onValueChange={(value) =>
                        updateParameter(param.id, { dimension: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {UTM_DIMENSIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-[2] space-y-2">
                    <Label className="nexoya-label">Parameter value {index + 1}</Label>
                    <Input
                      placeholder="Enter value"
                      value={param.value}
                      onChange={(e) =>
                        updateParameter(param.id, { value: e.target.value })
                      }
                    />
                  </div>
                  {utmParameters.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => removeParameter(param.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {utmParameters.length < 5 && (
              <button
                type="button"
                onClick={addParameter}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add new value
              </button>
            )}
          </div>

          {/* Metric Selection */}
          <div className="space-y-2">
            <Label className="nexoya-label">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {METRIC_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tip */}
          <p className="text-xs text-muted-foreground">
            Tip: UTM tracking allows you to track campaign performance from Google Analytics.
          </p>

          {/* Validation error */}
          {hasAttemptedSave && !isValid() && (
            <p className="text-sm text-destructive">
              Name, GA4 property, and metric are required.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save and add to formula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
