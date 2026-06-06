/**
 * Returns a standardized success JSON response
 * @param data - The response payload
 * @param status - HTTP status code (default 200)
 * @returns Response object with { success: true, data }
 */
export function successResponse(data: unknown, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

/**
 * Returns a standardized error JSON response
 * @param message - Human-readable error message
 * @param status - HTTP status code
 * @returns Response object with { success: false, error }
 */
export function errorResponse(message: string, status: number): Response {
  return Response.json({ success: false, error: message }, { status });
}
