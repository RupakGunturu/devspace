# 🧱 Stack Breakdown — Discord

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Discord is a real-time communication platform built around text channels, voice/video calls, and community servers ("guilds"). It started in 2015 as a chat tool for gamers and has since grown into a general-purpose platform used by study groups, open-source projects, creators, and large brand communities alike.

**Scale:** Discord serves well over 200 million monthly active users across millions of active servers, with well-documented peaks of tens of millions of concurrent WebSocket connections and tens of millions of gateway events per second. Individual servers ("guilds") have scaled from tens of thousands to well over a million concurrently online members — the MidJourney community server being a famous public example that pushed Discord's infrastructure limits in 2022.

**Interesting engineering challenges:**
- Fanning out a single message to hundreds of thousands of connected clients in near real time, without the fan-out cost growing unmanageably as a server grows.
- Storing and querying trillions of chat messages with predictable low latency.
- Running voice and video with minimal latency across a global user base.
- Keeping a five-person backend team able to operate ~20 services handling millions of concurrent users — a story about picking the right tools, not just throwing headcount at scale.

Everything below is grounded in Discord's own public engineering blog, engineering conference talks, and reputable tech press coverage of that material. Where Discord hasn't published specifics, that is called out explicitly.

---

## Frontend Stack

| Technology | Why it's used | Benefits |
|---|---|---|
| **React** | Powers Discord's component-based UI across web and desktop. Confirmed by multiple independent teardown writeups of the client bundle. | Reusable UI components, large ecosystem, efficient re-rendering for a chat UI with constant state changes. |
| **TypeScript** | Adopted broadly across the client codebase over time. | Type safety across a huge, long-lived frontend codebase reduces runtime bugs. |
| **Redux (or Redux-like store)** | Manages complex, deeply nested client state — guild lists, channels, member presence, unread markers. | Predictable, centralized state management for an app with dozens of interacting real-time data streams. |
| **Electron** | Wraps the web client (Chromium + Node.js) to ship a native desktop app for Windows, macOS, and Linux from a single codebase. | Cross-platform desktop delivery without maintaining three separate native codebases; Node.js access enables OS-level features like tray icons and notifications. |
| **WebRTC** | Handles real-time audio/video in the browser and desktop renderer. | Industry-standard, browser-native real-time media transport, extended with native code for performance. |
| **Native C/C++ modules** | Used for performance-sensitive subsystems like voice/video encoding, integrated into the Electron shell. | Offloads CPU-heavy audio/video work outside the JavaScript main thread for lower latency. |

This is a fairly typical "web technologies + native shell" strategy: one core web codebase reused across web, desktop, and (with native wrappers) mobile, with C/C++ dropped in only where raw performance is non-negotiable.

---

## Backend Stack

Discord's backend is unusually well documented and unusually polyglot — a deliberate "use the right tool per problem" philosophy rather than a single company-wide stack.

**Core real-time messaging — Elixir on the BEAM VM.** <cite index="1-1">Discord runs a cluster of 400-500 Elixir machines to power its chat messaging systems, and a team of about five engineers is responsible for 20+ Elixir services handling millions of concurrent users and pushing dozens of millions of messages per second.</cite> <cite index="1-1">These Elixir services communicate with each other using Distributed Erlang, the protocol built into the Erlang VM.</cite>

Each Discord server ("guild") maps to a single lightweight Elixir process. <cite index="10-1">A dedicated Elixir "guild process" tracks all connected users in that community, and every online user also gets a separate Elixir "session process."</cite> <cite index="10-1">When the guild process receives a new message or event, it fans that update out to the relevant session processes, which then push it to the client over a WebSocket connection.</cite> This is the Actor Model in practice: one crashing process (say, a bugged plugin interaction in one server) doesn't take down the rest of the platform, because Elixir/BEAM supervises and isolates processes individually.

**HTTP REST API — Python.** The public-facing HTTP API (the one third-party bots and integrations use for CRUD-style operations like creating channels or sending messages) runs as a Python service layer, separate from the real-time WebSocket Gateway.

