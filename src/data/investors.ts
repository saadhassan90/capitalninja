export interface Investor {
  id: string;
  name: string;
  company: string;
  investmentFocus: string;
  minimumInvestment: string;
  location: string;
  portfolio: number;
}

export const investors: Investor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Blue Capital Ventures",
    investmentFocus: "SaaS, Fintech",
    minimumInvestment: "$250K",
    location: "San Francisco, CA",
    portfolio: 45,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    company: "Horizon Partners",
    investmentFocus: "Healthcare, Biotech",
    minimumInvestment: "$500K",
    location: "Boston, MA",
    portfolio: 32,
  },
  {
    id: "3",
    name: "Emily Zhang",
    company: "Future Fund",
    investmentFocus: "AI, Machine Learning",
    minimumInvestment: "$100K",
    location: "New York, NY",
    portfolio: 28,
  },
  {
    id: "4",
    name: "David Park",
    company: "Innovation Capital",
    investmentFocus: "Clean Energy, Sustainability",
    minimumInvestment: "$1M",
    location: "Seattle, WA",
    portfolio: 15,
  },
  {
    id: "5",
    name: "Rachel Thompson",
    company: "Growth Ventures",
    investmentFocus: "E-commerce, D2C",
    minimumInvestment: "$750K",
    location: "Los Angeles, CA",
    portfolio: 23,
  },
];