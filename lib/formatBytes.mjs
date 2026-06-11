const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

function normalizeDecimals(decimals) {
  if (!Number.isFinite(decimals)) {
    return 1;
  }

  return Math.min(100, Math.max(0, Math.trunc(decimals)));
}

function trimTrailingZeroes(value) {
  return value.replace(/\.?0+$/, '');
}

export function formatBytes(bytes, decimals = 1) {
  if (!Number.isFinite(bytes)) {
    return 'NaN';
  }

  const absoluteBytes = Math.abs(bytes);

  if (absoluteBytes === 0) {
    return '0 B';
  }

  let value = absoluteBytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const sign = bytes < 0 ? '-' : '';
  const digits = normalizeDecimals(decimals);
  const formattedValue = trimTrailingZeroes(value.toFixed(digits));

  return `${sign}${formattedValue} ${UNITS[unitIndex]}`;
}
