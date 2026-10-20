export class CurrencyConverter {
  private static readonly RATES_TO_USD: Record<string, number> = {
    USD: 1.0,
    EUR: 1.08,
    TRY: 0.029
  };

  public static convert(amount: number, from: string, to: string): number {
    const fromRate = this.RATES_TO_USD[from] || 1.0;
    const toRate = this.RATES_TO_USD[to] || 1.0;

    const inUSD = amount * fromRate;
    return Number((inUSD / toRate).toFixed(2));
  }
}
