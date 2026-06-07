import { ProduceType } from "@/lib/investment";

interface ProduceBadgeProps {
  type: ProduceType;
}

export default function ProduceBadge({ type }: ProduceBadgeProps) {
  if (type === "Animal") {
    return (
      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
        Animal
      </span>
    );
  }

  return (
    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
      Crop
    </span>
  );
}
