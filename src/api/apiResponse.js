export function unwrapApiResponse(response) {
  return response?.data?.data ?? response?.data ?? response
}

export function unwrapApiList(response) {
  const value = unwrapApiResponse(response)
  return Array.isArray(value) ? value : value?.content || value?.items || []
}
