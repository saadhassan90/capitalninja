export const fetchTransactionData = async () => {
  // This would normally fetch from an API, but we'll use the static data for now
  const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const invested = [1811.5, 1961.7, 2080.9, 2189.4, 2379.5, 2510.2, 2574.5, 2736.3, 2937.5, 3056.7, 2835.6, 3401.2, 3589.4, 3712.8, 3845.6];

  return years.map((year, index) => ({
    date: `${year}-01-01`,
    total: invested[index] * 1000000, // Convert to actual values (millions to absolute)
  }));
};
