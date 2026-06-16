export enum OrderType {
  FreezeAccount = 0,
  BalanceEnquiry = 1
}

export enum CaseStatus {
  Pending = 0,
  AccountValidated = 1,
  AccountNotFound = 2,
  UnderReview = 3,
  FreezeApplied = 4,
  BalanceProvided = 5
}

export interface BankCaseDto {
  id: number;
  caseNumber: string;
  defendantName: string;
  targetBank: string;
  accountNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  orderType: OrderType;
  requestedFreezeAmount?: number;
  status: CaseStatus;
  createdAt: string;
  resolvedAt?: string;
  bankRemarks?: string;
  systemRemarks?: string;
  
  matchedAccountNumber?: string;
  batchFoundBalance?: number;
  finalFreezeAmount?: number;
  finalReportedBalance?: number;
}

export interface BankResponseDto {
  finalFreezeAmount?: number | null;
  finalReportedBalance?: number | null;
  bankRemarks?: string;
}
