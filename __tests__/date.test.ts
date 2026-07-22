import {
  formatDateValue,
  getTodayDateValue,
  parseDateValue,
} from '../src/utils/date';

describe('date utils', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(formatDateValue(new Date(2026, 6, 22))).toBe('2026-07-22');
  });

  it('parses valid YYYY-MM-DD values in local time', () => {
    const parsed = parseDateValue('2026-07-22');

    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(6);
    expect(parsed?.getDate()).toBe(22);
  });

  it('rejects invalid calendar dates', () => {
    expect(parseDateValue('2026-02-30')).toBeNull();
    expect(parseDateValue('22-07-2026')).toBeNull();
  });

  it('returns today as YYYY-MM-DD', () => {
    expect(getTodayDateValue()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('parses stored dates to the same calendar day regardless of host timezone', () => {
    // Regression test: `new Date('2026-07-22')` parses as UTC midnight, which
    // renders as the previous calendar day in timezones behind UTC (e.g.
    // America/Los_Angeles). `parseDateValue` must always resolve to the
    // intended local calendar day instead.
    const parsed = parseDateValue('2026-07-22');

    expect(parsed).not.toBeNull();
    expect(
      new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(parsed as Date),
    ).toBe('07/22/2026');
  });
});
