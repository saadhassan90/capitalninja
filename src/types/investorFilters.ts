export type InvestorFilterType = string | ((type: string) => boolean) | null;
export type AUMRange = [number, number] | null;

export interface ListFilters {
  type: string | null;  // Serialized version for storage
  location: string | null;
  assetClass: string | null;
  firstTimeFunds: string | null;
  aumRange: AUMRange;
}

export interface FilterChangeHandler {
  (
    type: InvestorFilterType,
    location: InvestorFilterType,
    assetClass: InvestorFilterType,
    firstTimeFunds: InvestorFilterType,
    aumRange: AUMRange
  ): void;
}

export interface FilterProps {
  onFilterChange: FilterChangeHandler;
}