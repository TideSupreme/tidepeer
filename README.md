# TidePeer

> the first peer-review system where reviewers cryptographically prove domain expertise and zero conflicts while remaining completely anonymous to everyone, including the journal…

## Why use it

Every journal editor swears peer review is fair. None of them can prove it — and right now, they don't have to.

For fifty years, academic publishing has run on a black box: editors pick reviewers from a private list they alone control. Reviewers can't prove they had no conflicts. Authors can't verify the process was neutral. One administrator holds all the power, and the entire system depends on trusting them not to abuse it.

We built TidePeer — the first peer-review system where reviewers cryptographically prove domain expertise and zero conflicts while remaining completely anonymous to everyone, including the journal itself. The network then produces the assignment roster through a collective process no single editor can pre-determine, alter, or later deanonymize. The result? The first peer-review pipeline whose fairness any outsider can mathematically verify without ever exposing a participant.

Tide makes this possible. Every expertise claim and conflict declaration is sealed with Tide's doEncrypt — the journal server physically cannot read it. Assignments are issued as DPoP-bound, policy-enforced tokens that carry cryptographic proof of neutrality. Without Tide's primitives, you'd be back to trusting the same administrator you can't afford to trust. With Tide, the proof travels with the token.

Journals and conferences are desperate. Retraction Watch logged over 10,000 papers pulled for review manipulation last year alone. The buyers are every Nature portfolio, IEEE society, ACM conference, and university research office — a multi-billion-dollar industry one scandal away from regulatory scrutiny.

## What it is

A [Next.js](https://nextjs.org) app secured with [TideCloak](https://tidecloak.com) — decentralized identity where keys are split across a network, so **no single server (not even this app) ever holds a usable copy**. Login, sessions, and the app's sensitive data are protected by that model.

## Prerequisites

- **Node.js 20+**
- **Docker** (to run TideCloak locally)
- **`jq`** and **`curl`** (used by the init script)

## Run it locally

**1. Start TideCloak** (the public dev image — has a pre-configured entrypoint, do *not* append `start-dev`):

```bash
docker run -d --name tidecloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest

# wait until it answers:
until curl -sf http://localhost:8080 >/dev/null; do sleep 3; done
```

**2. Install and initialise** (the init script wires up TideCloak — see below):

```bash
cd app
npm install
npm run init
```

**3. Start the app:**

```bash
npm run dev
```

Open **http://localhost:3000**.

## Initialising TideCloak (what `npm run init` does)

`npm run init` runs [`init/tcinit.sh`](app/init/tcinit.sh) against your local TideCloak and:

- creates the **`nextjs-test`** realm and the **`myclient`** client,
- enables the **Tide IdP** and **IGA** (identity governance),
- creates an **`admin`** user and prints an account-link invite,
- writes the adapter config to **`tidecloak.json`**, which the app reads.

TideCloak admin console: **http://localhost:8080** (`admin` / `password`).

## Using it

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

---

Built on [TideCloak](https://tidecloak.com). The product story is in **[pitch.md](pitch.md)**.
