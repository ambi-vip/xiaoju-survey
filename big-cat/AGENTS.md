# Agent Guidelines

## Commands
- **Test Single Class**: `./gradlew :<module>:test --tests <ClassName>` (e.g., `./gradlew :domain:test --tests DemoSpec`)
- **Lint/Format**: `./gradlew detekt` (Kotlin), `pnpm lint` (Client)
- **Build**: `./gradlew build` (Backend), `cd client && pnpm build` (Frontend)
- **Verify Coverage**: `./gradlew domain:jacocoTestCoverageVerification`

## Code Style & Architecture
- **Language**: Kotlin (Backend), TypeScript (Frontend). Follow "Official" Kotlin style.
- **Architecture**: DDD (Domain-Driven Design).
  - `api`: Commands, Events, Query Views.
  - `domain`: Aggregates, Sagas, Business Logic.
  - `server`: Host, Controllers, Config.
- **Naming**: PascalCase for classes/interfaces, camelCase for functions/variables.
- **Testing**: Mandatory for domain logic. Use JUnit 5, Mockk, and Fluent Assert (`me.ahoo.test:fluent-assert-core`).
- **Frontend**: Generate clients via `pnpm generate` in `client/` after API changes.
- **Conventions**: Prefer `val` over `var`. Use `Detekt` to enforce rules.
