export const stagesByCategory: Record<string, string[]> = {
  crops: ["preparation", "land-clearing", "planting", "growing", "harvesting"],
  livestock: ["preparation", "stocking", "rearing", "ready-for-sale"],
  aquaculture: ["pond-preparation", "stocking", "growing", "harvesting"],
};

export const stageLabel = (stage: string) => stage.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

export function investmentCountdown(orderDate: string, duration: number, now = new Date()) {
  const start = new Date(orderDate);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(duration) || duration <= 0) return null;
  const dueDate = addMonths(start, duration);
  const days = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / 86400000));
  if (days === 0) return { dueDate, label: "Due date reached" };
  if (days <= 30) return { dueDate, label: `${days} day${days === 1 ? "" : "s"} remaining` };
  let months = (dueDate.getUTCFullYear() - now.getUTCFullYear()) * 12 + dueDate.getUTCMonth() - now.getUTCMonth();
  if (addMonths(now, months) < dueDate) months += 1;
  months = Math.max(1, months);
  return { dueDate, label: `${months} month${months === 1 ? "" : "s"} remaining` };
}
