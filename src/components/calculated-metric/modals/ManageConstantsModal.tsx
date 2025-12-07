import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Constant } from '@/types/calculated-metric';

const LOCATIONS = ['Global', 'Germany', 'Switzerland', 'Austria', 'France', 'UK', 'USA'];

interface ManageConstantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  constants: Constant[];
  onSave: (constants: Constant[]) => void;
  onAddConstant: (constant: Constant) => void;
}

export function ManageConstantsModal({
  open,
  onOpenChange,
  constants,
  onSave,
  onAddConstant,
}: ManageConstantsModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newConstant, setNewConstant] = useState({
    name: '',
    value: '',
    unit: '%',
    timeSeries: false,
    location: 'Global',
    periods: 1,
  });
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const isValidNew = () => {
    return newConstant.name.trim() && newConstant.value !== '';
  };

  const handleAddConstant = () => {
    setHasAttemptedSave(true);
    if (!isValidNew()) return;

    const constant: Constant = {
      id: `const-${Date.now()}`,
      name: newConstant.name,
      value: parseFloat(newConstant.value),
      unit: newConstant.unit,
      timeSeries: newConstant.timeSeries,
      location: newConstant.location !== 'Global' ? newConstant.location : undefined,
      periods: newConstant.timeSeries ? newConstant.periods : undefined,
    };

    onAddConstant(constant);
    resetNewConstant();
  };

  const resetNewConstant = () => {
    setNewConstant({
      name: '',
      value: '',
      unit: '%',
      timeSeries: false,
      location: 'Global',
      periods: 1,
    });
    setIsAddingNew(false);
    setHasAttemptedSave(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetNewConstant();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage constants</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Constants List */}
          <div className="space-y-3">
            <Label className="nexoya-label">Existing constants</Label>
            
            {constants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No constants defined yet
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {constants.map((constant) => (
                  <div
                    key={constant.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {constant.name}
                        </span>
                        {constant.location && (
                          <span className="text-xs text-muted-foreground">
                            ({constant.location})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {constant.timeSeries ? (
                          <span>
                            Time-varying · {constant.periods || 1} period{(constant.periods || 1) > 1 ? 's' : ''} · current: {constant.value}{constant.unit}
                          </span>
                        ) : (
                          <span>Static value: {constant.value}{constant.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Section */}
          {isAddingNew ? (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">New constant</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetNewConstant}
                >
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="nexoya-label">Name</Label>
                  <Input
                    placeholder="e.g., VAT Rate"
                    value={newConstant.name}
                    onChange={(e) =>
                      setNewConstant({ ...newConstant, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="nexoya-label">Value</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g., 19"
                    value={newConstant.value}
                    onChange={(e) =>
                      setNewConstant({ ...newConstant, value: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="nexoya-label">Unit</Label>
                  <Select
                    value={newConstant.unit}
                    onValueChange={(value) =>
                      setNewConstant({ ...newConstant, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="x">x (multiplier)</SelectItem>
                      <SelectItem value="">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="nexoya-label">Location</Label>
                  <Select
                    value={newConstant.location}
                    onValueChange={(value) =>
                      setNewConstant({ ...newConstant, location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Time-varying</Label>
                  <p className="text-xs text-muted-foreground">
                    Value changes over time
                  </p>
                </div>
                <Switch
                  checked={newConstant.timeSeries}
                  onCheckedChange={(checked) =>
                    setNewConstant({ ...newConstant, timeSeries: checked })
                  }
                />
              </div>

              {newConstant.timeSeries && (
                <div className="space-y-2">
                  <Label className="nexoya-label">Number of periods</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newConstant.periods}
                    onChange={(e) =>
                      setNewConstant({
                        ...newConstant,
                        periods: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              )}

              {hasAttemptedSave && !isValidNew() && (
                <p className="text-sm text-destructive">
                  Name and value are required.
                </p>
              )}

              <Button onClick={handleAddConstant} className="w-full">
                Add constant
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add new constant
            </button>
          )}

          {/* Tip */}
          <p className="text-xs text-muted-foreground">
            Tip: Use location-specific constants for country-based calculations like VAT rates.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
