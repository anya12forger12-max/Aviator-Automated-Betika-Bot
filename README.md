# Aviator Automated Betika Bot

A Node.js + Puppeteer **browser-automation research project** for an Aviator-style demo game. It watches the round multiplier, applies configurable betting strategies, tracks results, and can optionally log observations to MySQL.

> **Scope and legal note:** This repository contains automation code only — no wallet, payments, or payout rails. Automating a third-party gaming site may violate its terms of use and may be illegal in some jurisdictions. Use it only in environments you control or where automation is explicitly permitted. Nothing here guarantees or implies profitable outcomes.

## What is in this snapshot

- **`index.js`** — interactive CLI: pick a strategy, launch a visible Puppeteer browser, navigate the configured demo URL, attach a `targetcreated` handler for the game tab, and shut down after the configured run duration.
- **`game/gameMonitor.js`** — polls the multiplier, detects round changes, and coordinates betting decisions.
- **`game/betManager.js`** — locates the bet/cashout controls inside page frames and places bets through the selected strategy.
- **`game/strategies.js`** — implements initial-bet, Martingale-style progression after losses, stop-loss, take-profit, and max/min bet caps.
- **`game/statsTracker.js`** — in-memory trade, win/loss, streak, and profit/loss statistics.
- **`util/config.js`** — all URLs, CSS selectors, timings, database settings, and the three preset strategies.
- **`util/frameHelper.js`**, **`util/logger.js`** — frame traversal helpers and structured logging.
- **`database/database.js`** — MySQL insertion of observed multiplier values. In `index.js` the `connect()`/`disconnect()` calls are currently commented out, so this is opt-in.
- **`public/`** — a small static page and script included in the snapshot. No Express/Socket.IO server is actually started here, even though those packages are declared as dependencies.
- **`test/syntax.test.js`** — a Node built-in test that checks JavaScript syntax across all source files.

## Built-in strategies

| Preset | Initial bet | Target multiplier | Stop loss | Take profit | Martingale factor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Conservative | 1.00 | 1.20 | 20.00 | 40.00 | 1.5 |
| Moderate | 2.00 | 1.50 | 50.00 | 100.00 | 2 |
| Aggressive | 5.00 | 2.00 | 100.00 | 300.00 | 2.5 |

A fourth "Custom" option prompts for each parameter interactively. Values are defined in `util/config.js`; the browser defaults to a non-headless window and a 24-hour run duration.

## Requirements

- Node.js 18 or newer and npm
- A network-reachable demo URL and a locally installed Chromium/Chrome that Puppeteer can drive
- MySQL only if you deliberately enable the database module

## Quick start — 1 or 2 commands

```bash
./setup.sh          # install dependencies
./setup.sh run      # start the project (when a run target exists)
```

`setup.sh` detects this repository's build system and installs the right toolchain
dependencies. Use `./setup.sh test` to run the available checks. If a project has no
standard run target, the script prints the correct command from the sections above.

Direct equivalents: `npm install`, `npm start`, `npm test`.

## Configuration

Edit `util/config.js` before running:

- `NAVIGATION.BASE_URL` — the demo site to open (default in this snapshot is a demo welcome page).
- `SELECTORS` — CSS selectors for the demo page's buttons, balance, and multiplier. These are site-specific and will need updating if the target markup changes.
- `GAME.POLLING_INTERVAL` and `HISTORY_SIZE` — polling cadence and multiplier window.
- `DATABASE` — connection settings used only when you enable the database module.

## Testing

`npm test` runs `node --test`, which parses every source file with `node --check`. It validates syntax only; it does not exercise browser automation or betting logic.

## Project layout

```
index.js            CLI entry point
game/               monitoring, betting, strategy, and statistics modules
util/               configuration, frame helpers, logger
database/           optional MySQL observation logger
public/             bundled static page and script
test/               syntax test
ReadMe.md           original upstream notes retained for reference
```

## Caveats

- The selector-based automation is brittle: a demo site redesign can break it.
- Betting progressions increase exposure; stop-loss and take-profit limits are configuration values, not guarantees.
- The `public/` assets and the Express/Socket.IO dependencies are not wired into a running server in this snapshot.

## License and attribution

`package.json` declares **ISC** and lists author `raccoon`. The retained `ReadMe.md` refers to **MIT** and links a `LICENSE` file that is not present in this repository. The inconsistency is preserved rather than silently resolved; confirm licensing with the original author before reuse. The original `ReadMe.md` is kept for historical context.