**Performance-critical services — Rust.** Where Elixir's garbage-collector-free concurrency model or Go's stop-the-world garbage collection weren't fast enough, Discord has rewritten specific hot-path services in Rust. The most publicized example is the "Read States" service (which tracks what messages/channels each user has read). <cite index="30-1">Read States is hit every time a user connects to Discord, every time a message is sent, and every time a message is read — and the original Go implementation suffered periodic latency and CPU spikes from garbage collection.</cite> <cite index="30-1">Rust's lack of a garbage collector, plus its ownership-based memory safety model, made it a natural fit, and the rewrite eliminated those latency spikes.</cite> Rust NIFs (Native Implemented Functions) are also hooked directly into the Elixir services for CPU-intensive data-structure work — for example, a custom Rust-backed sorted-set structure was built <cite index="3-1">to help Discord scale its Member List feature to 11 million concurrent users, after pure-Elixir immutable data structures couldn't keep up with the mutation rate.</cite>

**Voice/video media — C++.** <cite index="1-1">Elixir handles the signaling (call setup/control plane) for audio and video, while C++ handles the actual media streaming, together running across 1000+ nodes.</cite>

**Authentication & APIs:** Discord uses OAuth2 for third-party app and bot authorization (publicly documented via the Discord Developer Portal), token-based session authentication for clients, and a combination of the WebSocket Gateway (for real-time events, used by both clients and bots) and REST endpoints (for one-off actions) as its two primary API surfaces.

---

## Database

Discord's database story is one of its most-cited public engineering narratives — a company that outgrew three different databases as it scaled.

