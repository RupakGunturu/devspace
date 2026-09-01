import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Section {
  id: string;
  title: string;
  cards: { heading: string; content: string }[];
}

const SECTIONS: Section[] = [
  {
    id: "load-balancing",
    title: "Load Balancing",
    cards: [
      {
        heading: "Round Robin",
        content:
          "Distribute requests sequentially across servers. Simple, no state needed. Works when servers have equal capacity.",
      },
      {
        heading: "Least Connections",
        content:
          "Route to server with fewest active connections. Better for uneven workloads or long-lived connections.",
      },
      {
        heading: "IP Hash",
        content:
          "Hash client IP to determine server. Provides session stickiness without shared state. Risk of uneven distribution.",
      },
      {
        heading: "L4 vs L7",
        content:
          "L4 (transport): fast, routes by IP/port. L7 (application): content-aware, supports path-based routing, SSL termination, header inspection.",
      },
      {
        heading: "Health Checks",
        content:
          "Periodically probe servers. Remove unhealthy from pool. Support active (HTTP ping) and passive (error rate) checks.",
      },
    ],
  },
  {
    id: "caching",
    title: "Caching",
    cards: [
      {
        heading: "Cache-Aside",
        content:
          "App checks cache first, on miss reads DB and populates cache. Most common pattern. Simple but stale data possible on write-through delay.",
      },
      {
        heading: "Write-Through",
        content:
          "Write to cache and DB simultaneously. Strong consistency but higher write latency. Good for data read more than written.",
      },
      {
        heading: "Write-Behind",
        content:
          "Write to cache, async flush to DB. Fast writes, risk of data loss. Batch writes reduce DB load.",
      },
      {
        heading: "Eviction Policies",
        content:
          "LRU: evict least recently used. LFU: evict least frequently used. TTL: time-based expiration. FIFO: first in, first out.",
      },
      {
        heading: "Redis vs Memcached",
        content:
          "Redis: data structures, persistence, replication. Memcached: simpler, multi-threaded, better for pure key-value caching at scale.",
      },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    cards: [
      {
        heading: "SQL (RDBMS)",
        content:
          "ACID, relational integrity, joins. PostgreSQL, MySQL. Good for structured data with complex queries. Vertical scaling primary.",
      },
      {
        heading: "NoSQL - Document",
        content:
          "MongoDB, CouchDB. Flexible schema, JSON-like documents. Good for evolving data models. Eventual consistency common.",
      },
      {
        heading: "NoSQL - Key-Value",
        content:
          "Redis, DynamoDB. O(1) lookups. Simple but no complex queries. Great for sessions, caching, counters.",
      },
      {
        heading: "NoSQL - Wide Column",
        content:
          "Cassandra, HBase. Optimized for writes. Partition key + clustering key. Excellent write throughput, denormalized design.",
      },
      {
        heading: "Sharding",
        content:
          "Split data across nodes by shard key. Adds complexity for joins, cross-shard queries. Consistent hashing reduces rebalancing.",
      },
    ],
  },
  {
    id: "message-queues",
    title: "Message Queues",
    cards: [
      {
        heading: "Kafka",
        content:
          "Distributed log. High throughput, durable, ordered per partition. Great for event streaming, log aggregation, CDC. Consumer groups for parallelism.",
      },
      {
        heading: "RabbitMQ",
        content:
          "Traditional message broker. Flexible routing (exchanges), acknowledgments, priority queues. Good for task queues, RPC.",
      },
      {
        heading: "SQS",
        content:
          "AWS managed queue. Standard (at-least-once, best-effor ordering) vs FIFO (exactly-once, ordered). Auto-scaling, dead letter queues.",
      },
      {
        heading: "Pub/Sub vs Queue",
        content:
          "Pub/Sub: all subscribers get message (broadcast). Queue: one consumer processes each message (competing consumers).",
      },
      {
        heading: "Idempotency",
        content:
          "Messages may be delivered multiple times. Design consumers to be idempotent. Use unique message IDs to deduplicate.",
      },
    ],
  },
  {
    id: "cdns",
    title: "CDNs",
    cards: [
      {
        heading: "How CDN Works",
        content:
          "Cache static assets at edge PoPs. Request routed to nearest edge. Reduces latency, bandwidth, origin load.",
      },
      {
        heading: "Push vs Pull CDN",
        content:
          "Push: upload to CDN proactively (predictable content). Pull: CDN fetches from origin on first request (lazy caching).",
      },
      {
        heading: "Cache Invalidation",
        content:
          "TTL-based expiration. Versioned URLs (cache busting). Purge API for immediate invalidation. Content hashing for automatic invalidation.",
      },
      {
        heading: "CloudFront / Cloudflare",
        content:
          "CloudFront: AWS, deep integration, Lambda@Edge. Cloudflare: DDoS protection, WAF, Workers for edge compute.",
      },
    ],
  },
  {
    id: "cap-theorem",
    title: "CAP Theorem",
    cards: [
      {
        heading: "The Theorem",
        content:
          "Distributed system can guarantee at most 2 of 3: Consistency (all nodes see same data), Availability (every request gets response), Partition tolerance (network split handled).",
      },
      {
        heading: "CP Systems",
        content:
          "Consistency + Partition tolerance. Sacrifice availability during partitions. Examples: ZooKeeper, etcd, HBase, MongoDB (strong mode).",
      },
      {
        heading: "AP Systems",
        content:
          "Availability + Partition tolerance. Sacrifice consistency. Examples: Cassandra, DynamoDB, CouchDB, Riak.",
      },
      {
        heading: "CA Systems",
        content:
          "Consistency + Availability (no partitions). Only possible in single-node or tightly-coupled clusters. Not realistic for distributed systems.",
      },
      {
        heading: "PACELC",
        content:
          "Extension of CAP. If Partition: choose A or C. Else: choose Latency or Consistency. Captures the full tradeoff space for real systems.",
      },
    ],
  },
];

export function SystemDesignCheatsheet() {
  const { color } = useToolAccent();
  const [activeTab, setActiveTab] = useState(SECTIONS[0].id);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.cards.some(
          (c) => c.heading.toLowerCase().includes(q) || c.content.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  const activeSection = filtered.find((s) => s.id === activeTab) ?? filtered[0];

  return (
    <ToolLayout id="system-design-cheatsheet">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Search all sections
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. consistency, redis, kafka, sharding..."
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line bg-input-bg p-6 text-center">
          <p className="text-sm text-muted">No sections match &quot;{search}&quot;</p>
        </div>
      )}

      {filtered.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {filtered.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className="rounded-md border-2 px-3 py-1.5 font-mono text-xs font-medium transition-all"
                style={{
                  borderColor: activeSection.id === section.id ? color : "var(--border)",
                  backgroundColor: activeSection.id === section.id ? color : "transparent",
                  color: activeSection.id === section.id ? "#fff" : "var(--muted)",
                }}
              >
                {section.title}
              </button>
            ))}
          </div>

          {activeSection && (
            <div className="space-y-3">
              {activeSection.cards.map((card) => (
                <div
                  key={card.heading}
                  className="rounded-lg border-2 border-line bg-input-bg p-4 transition-all hover:border-accent"
                >
                  <h3 className="mb-1.5 font-mono text-sm font-bold" style={{ color }}>
                    {card.heading}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{card.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {search.trim() && filtered.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            All matching cards ({filtered.reduce((acc, s) => acc + s.cards.length, 0)})
          </span>
          <div className="space-y-2">
            {filtered.flatMap((s) =>
              s.cards
                .filter(
                  (c) =>
                    !search.trim() ||
                    c.heading.toLowerCase().includes(search.toLowerCase()) ||
                    c.content.toLowerCase().includes(search.toLowerCase()),
                )
                .map((c) => (
                  <div
                    key={`${s.id}-${c.heading}`}
                    className="rounded-md border border-line bg-paper-dim/20 p-3"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold"
                        style={{ backgroundColor: color, color: "#fff" }}
                      >
                        {s.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {c.heading}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{c.content}</p>
                  </div>
                )),
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
