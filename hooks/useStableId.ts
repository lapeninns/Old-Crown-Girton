import { useRef } from 'react'

/**
 * useStableId
 * - Returns a deterministic stable id for a component instance.
 * - If `seed` is provided, id will be `seed` (safest for server-rendered deterministic ids).
 * - Otherwise generates a stable id based on a monotonically increasing counter (client-only fallback).
 */
let globalId = 0
export default function useStableId(seed?: string) {
  const ref = useRef<string | null>(null)
  if (ref.current) return ref.current

  if (seed) {
    ref.current = seed
  } else {
    globalId += 1
    ref.current = `stable-id-${globalId}`
  }
  return ref.current
}
