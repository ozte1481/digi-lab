import type { ThemeCollection } from "../types";
import japaneseData from "./japanese.json";

type ThemeJsonRecord = Record<string, { name: string; short: string[]; long: string[] }>;

const fromJson = (source: ThemeJsonRecord): ThemeCollection =>
  Object.entries(source).reduce<ThemeCollection>((acc, [key, value]) => {
    acc[key] = {
      name: value.name,
      short: value.short,
      long: value.long,
    };
    return acc;
  }, {} as ThemeCollection);

export const japaneseThemes: ThemeCollection = fromJson(
  japaneseData as ThemeJsonRecord
);

export const englishThemes: ThemeCollection = {
  "communication": {
    "name": "Communication",
    "short": [
      "Active listening builds trust in any conversation.",
      "Summarizing action items keeps meetings productive.",
      "Clear subject lines invite faster email responses.",
      "Visual aids reinforce complex explanations.",
      "Documenting decisions prevents scope creep later.",
      "Empathy de-escalates tense discussions before they grow.",
      "Public speaking improves with deliberate practice.",
      "Open questions encourage diverse perspectives.",
      "Preparing examples adds credibility to a presentation.",
      "Concise messages respect the reader's time."
    ],
    "long": [
      "Effective communication balances clarity with empathy. Understanding the audience helps tailor vocabulary, tone, and pacing.",
      "Distributed teams rely on written updates to stay aligned. Templates and shared glossaries reduce ambiguity across time zones.",
      "Constructive feedback highlights observations and suggestions. Combining praise with growth points encourages continuous improvement."
    ]
  },
  "business": {
    "name": "Business",
    "short": [
      "A mission statement explains the organization's purpose.",
      "Cash flow metrics reveal operational resilience.",
      "Customer interviews inform product roadmaps.",
      "Key results translate strategy into daily actions.",
      "Portfolio diversification cushions external shocks.",
      "Negotiations thrive when long-term value is shared.",
      "Ethical governance builds stakeholder confidence.",
      "Transparent reporting improves accountability.",
      "Experiments uncover new business opportunities.",
      "Continuous learning keeps teams adaptable."
    ],
    "long": [
      "Business strategy is a living process that reacts to data and feedback. Scenario planning helps teams test assumptions before committing resources.",
      "Sustainable management integrates environmental and social indicators into performance reviews. Stakeholders expect visibility into progress.",
      "Innovation programs flourish when experimentation is rewarded and lessons learned are shared openly across departments."
    ]
  },
  "wellbeing": {
    "name": "Well-being",
    "short": [
      "Regular breaks reset concentration during deep work.",
      "Quality sleep supports immune response and memory.",
      "Balanced nutrition stabilizes energy throughout the day.",
      "Mindfulness practices reduce stress hormones.",
      "Exercise improves mood through endorphin release.",
      "Gratitude journals reinforce a growth mindset.",
      "Healthy boundaries keep workloads sustainable.",
      "Support networks make challenges easier to navigate.",
      "Creative hobbies unlock fresh perspectives.",
      "Digital detox routines protect long-term focus."
    ],
    "long": [
      "Well-being rests on the balance of body, mind, and relationships. Small daily habits compound into long-term resilience.",
      "Organizations that respect downtime see higher engagement and retention. Flexible schedules acknowledge modern lifestyles.",
      "Community support programs normalize conversations about mental health and encourage early intervention."
    ]
  }
};

