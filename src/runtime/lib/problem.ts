/** RFC 9457 problem details as an API sends them (application/problem+json). */
export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  /** Field-level errors (validation): where it happened and what is wrong. The submitted value is never shown. */
  errors?: ProblemError[] | null
}

export interface ProblemError {
  location?: string
  message?: string
}

/** An error answer from the API: the problem document, or a generic one when the body was not a problem. */
export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetails

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title)
    this.name = 'ApiError'
    this.status = problem.status
    this.problem = problem
  }

  get errors(): ProblemError[] {
    return Array.isArray(this.problem.errors) ? this.problem.errors : []
  }
}

/** The API could not be reached at all (no response). */
export class NetworkError extends Error {
  constructor(message = 'The API could not be reached') {
    super(message)
    this.name = 'NetworkError'
  }
}

/** Maps a failed response to an ApiError. Bodies that are not problem documents get a generic problem. */
export function problemFromBody(status: number, statusText: string, body: unknown): ApiError {
  const b = typeof body === 'object' && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : {}
  return new ApiError({
    ...b,
    type: typeof b.type === 'string' ? b.type : 'about:blank',
    title: typeof b.title === 'string' ? b.title : statusText || `HTTP ${status}`,
    status: typeof b.status === 'number' ? b.status : status,
    detail: typeof b.detail === 'string' ? b.detail : undefined,
    errors: Array.isArray(b.errors) ? (b.errors as ProblemError[]) : null,
  })
}

/**
 * Normalises whatever a failed request threw. A thrown error with a response is an API answer; an error that already
 * carries the transport data of {@link toTransportError} (for example restored from the SSR payload) is rebuilt from
 * it; without either the request never completed (network down, BFF unreachable).
 */
export function toClientError(err: unknown): ApiError | NetworkError {
  if (err instanceof ApiError || err instanceof NetworkError) return err
  if (typeof err !== 'object' || err === null) return new NetworkError()
  const data = (err as { data?: unknown }).data
  if (isTransportData(data)) {
    return 'problem' in data ? new ApiError(data.problem) : new NetworkError()
  }
  if ('response' in err) {
    const response = (err as { response?: { status?: unknown, statusText?: unknown, _data?: unknown } }).response
    if (response && typeof response.status === 'number') {
      return problemFromBody(
        response.status,
        typeof response.statusText === 'string' ? response.statusText : '',
        response._data,
      )
    }
  }
  return new NetworkError()
}

/** What travels in the `data` of a Nuxt error so the client can rebuild the original ApiError or NetworkError. */
export type TransportData = { problem: ProblemDetails } | { network: true }

/** Input for Nuxt's createError: status and text for the error page, the original error as data. */
export interface TransportError {
  status: number
  statusText: string
  message: string
  data: TransportData
}

/**
 * Turns a client error into createError input. Nuxt masks every server-side error that was not raised with an HTTP
 * status as "500 Internal Server Error" and drops its data, so API problems must travel this way to survive SSR.
 */
export function toTransportError(err: ApiError | NetworkError): TransportError {
  if (err instanceof ApiError) {
    return { status: err.status, statusText: err.problem.title, message: err.message, data: { problem: err.problem } }
  }
  return { status: 502, statusText: 'Bad Gateway', message: err.message, data: { network: true } }
}

function isTransportData(value: unknown): value is TransportData {
  if (typeof value !== 'object' || value === null) return false
  if ('network' in value) return (value as { network: unknown }).network === true
  if (!('problem' in value)) return false
  const problem = (value as { problem: unknown }).problem
  return typeof problem === 'object' && problem !== null && typeof (problem as { status?: unknown }).status === 'number'
}
