import { useState } from 'react';
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
import { CUSTOM_KPI_METRICS } from '@/data/metrics-data';

interface CustomKPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: { title: string; metric: string }) => void;
}

export function CustomKPIModal({
  open,
  onOpenChange,
  onSave,
}: CustomKPIModalProps) {
  const [title, setTitle] = useState('');
  const [metric, setMetric] = useState('');
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const isValid = () => {
    return title.trim() && metric;
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!isValid()) return;
    
    onSave({ title, metric });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create custom KPI configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="nexoya-label">Collection title matching</Label>
            <Input
              placeholder="Enter title (use {} to insert variables)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Metric */}
          <div className="space-y-2">
            <Label className="nexoya-label">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOM_KPI_METRICS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tip */}
          <p className="text-xs text-muted-foreground">
            Tip: Custom KPIs allow you to track business-specific metrics.
          </p>

          {/* Validation error */}
          {hasAttemptedSave && !isValid() && (
            <p className="text-sm text-destructive">
              Title and metric are required.
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
