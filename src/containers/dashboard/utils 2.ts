export const clampPercent = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
};

export const parseNumeric = (value: string | number | undefined) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace(/,/g, '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(parsed)) return 0;
  return parsed;
};

export const toResourceRatioPercent = (used: string | number | undefined, limit: string | number | undefined) => {
  const usedValue = parseNumeric(used);
  const limitValue = parseNumeric(limit);
  if (limitValue <= 0) return 0;
  return clampPercent((usedValue / limitValue) * 100);
};

export const average = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((acc, curr) => acc + curr, 0);
  return total / numbers.length;
};
