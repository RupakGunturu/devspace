import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  descriptions: string[];
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  descriptions,
  confirmLabel,
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`font-display text-lg font-extrabold ${danger ? "text-coral" : "text-foreground"}`}
          >
            {danger ? "⚠ " : ""}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            {descriptions.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel className="mt-0 sm:mt-0">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={danger ? "bg-coral text-ink hover:bg-coral/80" : undefined}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
