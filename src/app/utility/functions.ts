import { jwtDecode } from "jwt-decode";

export function toYYYYMMDD(value: any): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date value: " + value);
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }


  export function getEmail(){
    const raw = sessionStorage.getItem('key');
    if (!raw) return;

    try {
      const { alias } = jwtDecode<{ alias?: string }>(raw);
      if(alias !==undefined){
        
        return alias || '';

      }else{
        const { email } = jwtDecode<{ email?: string }>(raw);
        return email || '';
      }
     
    } catch {
     return '';
    }
  }

  export function parseURN(
    uri: string,
    evt?: any,
  ): {
    type: "GTIN" | "SSCC" | "GLN";
    element: string;
    text: string;
    gtin?: string;
    serial?: string;
    sscc?: string;
    gln?: string;
    extension?: string;
  } | null {
    const FNC1 = "\u001D";
  
    /* ---------- GTIN (SGTIN) ---------- */
    if (uri.startsWith("urn:epc:id:sgtin")) {
      // SGTIN URN format: urn:epc:id:sgtin:CompanyPrefix.ItemRefAndIndicator.Serial
      const m = uri.match(/^urn:epc:id:sgtin:(\d+)\.(\d+)\.(.+)$/);
      if (!m)
        return null;
  
      const [, cp, itemRefIndic, serial] = m;
  
      // First digit of itemRefIndic = Indicator
      const indicator = itemRefIndic[0];
      const itemRef = itemRefIndic.slice(1);
  
      // Build GTIN base (indicator + cp + itemRef must be 13 digits)
      const gtinBase = indicator + cp + itemRef;
      const gtin = gtinBase + gs1CheckDigit(gtinBase); // final 14-digit GTIN
  
      const lot = evt?.ilmd?.lotNumber as string | undefined;
      const exp = evt?.ilmd?.expiryDate as string | undefined;
  
      let element = `01${gtin}`;
      let text = `(01)${gtin}`;
  
      // Expiry date AI (17) – YYMMDD
      if (exp) {
        const yy = exp.slice(2, 4);
        const mm = exp.slice(5, 7);
        const dd = exp.slice(8, 10);
        element += `17${yy}${mm}${dd}`;
        text += `(17)${yy}${mm}${dd}`;
      }
  
      // Lot number AI (10)
      if (lot) {
        element += `10${lot}${FNC1}`;
        text += `(10)${lot}`;
      }
  
      // Serial AI (21) — must be delimited with FNC1 if variable-length before
      element += `21${serial}`;
      text += `(21)${serial}`;
  
      return { type: "GTIN", element, text, gtin, serial };
    }
  
    /* ---------- SSCC ---------- */
    if (uri.startsWith("urn:epc:id:sscc")) {
      // SSCC URN format: urn:epc:id:sscc:CompanyPrefix.SerialRef
      const m = uri.match(/^urn:epc:id:sscc:(\d+)\.(\d+)$/);
      if (!m)
        return null;
  
      const [, cp, serialRef] = m;
  
      // Build SSCC: (ExtensionDigit + CompanyPrefix + SerialRef) must be 17 digits
      // Then add check digit for total 18 digits
      const base = cp + serialRef; // company prefix already 11 digits
      const sscc = base + gs1CheckDigit(base);
  
      const element = `00${sscc}`;
      const text = `(00)${sscc}`;
  
      return { type: "SSCC", element, text, sscc };
    }
  
    /* ---------- GLN (SGLN) ---------- */
    if (uri.startsWith("urn:epc:id:sgln")) {
      // SGLN URN format: urn:epc:id:sgln:CompanyPrefix.LocationRef.Extension
      // const m = uri.match(/^urn:epc:id:sgln:(\d+)\.(\d+)\.(\d+)$/);
      const m = uri.match(/^urn:epc:id:sgln:(\d+)\.(\d*)\.(\d+)$/);
      if (!m)
        return null;
  
      const [, cp, locRef, ext] = m;
  
      // Build GLN core (CompanyPrefix + LocationRef)
      const glnCore = cp + locRef;
      const gln = glnCore + gs1CheckDigit(glnCore); // total 13 digits
  
      // GLN AI (414), Extension AI (254) if non-zero
      let element = `414${gln}`;
      let text = `(414)${gln}`;
  
      if (ext && ext !== "0") {
        element += `${FNC1}254${ext}`;
        text += `(254)${ext}`;
      }
  
      return { type: "GLN", element, text, gln, extension: ext };
    }
  
    return null;
  }
  
  // Helper function for GS1 check digit calculation
  function gs1CheckDigit(digits: string): string {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      const digit = Number.parseInt(digits[i]);
      const weight = (digits.length - i) % 2 === 0 ? 1 : 3;
      sum += digit * weight;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit.toString();
  }