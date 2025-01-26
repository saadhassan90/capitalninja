export type InvestorFilterType = string | null;
export type AUMRange = [number, number] | null;

export interface ListFilters {
  type: InvestorFilterType;
  location: InvestorFilterType;
  assetClass: InvestorFilterType;
  firstTimeFunds: InvestorFilterType;
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