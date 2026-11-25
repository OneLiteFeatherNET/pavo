import { describe, expect, it } from 'vitest'
import { ApiError, NetworkError, problemFromBody, toClientError, toTransportError } from './problem'

describe('problemFromBody', () => {
  it('keeps the RFC 9457 fields of a problem document', () => {
    const err = problemFromBody(409, 'Conflict', {
      type: 'about:blank',
      title: 'Conflict',
      status: 409,
      detail: 'pool is in maintenance',
    })
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(409)
    expect(err.problem.title).toBe('Conflict')
    expect(err.message).toBe('pool is in maintenance')
  })

  it('falls back to a generic problem for a non-problem body', () => {
    const err = problemFromBody(502, 'Bad Gateway', '<html>upstream down</html>')
    expect(err.status).toBe(502)
    expect(err.problem.title).toBe('Bad Gateway')
    expect(err.problem.type).toBe('about:blank')
    expect(err.errors).toEqual([])
  })

  it('uses the HTTP status when the status is missing', () => {
    expect(problemFromBody(500, '', {}).problem.title).toBe('HTTP 500')
  })

  it('exposes validation errors by location and message', () => {
    const err = problemFromBody(422, 'Unprocessable Entity', {
      title: 'Unprocessable Entity',
      status: 422,
      errors: [{ location: 'body.scaling.max', message: 'must be >= min' }],
    })
    expect(err.errors).toEqual([{ location: 'body.scaling.max', message: 'must be >= min' }])
  })
})

describe('toClientError', () => {
  it('maps a thrown error with a response to an ApiError', () => {
    const thrown = { response: { status: 404, statusText: 'Not Found', _data: { title: 'Not Found', status: 404 } } }
    const err = toClientError(thrown)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(404)
  })

  it('maps an error without a response to a NetworkError', () => {
    expect(toClientError(new TypeError('fetch failed'))).toBeInstanceOf(NetworkError)
  })

  it('passes known client errors through unchanged', () => {
    const known = new NetworkError('gone')
    expect(toClientError(known)).toBe(known)
  })
})

describe('toTransportError', () => {
  it('carries status, title and problem of an ApiError', () => {
    const problem = { type: 'about:blank', title: 'Conflict', status: 409, detail: 'Pool is busy' }
    expect(toTransportError(new ApiError(problem))).toEqual({
      status: 409,
      statusText: 'Conflict',
      message: 'Pool is busy',
      data: { problem },
    })
  })

  it('marks a NetworkError as a bad gateway with network data', () => {
    const transported = toTransportError(new NetworkError())
    expect(transported.status).toBe(502)
    expect(transported.data).toEqual({ network: true })
  })
})

describe('toClientError with transported data', () => {
  it('rebuilds the ApiError from the data of a wrapped error', () => {
    const problem = { type: 'about:blank', title: 'Not Found', status: 404, detail: 'No pool lobby' }
    const wrapped = Object.assign(new Error('wrapped'), { data: { problem } })
    const err = toClientError(wrapped)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).problem.detail).toBe('No pool lobby')
  })

  it('rebuilds a NetworkError from network data', () => {
    expect(toClientError({ data: { network: true } })).toBeInstanceOf(NetworkError)
  })

  it('ignores data that is not a transported problem', () => {
    const thrown = { data: { problem: 'text' }, response: { status: 500, statusText: 'Server Error', _data: {} } }
    expect((toClientError(thrown) as ApiError).status).toBe(500)
  })
})
