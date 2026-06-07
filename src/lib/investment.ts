export type ProduceType = "Animal" | "Crop";
export type InvestmentStatus = "Active" | "Completed" | "Pending";

export interface Investment {
  id: string;
  investorName: string;
  investorImage: string;
  projectName: string;
  produceType: ProduceType;
  amount: number;
  investmentDate: string;
  status: InvestmentStatus;
}
