import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Metric, Constant } from '@/types/calculated-metric';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OperandSelectorProps {
  metrics: Metric[];
  constants: Constant[];
  onSelectMetric: (metric: Metric) => void;
  onSelectConstant: (constant: Constant) => void;
}

export function OperandSelector({
  metrics,
  constants,
  onSelectMetric,
  onSelectConstant,
}: OperandSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('metrics');

  const filteredMetrics = metrics.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.source.toLowerCase().includes(search.toLowerCase())
  );

  const filteredConstants = constants.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group metrics by category
  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    const category = metric.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  return (
    <div className="space-y-4">
      <h3 className="nexoya-section-title">Add operand</h3>
      <p className="nexoya-description">
        Select a metric or constant to add to your calculation.
      </p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search metrics or constants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="metrics" className="flex-1">
            Metrics
          </TabsTrigger>
          <TabsTrigger value="constants" className="flex-1">
            Constants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-4">
          <ScrollArea className="h-[280px]">
            <div className="space-y-4 pr-4">
              {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
                <div key={category}>
                  <h4 className="nexoya-label mb-2">{category}</h4>
                  <div className="space-y-1">
                    {categoryMetrics.map((metric) => (
                      <button
                        key={metric.id}
                        onClick={() => onSelectMetric(metric)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-xs text-muted-foreground">{metric.source}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {filteredMetrics.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No metrics found matching "{search}"
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="constants" className="mt-4">
          <ScrollArea className="h-[280px]">
            <div className="space-y-1 pr-4">
              {filteredConstants.map((constant) => (
                <button
                  key={constant.id}
                  onClick={() => onSelectConstant(constant)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                    "hover:bg-constant/10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-constant text-2xs font-bold text-constant-foreground">
                      C
                    </span>
                    <span className="font-medium">{constant.name}</span>
                    {constant.timeSeries && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground">
                        Time-varying
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {constant.value}{constant.unit}
                  </span>
                </button>
              ))}
              {filteredConstants.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No constants found matching "{search}"
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
