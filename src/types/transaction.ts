export interface Transaction {
  invoice_number: string
  transaction_type: string 
  description: string
  total_amount: number
  created_on: string 
}

export interface TransactionRequest {
  service_code: string
}

export interface TransactionHistoryParams {
  offset: number
  limit: number
}
