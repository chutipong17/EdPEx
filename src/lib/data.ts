import 'server-only'

import type { Indicator } from '@/types/indicators'
import type {
  CreateResultInput,
  ResultRecord,
} from '@/types/result'

const API_URL = process.env.API_URL

if (!API_URL) {
  throw new Error('API_URL is not configured')
}

/**
 * Helper สำหรับตรวจสอบ response จาก API
 */
async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message ??
        data?.error ??
        `API request failed with status ${response.status}`,
    )
  }

  return data
}

/**
 * =========================================================
 * GET INDICATORS FOR USER
 * =========================================================
 *
 * Returns ONLY indicators owned by userId.
 *
 * API:
 * GET /api/indicators/user/{userId}
 */
export async function getIndicatorsForUser(
  userId: number,
): Promise<Indicator[]> {
  const response = await fetch(
    `${API_URL}/api/indicators/user/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  )

  const data = await parseApiResponse(response)

  return data?.data ?? data ?? []
}

/**
 * =========================================================
 * GET SINGLE INDICATOR FOR USER
 * =========================================================
 *
 * Returns an indicator only when it belongs to userId.
 *
 * API:
 * GET /api/indicators/{id}
 */
export async function getIndicatorForUser(
  id: number,
  userId: number,
): Promise<Indicator | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/indicators/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      return null
    }

    const data = await response.json().catch(() => null)

    const indicator: Indicator | null =
      data?.data ?? data ?? null

    if (!indicator) {
      return null
    }

    if (
      String(indicator.assignedUserId) !==
      String(userId)
    ) {
      return null
    }

    return indicator
  } catch (error) {
    console.error(
      'getIndicatorForUser error:',
      error,
    )

    return null
  }
}

export async function userOwnsIndicator(
  id: number,
  userId: number,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/api/indicators/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (response.status === 404) {
      return false
    }

    if (!response.ok) {
      return false
    }

    const data = await response.json().catch(() => null)

    const indicator: Indicator | null =
      data?.data ?? data ?? null

    if (!indicator) {
      return false
    }

    return (
      String(indicator.assignedUserId) ===
      String(userId)
    )
  } catch (error) {
    console.error(
      'userOwnsIndicator error:',
      error,
    )

    return false
  }
}

/**
 * =========================================================
 * CREATE RESULT
 * =========================================================
 *
 * Creates a result through Backend API.
 *
 * userId is always taken from the authenticated session.
 *
 * API:
 * POST /api/results
 */
export async function createResult(
  input: CreateResultInput,
  userId: number,
): Promise<ResultRecord> {
  const response = await fetch(
    `${API_URL}/api/results`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        indicatorId: input.indicatorId,
        userId,
        resultValue: input.resultValue,
        description: input.description,
      }),
      cache: 'no-store',
    },
  )

  const data = await parseApiResponse(response)

  return data?.data ?? data
}

/**
 * =========================================================
 * GET RESULTS FOR INDICATOR
 * =========================================================
 *
 * Returns only results belonging to the authenticated user.
 *
 * API:
 * GET /api/results/indicator/{indicatorId}?userId={userId}
 */
export async function getResultsForIndicator(
  indicatorId: number,
  userId: string,
): Promise<ResultRecord[]> {
  const response = await fetch(
    `${API_URL}/api/results/indicator/${indicatorId}?userId=${encodeURIComponent(
      userId,
    )}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  )

  const data = await parseApiResponse(response)

  return data?.data ?? data ?? []
}