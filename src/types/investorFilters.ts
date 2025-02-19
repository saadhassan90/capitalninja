
export type InvestorFilterType = string | null;
export type AUMRange = {
  min: number | null;
  max: number | null;
} | null;

export interface ListFilters {
  type: string | null;
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
