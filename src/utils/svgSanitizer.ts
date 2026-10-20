export class SVGSanitizer {
  private static readonly FORBIDDEN_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /javascript:/gi
  ];

  /**
   * Strip malicious executable JavaScript from raw SVG payload
   */
  public static sanitize(rawSvg: string): string {
    let clean = rawSvg;
    for (const pattern of this.FORBIDDEN_PATTERNS) {
      clean = clean.replace(pattern, '');
    }
    return clean;
  }
}
