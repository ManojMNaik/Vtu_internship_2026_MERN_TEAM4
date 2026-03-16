import { cn, getStatusColor } from "../../lib/utils";

export default function Badge({ status, children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        getStatusColor(status),
        className
      )}
    >
      {children || status}
    </span>
  );
}
