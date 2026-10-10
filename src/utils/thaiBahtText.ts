/**
 * Converts numeric Thai Baht amount into Thai written words
 * e.g. 1500.50 -> หนึ่งพันห้าร้อยบาทห้าสิบสตางค์
 */
export function thaiBahtText(num: number): string {
  if (isNaN(num) || num === null || num === undefined || num === 0) return 'ศูนย์บาทถ้วน';

  const digits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  const convertGroup = (nStr: string): string => {
    let result = '';
    const len = nStr.length;
    for (let i = 0; i < len; i++) {
      const d = parseInt(nStr[i], 10);
      const pos = len - i - 1;
      if (d !== 0) {
        if (pos === 0 && d === 1 && len > 1 && nStr[len - 2] !== '0') {
          result += 'เอ็ด';
        } else if (pos === 1 && d === 1) {
          result += 'สิบ';
        } else if (pos === 1 && d === 2) {
          result += 'ยี่สิบ';
        } else {
          result += digits[d] + units[pos];
        }
      }
    }
    return result;
  };

  const fixed = Math.abs(num).toFixed(2);
  const [bahtStr, satangStr] = fixed.split('.');

  let bahtText = '';
  if (parseInt(bahtStr, 10) === 0) {
    bahtText = 'ศูนย์บาท';
  } else {
    // Process groups of 6 digits (ล้าน)
    let b = bahtStr;
    const parts: string[] = [];
    while (b.length > 6) {
      parts.unshift(b.slice(-6));
      b = b.slice(0, -6);
    }
    parts.unshift(b);

    for (let i = 0; i < parts.length; i++) {
      bahtText += convertGroup(parts[i]);
      if (i < parts.length - 1) bahtText += 'ล้าน';
    }
    bahtText += 'บาท';
  }

  const satangVal = parseInt(satangStr, 10);
  if (satangVal === 0) {
    bahtText += 'ถ้วน';
  } else {
    let satangText = '';
    const d1 = parseInt(satangStr[0], 10);
    const d2 = parseInt(satangStr[1], 10);

    if (d1 === 1) satangText += 'สิบ';
    else if (d1 === 2) satangText += 'ยี่สิบ';
    else if (d1 > 2) satangText += digits[d1] + 'สิบ';

    if (d2 === 1 && d1 > 0) satangText += 'เอ็ด';
    else if (d2 > 0) satangText += digits[d2];

    bahtText += satangText + 'สตางค์';
  }

  return (num < 0 ? 'ลบ' : '') + bahtText;
}
