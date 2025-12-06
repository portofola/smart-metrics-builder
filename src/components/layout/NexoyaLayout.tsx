import { ReactNode } from 'react';
import { NexoyaSidebar } from './NexoyaSidebar';

interface NexoyaLayoutProps {
  children: ReactNode;
}

export function NexoyaLayout({ children }: NexoyaLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <NexoyaSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
