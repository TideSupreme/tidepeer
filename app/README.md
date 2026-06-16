# TidePeer

Verifiable Anonymous Peer Review

## What it is

TidePeer is a peer-review platform where reviewers prove domain expertise and absence of conflicts while remaining completely anonymous — even to the journal. Assignments are generated through Tide-enforced cryptographic policy so no single editor can rig or later unmask them. The result is the first peer-review system whose fairness any outsider can mathematically verify.

## How to run

```bash
cd app
npm install
npm run dev
```

Open http://localhost:3000. Log in with TideCloak (TideCloak server must be running at the configured endpoint).

## Pages & features

- **/** — Rebranded login page with strong value hook
- **/home** — Dashboard with encrypted expertise profile (live Tide doEncrypt/doDecrypt) + navigation to 4 feature pages
- **/claim** — Submit encrypted expertise claim (Tide-sealed, persists across sessions)
- **/conflicts** — Declare conflicts anonymously (Tide-sealed)
- **/assignments** — View cryptographically matched paper assignments
- **/audit** — Public verifiable audit trail of assignment decisions

## What's mocked vs real

- **Real**: TideCloak authentication, doEncrypt/doDecrypt for all reviewer claims, DPoP-bound session
- **Mocked**: Assignment roster generation and public audit log entries (would be produced by Tide network consensus in production)

All core flows break without Tide encryption — the journal server never sees plaintext reviewer data.
