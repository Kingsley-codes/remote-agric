export interface Opportunity {
  id: string;
  title: string;
  produceName: string;
  duration: string;
  roi: number;
  unitPrice: number;
  minInvestment: number;
  fundedPercentage: number;
  category: "Crop Farm" | "Livestock";
  unitsLeft: number;
  imageUrl: string;
  imageAlt: string;
  icon?: string;
}

export interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Logo {
  icon: string;
  name: string;
}

// API response type
export interface ApiProduce {
  _id: string;
  produceName: string;
  title: string;
  description: string;
  totalUnit: number;
  minimumUnit: number;
  price: number;
  category: string;
  duration: number;
  ROI: number;
  remainingUnit: number;
  remainingPercentage: number;
  image1: {
    url: string;
    publicId: string;
  };
  image1Alt: string;
  image2: {
    url: string;
    publicId: string;
  };
  image2Alt: string;
  image3: {
    url: string;
    publicId: string;
  };
  image3Alt: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  produce: ApiProduce[];
}

export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  investor: string;
  investorImage: string;
  type: string;
  amount: string;
  date: string;
  status: TransactionStatus;
  statusColor: string;
}
