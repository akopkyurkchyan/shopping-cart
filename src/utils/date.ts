const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const formatDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseDateValue = (value: string): Date | null => {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const getTodayDateValue = (): string => formatDateValue(new Date());

/** Inclusive local calendar range ending today (e.g. 7 → today and the prior 6 days). */
export const getLastDaysDateRange = (
  dayCount: number,
): { fromDate: string; toDate: string } => {
  const toDate = new Date();
  const fromDate = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate() - (Math.max(1, dayCount) - 1),
  );

  return {
    fromDate: formatDateValue(fromDate),
    toDate: formatDateValue(toDate),
  };
};