| Database | Why it's used | What it stores |
|---|---|---|
| **MongoDB** (early history) | Chosen in Discord's earliest days for flexibility while the product was still finding shape. | Original message storage, before scale problems appeared. |
| **Apache Cassandra** (2017–2022) | <cite index="20-1">Adopted in 2017 for its write throughput and horizontal scalability after MongoDB's architecture couldn't keep up.</cite> | Chat messages, partitioned by channel. |
| **ScyllaDB** (2022–present) | A Cassandra-compatible, C++-based database chosen to eliminate garbage-collection pauses and fix "hot partition" latency cascades that plagued the Cassandra cluster at scale. | Trillions of chat messages — now Discord's primary messages datastore. |
| **Redis** (industry-standard for this role; Discord has referenced caching layers in its engineering writing) | Common choice for ephemeral, low-latency data. | Session state, presence data, caching layers — *typical usage pattern, not exhaustively confirmed in public posts.* |
| **Elasticsearch** (used for Discord's search feature, per public product behavior) | Enables full-text search across messages within a server. | Indexed message content for the in-app search feature. |

The Cassandra → ScyllaDB migration is worth understanding in detail because it's a genuinely instructive scaling story. <cite index="14-1">By 2022 Discord's Cassandra messages cluster had grown to 177 nodes and was suffering unpredictable latency, with maintenance operations becoming too expensive to run.</cite> <cite index="16-1">Cassandra's cascading latencies from "hot partitions" (high traffic concentrated on one partition) and its reliance on garbage collection were the two biggest pain points.</cite> <cite index="14-1">To buy time before the full migration, Discord's team built a new intermediary "data services" layer written in Rust, which performed request coalescing (serving many simultaneous requests for the same message with a single database call) and consistent hash-based routing to reduce hot-partition pressure.</cite>

The actual migration was executed with zero downtime. <cite index="17-1">The team ran dual writes to both Cassandra and ScyllaDB simultaneously, then needed to backfill historical data — a task ScyllaDB's own Spark-based migration tool estimated would take three months.</cite> <cite index="16-1">Considering that timeline unacceptable, engineers wrote a custom Rust-based migrator that read token ranges from Cassandra, checkpointed progress in SQLite for resumability, and wrote directly into ScyllaDB — pushing 3.2 million records per second and cutting the migration down to nine days.</cite> The results were dramatic: <cite index="17-1">the node count dropped from 177 Cassandra nodes to just 72 ScyllaDB nodes, while p99 read latency fell from a range of 40–125ms down to a steady 15ms, and p99 write latency dropped to 5ms.</cite>

**Lesson for students:** this is a textbook example of "the boring database swap you never hear about" being one of the highest-leverage engineering projects a company can run — most of the win came from smarter architecture (the Rust data-services layer) as much as from the new database itself.

---

## Infrastructure

- **Cloud provider — Google Cloud Platform (GCP).** Discord's own engineering talks (including ScyllaDB Summit presentations) describe designing storage topologies specifically tuned for low latency on GCP, using local SSDs mirrored via RAID to persistent disks for a balance of speed and durability.
- **Containers & orchestration** — Discord's services, particularly the Python API layer and various Rust/Go microservices, are widely understood to run in containerized, horizontally-scalable deployments (Docker + a Kubernetes-style orchestration layer), consistent with GCP-native deployment patterns. *This is standard industry practice for a company at Discord's scale; Discord has not published exhaustive detail on its container orchestration layer specifically.*
- **CDN** — Static assets, emoji, avatars, and attachment delivery rely on a CDN layer for low-latency global delivery — a near-universal requirement for any app serving hundreds of millions of users worldwide.
- **CI/CD** — Standard automated build/test/deploy pipelines are implied by Discord's fast, frequent client and service release cadence, though Discord hasn't published its specific CI/CD tooling.
- **Monitoring & observability** — Discord's Elixir team has spoken about heavy use of BEAM's built-in introspection tools (remote shell into any live node, process-level message-queue inspection) as a first-class debugging strategy, supplemented by dashboards for tracking traffic anomalies (this is literally how the team first noticed the MidJourney server's unusual load in 2022).
- **Logging** — Structured logging and dashboards are referenced throughout Discord's public engineering writing as the mechanism that first surfaces scaling problems (hot partitions, latency spikes) before they become outages.

---

## APIs & Services

- **Voice/Video — WebRTC + custom SFU (Selective Forwarding Unit) infrastructure**, using the Opus audio codec, for real-time calls and screen sharing.
- **Payments** — Discord Nitro subscriptions and server boosts require a payment processing integration (commonly understood to be a provider like Stripe for this class of consumer subscription business; not something Discord has detailed publicly).
- **Push notifications** — platform-native notification services (APNs for iOS, FCM for Android, OS-native notification APIs for desktop).
- **OAuth2** — Discord's own OAuth2 implementation powers third-party bot and app authorization, letting external services act on a user's behalf with scoped permissions.
- **Trust & Safety / ML moderation** — Discord runs ML-based classifiers for detecting abusive content and CSAM at platform scale, part of a dedicated Trust & Safety engineering function, per public company statements and job postings.
- **Search** — In-app message search, backed by an indexed search service (commonly Elasticsearch-class technology for this kind of full-text search at scale).
- **Storage** — Object storage for user-uploaded images, videos, and file attachments, almost certainly backed by GCP's Cloud Storage given Discord's broader GCP footprint.
- **Bots & Gateway API** — the WebSocket Gateway is Discord's most distinctive "external service": it's the same real-time event stream that powers the end-user client, exposed to third-party bot developers, allowing bots to receive live events instead of polling.

---

## Scaling Techniques

- **Actor-model process isolation.** <cite index="7-1">Instead of one massive web server handling all operations globally, Discord treats every chat community as an isolated, lightweight process in memory, so a spike or bug in one large community stays contained to that single process instead of crashing the system.</cite>
- **Vertical scaling, pushed hard, before going horizontal.** <cite index="6-1">Discord has intentionally pushed the limits of vertical scaling to minimize complexity and cost, scaling individual backend servers from handling tens of thousands of concurrent users up to nearly two million concurrent users on a single server.</cite>
- **Passive sessions & relay-based fan-out.** For extremely large guilds, sending every update to every member becomes prohibitively expensive as membership grows. Discord's engineering team has published on techniques including passive sessions (reducing per-user workload for less-active connections) and a relay system that distributes the fan-out work itself across multiple machines rather than a single guild process trying to push updates to everyone directly.
- **Database sharding/partitioning** — Cassandra and ScyllaDB messages are partitioned by channel, a scaling technique that trades off "hot partition" risk (very active channels) for otherwise-clean horizontal scalability.
- **Request coalescing.** The Rust-based "data services" layer sitting between the API and the database collapses many simultaneous identical requests (e.g., many users requesting the same message) into a single database call, cutting redundant load dramatically.
- **Language/runtime specialization.** Rather than one general-purpose stack, Discord routes each workload to the runtime best suited for it — Elixir/BEAM for massively concurrent, fault-isolated messaging; Rust for GC-sensitive, CPU-bound hot paths; Python for the more conventional CRUD REST API; C++ for media processing.
- **Horizontal scaling of the Elixir cluster** — distributing guild and session processes across hundreds of machines, coordinated via Distributed Erlang.

---

## Security & Reliability

- **OAuth2** for third-party application authorization with granular, scoped permissions.
- **Encrypted transport (TLS/HTTPS and encrypted WebSocket connections)** for all client-server communication — standard practice for any platform handling private messages at this scale.
- **Process-level fault isolation** via the Elixir/BEAM actor model — a crash in one guild's process does not cascade to others, and BEAM's supervision trees automatically restart failed processes.
- **Rate limiting** on both the REST API (well documented for third-party developers via Discord's API rate-limit headers) and, internally, on traffic to hot database partitions (part of the Rust data-services layer's job).
- **Trust & Safety / content moderation systems**, including automated classifiers for detecting policy-violating and illegal content, backed by human review and appeals workflows.
- **Zero-downtime migration practices** — as demonstrated by the Cassandra-to-ScyllaDB migration, which ran dual writes and extensive read-verification sampling before ever cutting traffic over, minimizing risk during infrastructure changes.
- **Operational monitoring for early detection** — the MidJourney traffic surge in 2022 was first flagged by operations dashboards, which is what let the team react before the community was forced off the platform by scaling limits.

---

## Performance Optimizations

- **Native/Rust NIFs for hot-path data structures** — instead of rewriting whole services, Discord selectively drops down into Rust only for the specific data structure or computation that's the actual bottleneck (e.g., the sorted-set Member List structure), keeping the surrounding system in the faster-to-develop Elixir.
- **Garbage-collection avoidance for latency-sensitive services** — both the Read States rewrite (Go → Rust) and the messages database migration (Cassandra → ScyllaDB) were driven substantially by wanting to eliminate GC-induced latency spikes, not just raw throughput.
- **Reverse-query optimization** — Discord worked directly with the ScyllaDB team to implement performant reverse queries (scanning messages in the opposite of their natural sort order), which had been a blocking gap before the migration could proceed.
- **Storage topology tuning** — using local SSDs mirrored to persistent disks via RAID for a combination of local-disk speed and cloud-persistent-disk durability.
- **CDN-based asset delivery** for avatars, emoji, and attachments to minimize latency for globally distributed users.
- **Client-side rendering efficiency** — React's component model plus state management (Redux-style) minimizes unnecessary re-renders in a UI that's constantly receiving real-time updates (typing indicators, presence changes, new messages).

---

## Engineering Challenges

**Fan-out at extreme scale.** <cite index="10-1">As guilds grow larger, distributing messages and events to more users creates exponentially more work for the single guild process coordinating that fan-out.</cite> <cite index="10-1">This came to a head in 2022 when the MidJourney community — which requires a Discord account to use — grew so quickly that its main server hit Discord's then-existing limit of around one million users on a single server.</cite> Discord's response involved a mix of passive sessions, distributing fan-out work via relays, and Rust-backed data structures for the Member List, ultimately unlocking multi-million-member guilds.

**Storing trillions of messages with predictable latency.** Covered in detail above — the Cassandra-to-ScyllaDB migration remains one of the most detailed public case studies of a large-scale, zero-downtime database migration in the industry.

**Low-latency voice/video at global scale.** Handled through a mix of WebRTC in the client, C++ for media processing, and a globally distributed voice-server footprint intended to route users to the lowest-latency regional server.

**Operating a huge platform with a small team.** <cite index="1-1">Perhaps the most striking detail in Discord's own engineering story is that just five engineers were responsible for the 20+ Elixir services handling millions of concurrent users and dozens of millions of messages per second</cite> — a direct result of choosing a runtime (BEAM) whose concurrency and fault-tolerance guarantees are handled by the platform itself rather than hand-rolled by application code.

**Fault tolerance.** The Actor Model isolation described earlier (each guild as its own process) is Discord's primary answer to "how do we prevent one bad interaction from taking down the whole platform."

---

## Infrastructure Cost Considerations

Discord has not published exact infrastructure spend, but its own public engineering narratives strongly imply where the bulk of cost pressure comes from:

- **Compute** — Hundreds of Elixir machines for messaging, 1000+ nodes for voice/video signaling and media, plus the Python API tier and Rust services layer, are likely the largest ongoing compute cost given the always-on, real-time nature of the platform.
- **Database infrastructure** — Even after the Cassandra-to-ScyllaDB migration reduced node count from 177 to 72 for the flagship messages cluster, this remains a very large, always-on stateful workload; database compute and storage together are almost certainly one of the top cost centers.
- **Storage** — Trillions of stored messages, plus all user-uploaded media (images, video, voice recordings for some features), represent substantial and continuously growing storage costs.
- **CDN & network egress** — Serving media and assets to hundreds of millions of globally distributed users generates significant bandwidth costs.
- **Trust & Safety / ML infrastructure** — Running classifiers across the platform's message and media volume at this scale is compute-intensive and easy to underestimate.
- **Monitoring/observability tooling** — Running dashboards, alerting, and log pipelines across hundreds of services and machines has real, non-trivial infrastructure cost, though it is dwarfed by the compute/storage/network categories above.

*(No specific dollar figures are invented here — Discord has not disclosed these publicly, and any number would be pure speculation.)*

---

## Student Version

You obviously won't be operating at Discord's scale — but you can build a genuinely useful mini-Discord clone using the same core ideas at a fraction of the complexity.

### Frontend
React (or Vue, if you're more comfortable there) with a simple global state store (React Context or Zustand — lighter than Redux for a learning project). Use `socket.io-client` to consume real-time events.

### Backend
Node.js with `socket.io` (or a lightweight framework like Fastify/Express) is a realistic free substitute for the Elixir Gateway concept — you won't get BEAM's fault-isolation guarantees, but you can absolutely replicate "one room = one set of connected sockets, fan out messages to everyone in the room" as a learning exercise. If you want to go further, Elixir + Phoenix Channels is free, open-source, and is literally the technology family Discord itself uses — a great choice if you want resume-relevant depth here.

### Database
PostgreSQL (free, and every cloud free tier supports it) for structured data — users, servers, channels, messages. Add Redis (also free at small scale, e.g., Upstash's free tier) for presence/session data and caching.

### Authentication
Firebase Auth or Supabase Auth — both have generous free tiers and handle password hashing, OAuth (GitHub/Google login), and session tokens for you, so you can focus on the real-time messaging logic instead of reinventing auth.

### Storage
Supabase Storage or Cloudflare R2 free tier for user-uploaded avatars/attachments — both are S3-compatible and cheap-to-free at hobby scale.

### Deployment
Frontend on Vercel or Netlify (both free for personal projects); backend on Railway, Render, or Fly.io (all have usable free/cheap tiers for a small real-time Node.js or Elixir service).

This gives you a project that demonstrates real understanding of the same fundamental problems Discord solves — real-time fan-out, presence, persistent chat history — without needing anything beyond free-tier infrastructure.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend (Web/Desktop) | React, TypeScript, Redux-style store | Component-based real-time UI |
| Desktop Shell | Electron | Cross-platform native app from web codebase |
| Real-time Media | WebRTC, native C/C++ modules | Voice/video calls, screen share |
| Real-time Messaging Backend | Elixir / BEAM VM | Guild & session process management, message fan-out |
| Performance-Critical Services | Rust | Read States service, data-services layer, custom data structures |
| Public REST API | Python | CRUD operations for clients & bots |
| Voice/Video Media Processing | C++ | Audio/video encoding & streaming at scale |
| Messages Database | ScyllaDB (migrated from Cassandra, originally MongoDB) | Trillions of chat messages |
| Caching / Session Data | Redis (industry-standard inference) | Low-latency ephemeral data |
| Search | Elasticsearch-class technology | In-app message search |
| Cloud Provider | Google Cloud Platform | Compute, storage, networking |
| Interop layer (Elixir↔Rust) | Rustler (NIFs) | High-performance data structures inside Elixir services |
| Auth | OAuth2 | Bot/app authorization |

---

## Engineering Lessons

1. **Pick the runtime for the problem, not the company's "default stack."** Discord runs Elixir, Rust, Python, and C++ side by side — each chosen for what it's uniquely good at.
2. **Isolate failure domains aggressively.** One guild's crash shouldn't be able to take down another guild's experience — process-per-tenant isolation is a powerful, generalizable pattern.
3. **Don't rewrite everything in a "faster" language reflexively.** Discord rewrote *specific, profiled bottlenecks* (Read States, one data structure) in Rust — not the whole platform.
4. **Garbage collection is a real, measurable latency tax** in systems with strict real-time requirements — profile before assuming your language choice is "fast enough."
5. **A boring database swap can be your highest-leverage project.** The Cassandra-to-ScyllaDB migration reduced node count by more than half and cut tail latency by an order of magnitude.
6. **Build an intermediary service layer before you need it.** Discord's Rust "data services" layer (request coalescing, hot-partition protection) bought them the runway to plan a safe migration instead of firefighting indefinitely.
7. **Zero-downtime migrations are achievable with dual writes and careful verification** — not magic, just disciplined engineering process.
8. **Small, senior teams can operate massive systems** if the underlying platform (BEAM, in Discord's case) absorbs the complexity of concurrency and fault tolerance.
9. **Vertical scaling isn't old-fashioned** — pushing a single server further before reaching for horizontal complexity kept Discord's architecture simpler for longer.
10. **Instrument before you optimize.** Discord's engineers repeatedly describe using process-level introspection and dashboards to find the *actual* bottleneck before writing a line of optimization code.
11. **Design for organic, unpredictable growth.** The MidJourney server's overnight surge wasn't planned for — resilient architecture absorbed it instead of collapsing under it.
12. **Open-source what you build for internal scaling problems when you can** — Discord has released tools like Manifold (batch message passing for Erlang/Elixir) back to the community, which both helps others and forces cleaner internal design.

---

## References

- Discord Engineering Blog — [Using Rust to Scale Elixir for 11 Million Concurrent Users](https://discord.com/blog/using-rust-to-scale-elixir-for-11-million-concurrent-users)
- Discord Engineering Blog — [Why Discord is Switching from Go to Rust](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)
- Discord Engineering Blog — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)
- The Elixir Programming Language Blog — [Real-time Communication at Scale with Elixir at Discord](https://elixir-lang.org/blog/2020/10/08/real-time-communication-at-scale-with-elixir-at-discord/)
- ScyllaDB — [How Discord Migrated Trillions of Messages from Cassandra to ScyllaDB](https://www.scylladb.com/tech-talk/how-discord-migrated-trillions-of-messages-from-cassandra-to-scylladb/) (ScyllaDB Summit talk by Bo Ingram, Discord Senior Software Engineer)
- InfoQ — [Discord Migrates Trillions of Messages from Cassandra to ScyllaDB](https://www.infoq.com/news/2023/06/discord-cassandra-scylladb/)
- The New Stack — [How Discord Migrated Trillions of Messages to ScyllaDB](https://thenewstack.io/how-discord-migrated-trillions-of-messages-to-scylladb/)
- ByteByteGo — [How Discord Serves 15-Million Users on One Server](https://blog.bytebytego.com/p/how-discord-serves-15-million-users)
- Discord Developer Portal — [Official API & OAuth2 Documentation](https://discord.com/developers/docs/intro)

---

*Note: Where Discord has not officially confirmed a specific technology (e.g., exact caching layer, container orchestration tooling, payment provider), this article explicitly flags it as a reasonable industry-standard inference rather than confirmed fact.*
