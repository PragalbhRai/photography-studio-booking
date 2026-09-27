import type { QueryClient } from '@tanstack/react-query'
import type { AuthContextType } from './auth'

export interface RouterContext {
  queryClient: QueryClient
  auth: AuthContextType
}
