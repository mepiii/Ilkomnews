// Client-side TTL check so expired items hide instantly from a cached API
// payload, before the next 30s re-fetch. Backend already filters by
// expires_at in Asia/Jakarta; this is the UI-side guarantee.
//
// expires_at arrives as an ISO-8601 string WITH offset (e.g. ...+07:00) from
// Laravel's datetime cast, so new Date() is correct in any browser timezone.
export function isNotExpired(item) {
  if (!item?.expires_at) return true
  return new Date(item.expires_at).getTime() > Date.now()
}
