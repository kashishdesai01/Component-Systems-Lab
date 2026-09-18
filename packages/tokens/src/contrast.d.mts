export interface ContrastContract {
  readonly foreground: string;
  readonly background: string;
  readonly minimum: number;
  readonly purpose: string;
}
export interface ContrastFailure extends ContrastContract {
  readonly theme: string;
  readonly ratio: number;
}
export declare function luminance(hex: string): number;
export declare function contrastRatio(foreground: string, background: string): number;
export declare const contrastContracts: readonly ContrastContract[];
export declare function auditContrast(
  themes: Record<string, Record<string, string>>,
  contracts?: readonly ContrastContract[],
): ContrastFailure[];
