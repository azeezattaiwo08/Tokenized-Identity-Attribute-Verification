;; Verifier Verification Contract
;; This contract validates legitimate credential checkers

(define-data-var admin principal tx-sender)
(define-map verifiers principal {status: (string-ascii 20), name: (string-ascii 50), created-at: uint})

;; Error codes
(define-constant ERR_UNAUTHORIZED u100)
(define-constant ERR_ALREADY_REGISTERED u101)
(define-constant ERR_NOT_FOUND u102)

;; Read-only functions
(define-read-only (get-verifier (verifier-id principal))
  (map-get? verifiers verifier-id)
)

(define-read-only (is-active-verifier (verifier-id principal))
  (match (map-get? verifiers verifier-id)
    verified (is-eq (get status verified) "active")
    false
  )
)

;; Public functions
(define-public (register-verifier (name (string-ascii 50)))
  (let ((caller tx-sender))
    (asserts! (is-eq caller (var-get admin)) (err ERR_UNAUTHORIZED))
    (asserts! (is-none (map-get? verifiers caller)) (err ERR_ALREADY_REGISTERED))

    (map-set verifiers caller {
      status: "active",
      name: name,
      created-at: block-height
    })
    (ok true)
  )
)

(define-public (deactivate-verifier (verifier-id principal))
  (let ((caller tx-sender))
    (asserts! (is-eq caller (var-get admin)) (err ERR_UNAUTHORIZED))
    (asserts! (is-some (map-get? verifiers verifier-id)) (err ERR_NOT_FOUND))

    (map-set verifiers verifier-id
      (merge (unwrap-panic (map-get? verifiers verifier-id)) {status: "inactive"})
    )
    (ok true)
  )
)

(define-public (set-admin (new-admin principal))
  (let ((caller tx-sender))
    (asserts! (is-eq caller (var-get admin)) (err ERR_UNAUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)
