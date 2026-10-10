/**
 * Formats a number to Thai Baht currency format (e.g. 6,000.00)
 */
export const formatCurrency = (val: number): string => {
  if (isNaN(val) || val === null || val === undefined) return '0.00';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatInteger = (val: number): string => {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('th-TH').format(val);
};

/**
 * Parses date string like "04/09/2569" or "4/9/2569" or "1-ก.ย.-69" into comparable date key
 */
export const parseThaiDateToDayIndex = (dateStr: string): number => {
  if (!dateStr) return 0;
  
  // Format: DD/MM/YYYY
  const parts = dateStr.trim().split(/[/.-]/);
  if (parts.length >= 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);
    
    // Check if month is Thai short name
    if (isNaN(month)) {
      const monthStr = parts[1];
      const thaiMonths: Record<string, number> = {
        'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4,
        'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8,
        'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
      };
      month = thaiMonths[monthStr] || 9;
    }
    
    // Year conversion (if 2569, convert to 2026; if 69, convert to 2026)
    if (year > 2500) year -= 543;
    else if (year < 100) year += 2000 - 43; // 69 - 43 = 26 -> 2026

    if (!isNaN(day) && !isNaN(month)) {
      return year * 10000 + month * 100 + day;
    }
  }
  return 0;
};

/**
 * Extracts pure day number e.g. "04/09/2569" -> 4
 */
export const getDayNumber = (dateStr: string): number => {
  const parts = dateStr.split(/[/.-]/);
  const d = parseInt(parts[0], 10);
  return isNaN(d) ? 1 : d;
};
