export function getPastYears(count: number = 10): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => currentYear - i);
}


export function extractLastYearFromText(text: string): number | null {
    // Regular expression to match the last numeric year after the last "/"
    const regex = /\/(\d{4})\b/g;
  
    // Find all matches
    const matches = [...text.matchAll(regex)];
  
    // If there are matches, return the last one
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      return parseInt(lastMatch[1], 10); // Convert the matched string to a number
    }
  
    // Return null if no year is found
    return null;
  }

  export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
  
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }