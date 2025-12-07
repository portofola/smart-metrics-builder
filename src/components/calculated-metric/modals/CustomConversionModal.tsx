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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CONVERSION_GOALS, METRIC_OPTIONS, EVENT_NAMES } from '@/data/metrics-data';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  type: 'simple' | 'event-name';
  goalName: string;
  metric: string;
  eventName?: string;
}

interface CustomConversionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: { name: string; goals: Goal[] }) => void;
}

export function CustomConversionModal({
  open,
  onOpenChange,
  onSave,
}: CustomConversionModalProps) {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', type: 'simple', goalName: '', metric: '' },
  ]);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const addGoal = () => {
    setGoals([
      ...goals,
      { id: Date.now().toString(), type: 'simple', goalName: '', metric: '' },
    ]);
  };

  const removeGoal = (id: string) => {
    if (goals.length > 1) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const isValid = () => {
    if (!name.trim()) return false;
    return goals.some((g) => {
      if (g.type === 'simple') {
        return g.goalName && g.metric;
      }
      return g.eventName && g.metric;
    });
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!isValid()) return;
    
    onSave({ name, goals });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setGoals([{ id: '1', type: 'simple', goalName: '', metric: '' }]);
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
          <DialogTitle>Create conversion configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Name */}
          <div className="space-y-2">
            <Label className="nexoya-label">Configuration name</Label>
            <Input
              placeholder="e.g., Purchase Conversions"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <Label className="nexoya-label">Conversion goals</Label>
            
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="rounded-lg border border-border p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Goal {index + 1}
                    </span>
                    {goals.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>

                  <RadioGroup
                    value={goal.type}
                    onValueChange={(value) =>
                      updateGoal(goal.id, { type: value as 'simple' | 'event-name' })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id={`simple-${goal.id}`} />
                      <Label htmlFor={`simple-${goal.id}`} className="text-sm font-normal cursor-pointer">
                        Simple
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="event-name" id={`event-${goal.id}`} />
                      <Label htmlFor={`event-${goal.id}`} className="text-sm font-normal cursor-pointer">
                        Event name
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className={cn(
                    "grid gap-4",
                    goal.type === 'event-name' ? "grid-cols-2" : "grid-cols-2"
                  )}>
                    {goal.type === 'simple' ? (
                      <>
                        <div className="space-y-2">
                          <Label className="nexoya-label">Conversion goal</Label>
                          <Select
                            value={goal.goalName}
                            onValueChange={(value) =>
                              updateGoal(goal.id, { goalName: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a goal" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONVERSION_GOALS.map((g) => (
                                <SelectItem key={g.id} value={g.name}>
                                  {g.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="nexoya-label">Metric</Label>
                          <Select
                            value={goal.metric}
                            onValueChange={(value) =>
                              updateGoal(goal.id, { metric: value })
                            }
                          >
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
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="nexoya-label">Event name</Label>
                          <Select
                            value={goal.eventName || ''}
                            onValueChange={(value) =>
                              updateGoal(goal.id, { eventName: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_NAMES.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="nexoya-label">Metric</Label>
                          <Select
                            value={goal.metric}
                            onValueChange={(value) =>
                              updateGoal(goal.id, { metric: value })
                            }
                          >
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addGoal}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add goal
            </button>
          </div>

          {/* Tip */}
          <p className="text-xs text-muted-foreground">
            Tip: You can add multiple goals to create a sum of conversions.
          </p>

          {/* Validation error */}
          {hasAttemptedSave && !isValid() && (
            <p className="text-sm text-destructive">
              Name and at least one complete goal are required.
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
