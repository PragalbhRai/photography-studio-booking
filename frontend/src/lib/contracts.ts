export interface SignedContract {
  id: string
  sittingId: string
  clientName: string
  packageName: string
  photographerName: string
  signatureDataUrl: string
  signedAt: string
  sha256Hash: string
  certificateNumber: string
  archivalRating: string
  paperStock: string
}

const STORAGE_KEY = 'northlight_signed_agreements'

export function getStoredContracts(): SignedContract[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveContract(contract: SignedContract) {
  if (typeof window === 'undefined') return
  const current = getStoredContracts()
  const updated = [contract, ...current.filter((c) => c.id !== contract.id)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export async function generateSha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(buffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
