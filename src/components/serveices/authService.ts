import { useGetAllUsers, useGetUserById, useCreateUser, useUpdateUser, useDeleteUser } from '@/service/user/user'
import type {
  AddUserValues,
  EditUserValues,
  ChangePasswordValues,
} from '@/lib/user-schema'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface User {
  id: number
  username: string
  fullname: string
  email: string
  department: string
  phone: string
  role: 'ADMIN' | 'EXECUTIVE' | 'USER'
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

// ==================== GET USERS ====================

export async function getUsers(): Promise<User[]> {
  // const response = await fetch(`${API_URL}/users`, {
  //   cache: 'no-store',
  // })
  const {
       data: AllUsers,
       isLoading: usersLoading,
       error: usersError,
       refetch: mutate,
     } = useGetAllUsers();

  const result: ApiResponse<User[]> = await AllUsers.json()

  // if (!response.ok) {
  //   throw new Error(result.message)
  // }

  return result.data
}

// ==================== CREATE USER ====================

export async function createUser(
  values: AddUserValues
): Promise<User> {
  const { confirmPassword, ...payload } = values
  console.log("register",values);
  

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result: ApiResponse<User> = await response.json()

  if (!response.ok) {
    throw new Error(result.message)
  }

  return result.data
}

// ==================== UPDATE USER ====================

export async function updateUser(
  userId: number,
  values: EditUserValues
): Promise<User> {
    console.log("updateUser",values);
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }
  )

  const result: ApiResponse<User> = await response.json()

  if (!response.ok) {
    throw new Error(result.message)
  }

  return result.data
}

// ==================== CHANGE PASSWORD ====================

export async function changePassword(
  userId: number,
  values: ChangePasswordValues
): Promise<void> {
    console.log("changePassword",values);
  const { confirmPassword, ...payload } = values

  const response = await fetch(
    `${API_URL}/users/${userId}/password`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message)
  }
}

// ==================== DELETE USER ====================

export async function deleteUser(
  userId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: 'DELETE',
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message)
  }
}