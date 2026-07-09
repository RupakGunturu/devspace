export function ToolLayout({ id, children }: { id?: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}
