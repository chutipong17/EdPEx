export interface ResultRecord {
  id: number
  indicatorId: number
  userId: string
  /** ผลประเมิน */
  resultValue: number
  /** รายละเอียด */
  description: string
  submittedAt: string
  status: 'submitted'
}

/** Payload sent from the client when submitting a result */
export interface CreateResultInput {
  indicatorId: number
  resultValue: number
  description: string
}
