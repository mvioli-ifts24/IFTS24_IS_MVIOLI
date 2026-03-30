/**
 * Helpers para llamadas HTTP autenticadas.
 * Punto único de configuración de los headers de autorización.
 */
export function getAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` }
}
