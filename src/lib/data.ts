import 'server-only'
import { MOCK_INDICATORS } from './mock-indicators-user'
import type { Indicator } from '@/types/indicators'
import type { CreateResultInput, ResultRecord } from '@/types/result'

/**
 * In-memory result store. Replaced by a real database table in production.
 * Module-scoped so it survives across requests during the dev session.
 */
const resultStore: ResultRecord[] = []
let nextResultId = 1

/**
 * Row Level Security boundary:
 * Returns ONLY the indicators owned by `userId`. Equivalent to
 *   SELECT * FROM indicators WHERE assignedUserId = :userId
 */
export function getIndicatorsForUser(userId: number): Indicator[] {
  return MOCK_INDICATORS.filter( (i) => i.assignedUserId === String(userId))
}

/**
 * Returns a single indicator only if it belongs to `userId`.
 * Returns null when the record does not exist OR is owned by someone else,
 * so callers cannot distinguish "not found" from "not yours".
 */
export function getIndicatorForUser(
  id: number,
  userId: string,
): Indicator | null {
  const indicator = MOCK_INDICATORS.find((i) => i.id === id)
  if (!indicator || indicator.assignedUserId !== userId) return null
  return indicator
}

/** True when `userId` owns the indicator. */
export function userOwnsIndicator(id: number, userId: string): boolean {
  return MOCK_INDICATORS.some(
    (i) => i.id === id && i.assignedUserId === userId,
  )
}

/**
 * Persist a result. The caller MUST have already verified ownership.
 * `userId` is forced to the session user — never trusted from the client.
 */
export function createResult(
  input: CreateResultInput,
  userId: string,
): ResultRecord {
  const record: ResultRecord = {
    id: nextResultId++,
    indicatorId: input.indicatorId,
    userId,
    resultValue: input.resultValue,
    description: input.description,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
  }
  resultStore.push(record)

  // Reflect the submission back onto the mock indicator for the demo UI.
  const indicator = MOCK_INDICATORS.find((i) => i.id === input.indicatorId)
  if (indicator) {
    indicator.resultValue = input.resultValue
    indicator.status = 'completed'
  }

  return record
}

export function getResultsForIndicator(
  indicatorId: number,
  userId: string,
): ResultRecord[] {
  return resultStore.filter(
    (r) => r.indicatorId === indicatorId && r.userId === userId,
  )
}