export const programmingThemes: ThemeCollection = {
  "frontend": {
    "name": "Front-end",
    "short": [
      "const heading = document.querySelector('h1');",
      "setState(prev => ({ ...prev, loading: true }));",
      "const total = items.reduce((sum, item) => sum + item.price, 0);",
      "useEffect(() => scrollTo(0, 0), [pathname]);",
      "const isMobile = window.matchMedia('(max-width: 640px)').matches;",
      "style.setProperty('--row-count', String(rows.length));",
      "const memoized = useMemo(() => heavyCalc(data), [data]);",
      "return <Suspense fallback={<Spinner />}>{children}</Suspense>;",
      "const formData = Object.fromEntries(new FormData(form));",
      "const list = data.filter(item => item.visible);"
    ],
    "long": [
      "import { useEffect } from 'react';\n\nexport function useFocusTrap(ref: React.RefObject<HTMLElement>) {\n  useEffect(() => {\n    const root = ref.current;\n    if (!root) return;\n\n    const handleKeyDown = (event: KeyboardEvent) => {\n      if (event.key !== 'Tab') return;\n      const focusable = root.querySelectorAll<HTMLElement>(\n        'a[href], button, textarea, input, select, [tabindex]:not([tabindex=\"-1\"])'\n      );\n      if (focusable.length === 0) return;\n      const first = focusable[0];\n      const last = focusable[focusable.length - 1];\n      if (event.shiftKey && document.activeElement === first) {\n        event.preventDefault();\n        last.focus();\n      } else if (!event.shiftKey && document.activeElement === last) {\n        event.preventDefault();\n        first.focus();\n      }\n    };\n\n    root.addEventListener('keydown', handleKeyDown);\n    return () => root.removeEventListener('keydown', handleKeyDown);\n  }, [ref]);\n}",
      "import { Fragment } from 'react';\n\nexport function Breadcrumb({ items }: { items: string[] }) {\n  return (\n    <nav aria-label='Breadcrumb'>\n      <ol className='flex items-center gap-2 text-sm text-muted-foreground'>\n        {items.map((item, index) => (\n          <Fragment key={item}>\n            <li className='font-medium text-foreground'>{item}</li>\n            {index < items.length - 1 && <span>/</span>}\n          </Fragment>\n        ))}\n      </ol>\n    </nav>\n  );\n}",
      "import { useState } from 'react';\n\nexport function FilterPills({ options }: { options: string[] }) {\n  const [selected, setSelected] = useState<string[]>([]);\n\n  const toggle = (value: string) => {\n    setSelected(prev =>\n      prev.includes(value) ? prev.filter(item => item != value) : [...prev, value]\n    );\n  };\n\n  return (\n    <div className='flex flex-wrap gap-2'>\n      {options.map(option => (\n        <button\n          key={option}\n          onClick={() => toggle(option)}\n          className={selected.includes(option) ? 'bg-primary text-primary-foreground' : 'bg-muted'}\n        >\n          {option}\n        </button>\n      ))}\n    </div>\n  );\n}"
    ]
  },
  "backend": {
    "name": "Back-end",
    "short": [
      "app.use(express.json());",
      "const id = crypto.randomUUID();",
      "await prisma.user.create({ data: payload });",
      "router.get('/health', (_req, res) => res.json({ ok: true }));",
      "const client = await pool.connect();",
      "await redis.setex(cacheKey, 300, JSON.stringify(value));",
      "const hash = await bcrypt.hash(password, 12);",
      "queue.add('send-email', { to, template });",
      "res.setHeader('Cache-Control', 'no-store');",
      "return reply.status(204).send();"
    ],
    "long": [
      "import { Router } from 'express';\nimport { z } from 'zod';\n\nconst schema = z.object({\n  email: z.string().email(),\n  message: z.string().min(10),\n});\n\nexport function createFeedbackRouter(repository: FeedbackRepository) {\n  const router = Router();\n\n  router.post('/', async (req, res, next) => {\n    try {\n      const payload = schema.parse(req.body);\n      await repository.save(payload);\n      res.status(201).json({ ok: true });\n    } catch (error) {\n      next(error);\n    }\n  });\n\n  return router;\n}",
      "import { Pool } from 'pg';\n\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\n\nexport async function listRecentPosts(limit = 20) {\n  const client = await pool.connect();\n  try {\n    const { rows } = await client.query(\n      'SELECT id, title, published_at FROM posts ORDER BY published_at DESC LIMIT ',\n      [limit]\n    );\n    return rows;\n  } finally {\n    client.release();\n  }\n}",
      "import type { FastifyInstance } from 'fastify';\n\nexport async function registerHealthEndpoint(app: FastifyInstance) {\n  app.get('/healthz', async () => ({ status: 'ok', time: Date.now() }));\n}"
    ]
  },
  "algorithms": {
    "name": "Algorithms",
    "short": [
      "function sum(nums) { return nums.reduce((a, b) => a + b, 0); }",
      "const sorted = [...values].sort((a, b) => a.localeCompare(b));",
      "for (const node of graph) queue.push(node);",
      "const unique = Array.from(new Set(items));",
      "while (left < right) { const mid = Math.floor((left + right) / 2); }",
      "const memo = new Map<string, number>();",
      "if (pattern.test(input)) matches.push(input);",
      "return arr.map((value, index) => [value, index]);",
      "const reversed = [...text].reverse().join('');",
      "numbers.filter(n => n % 2 === 0);"
    ],
    "long": [
      "export function binarySearch(list: number[], target: number): number {\n  let low = 0;\n  let high = list.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    const guess = list[mid];\n    if (guess === target) return mid;\n    if (guess > target) {\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return -1;\n}",
      "export function breadthFirst(start: string, graph: Record<string, string[]>) {\n  const queue = [start];\n  const visited = new Set<string>([start]);\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    for (const next of graph[node] ?? []) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        queue.push(next);\n      }\n    }\n  }\n  return visited;\n}",
      "export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 200) {\n  let timer: ReturnType<typeof setTimeout> | null = null;\n  return (...args: Parameters<T>) => {\n    if (timer) clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}"
    ]
  }
};
