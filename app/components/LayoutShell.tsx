interface LayoutShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function LayoutShell({ children, className = "" }: LayoutShellProps) {
  return (
    <main className={`flex-1 container mx-auto px-6 max-w-6xl py-12 ${className}`}>
      {children}
    </main>
  );
}
