import { useState } from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Metric, Constant, OperandTabType } from '@/types/calculated-metric';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  SAVED_CUSTOM_CONVERSIONS, 
  SAVED_UTM_CONFIGS, 
  SAVED_CUSTOM_IMPORTS,
  SAVED_CUSTOM_KPIS,
} from '@/data/metrics-data';

interface OperandSelectorProps {
  metrics: Metric[];
  constants: Constant[];
  onSelectMetric: (metric: Metric) => void;
  onSelectConstant: (constant: Constant) => void;
  onSelectCustomConversion: (config: { id: string; name: string }) => void;
  onSelectUTM: (config: { id: string; name: string }) => void;
  onSelectCustomImport: (config: { id: string; title: string }) => void;
  onSelectCustomKPI: (config: { id: string; title: string }) => void;
  onCreateCustomConversion: () => void;
  onCreateUTM: () => void;
  onCreateCustomImport: () => void;
  onCreateCustomKPI: () => void;
  onManageConstants: () => void;
  onEditConfig?: (type: OperandTabType, config: any) => void;
  onClose?: () => void;
}

export function OperandSelector({
  metrics,
  constants,
  onSelectMetric,
  onSelectConstant,
  onSelectCustomConversion,
  onSelectUTM,
  onSelectCustomImport,
  onSelectCustomKPI,
  onCreateCustomConversion,
  onCreateUTM,
  onCreateCustomImport,
  onCreateCustomKPI,
  onManageConstants,
  onEditConfig,
  onClose,
}: OperandSelectorProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<OperandTabType>('metric');

  const filteredMetrics = metrics.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredConstants = constants.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    const category = metric.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, Metric[]>);

  const handleSelectAndClose = (action: () => void) => {
    action();
    onClose?.();
  };

  // Only show search for Metrics and Constants tabs
  const showSearch = activeTab === 'metric' || activeTab === 'constants';

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as OperandTabType);
        setSearch(''); // Reset search when changing tabs
      }}>
        <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
          <TabsTrigger value="metric" className="text-xs px-2 py-2">
            Metric
          </TabsTrigger>
          <TabsTrigger value="custom-conversions" className="text-xs px-2 py-2">
            Conversions
          </TabsTrigger>
          <TabsTrigger value="utm" className="text-xs px-2 py-2">
            UTM
          </TabsTrigger>
        </TabsList>
        <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1 mt-1">
          <TabsTrigger value="custom-import" className="text-xs px-2 py-2">
            Import
          </TabsTrigger>
          <TabsTrigger value="custom-kpi" className="text-xs px-2 py-2">
            Custom KPI
          </TabsTrigger>
          <TabsTrigger value="constants" className="text-xs px-2 py-2">
            Constants
          </TabsTrigger>
        </TabsList>

        {/* Conditional Search - Only for Metrics and Constants */}
        {showSearch && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Metric Tab */}
        <TabsContent value="metric" className="mt-3">
          <ScrollArea className="h-[220px]">
            <div className="space-y-3 pr-2">
              {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
                <div key={category}>
                  <h4 className="nexoya-label mb-2">{category}</h4>
                  <div className="space-y-1">
                    {categoryMetrics.map((metric) => (
                      <button
                        key={metric.id}
                        onClick={() => handleSelectAndClose(() => onSelectMetric(metric))}
                        className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      >
                        <span className="font-medium text-foreground">{metric.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {filteredMetrics.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No metrics found
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Custom Conversions Tab */}
        <TabsContent value="custom-conversions" className="mt-3">
          <ScrollArea className="h-[260px]">
            <div className="space-y-2 pr-2">
              {SAVED_CUSTOM_CONVERSIONS.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent transition-colors group"
                >
                  <button
                    onClick={() => handleSelectAndClose(() => onSelectCustomConversion(config))}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium text-foreground text-sm">{config.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{config.goals.length} goals</span>
                  </button>
                  <button
                    onClick={() => onEditConfig?.('custom-conversions', config)}
                    className="p-1.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit configuration"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary/80 hover:bg-accent"
                onClick={() => {
                  onClose?.();
                  onCreateCustomConversion();
                }}
              >
                <Plus className="h-4 w-4" />
                Create new configuration
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* UTM Tab */}
        <TabsContent value="utm" className="mt-3">
          <ScrollArea className="h-[260px]">
            <div className="space-y-2 pr-2">
              {SAVED_UTM_CONFIGS.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent transition-colors group"
                >
                  <button
                    onClick={() => handleSelectAndClose(() => onSelectUTM(config))}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium text-foreground text-sm">{config.name}</span>
                  </button>
                  <button
                    onClick={() => onEditConfig?.('utm', config)}
                    className="p-1.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit configuration"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary/80 hover:bg-accent"
                onClick={() => {
                  onClose?.();
                  onCreateUTM();
                }}
              >
                <Plus className="h-4 w-4" />
                Create new configuration
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Custom Import Tab */}
        <TabsContent value="custom-import" className="mt-3">
          <ScrollArea className="h-[260px]">
            <div className="space-y-2 pr-2">
              {SAVED_CUSTOM_IMPORTS.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent transition-colors group"
                >
                  <button
                    onClick={() => handleSelectAndClose(() => onSelectCustomImport(config))}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium text-foreground text-sm">{config.title}</span>
                  </button>
                  <button
                    onClick={() => onEditConfig?.('custom-import', config)}
                    className="p-1.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit configuration"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary/80 hover:bg-accent"
                onClick={() => {
                  onClose?.();
                  onCreateCustomImport();
                }}
              >
                <Plus className="h-4 w-4" />
                Create new configuration
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Custom KPI Tab */}
        <TabsContent value="custom-kpi" className="mt-3">
          <ScrollArea className="h-[260px]">
            <div className="space-y-2 pr-2">
              {SAVED_CUSTOM_KPIS.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent transition-colors group"
                >
                  <button
                    onClick={() => handleSelectAndClose(() => onSelectCustomKPI(config))}
                    className="flex-1 text-left"
                  >
                    <span className="font-medium text-foreground text-sm">{config.title}</span>
                  </button>
                  <button
                    onClick={() => onEditConfig?.('custom-kpi', config)}
                    className="p-1.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit configuration"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary/80 hover:bg-accent"
                onClick={() => {
                  onClose?.();
                  onCreateCustomKPI();
                }}
              >
                <Plus className="h-4 w-4" />
                Create new configuration
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Constants Tab */}
        <TabsContent value="constants" className="mt-3">
          <ScrollArea className="h-[220px]">
            <div className="space-y-2 pr-2">
              {filteredConstants.map((constant) => (
                <button
                  key={constant.id}
                  onClick={() => handleSelectAndClose(() => onSelectConstant(constant))}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-constant text-2xs font-bold text-constant-foreground">
                      C
                    </span>
                    <span className="font-medium text-foreground">{constant.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {constant.timeSeries ? (
                        <span>Time-varying · {constant.periods || 1} period{(constant.periods || 1) > 1 ? 's' : ''} · current: {constant.value}{constant.unit}</span>
                      ) : (
                        <span>Static: {constant.value}{constant.unit}</span>
                      )}
                    </span>
                  </div>
                </button>
              ))}
              {filteredConstants.length === 0 && search && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No constants found
                </p>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary/80 hover:bg-accent"
                onClick={() => {
                  onClose?.();
                  onManageConstants();
                }}
              >
                <Settings className="h-4 w-4" />
                Manage constants
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
