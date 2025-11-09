from pathlib import Path
from textwrap import dedent
import json

japanese = {
    "society": {
        "name": "社会・文化",
        "short": [
            "言語は社会の価値観を伝える土台です。",
            "季節の行事は地域の結びつきを強めます。",
            "ニュースを読み比べると多様な視点に気づきます。",
            "図書館は世代を超えて知識を共有する場所です。",
            "地域ボランティアは暮らしを支える大切な力です。",
            "伝統芸能は歴史と美意識を受け継ぎます。",
            "観光産業は地域経済と文化の発信に寄与します。",
            "高齢社会では医療と福祉の連携が欠かせません。",
            "災害対策は日頃の訓練と備蓄から始まります。",
            "多文化共生は相互理解と寛容から育ちます。"
        ],
        "long": [
            "日本社会は人口減少と高齢化が同時に進む中で、働き方の柔軟化や地域包括ケアが重要なテーマとなっています。自治体や企業が連携し、世代間交流の場を整えることで暮らしの安心感が高まります。",
            "文化芸術は地域の魅力を高めるだけでなく、教育の現場で創造力を育む役割も担っています。学校と地域が協力して伝統文化を学ぶ取り組みが各地で広がっています。",
            "災害の多い日本では自助・共助・公助のバランスが欠かせません。避難経路の確認や地域訓練への参加など、日常から備える姿勢が社会全体のレジリエンスを高めます。"
        ],
    },
    "economics": {
        "name": "経済",
        "short": [
            "需要と供給は価格の方向性を左右します。",
            "インフレ率は家計の購買力に影響します。",
            "中央銀行は金利を通じて景気を調整します。",
            "為替レートは貿易企業の収益を左右します。",
            "GDPは国内で生み出された付加価値の総計です。",
            "企業は利益と社会的責任の両立を求められます。",
            "家計の貯蓄は投資や将来不安への備えになります。",
            "財政政策は公共サービスと税制で需要を調整します。",
            "国際取引は比較優位に基づいて構造が決まります。",
            "テクノロジー投資は生産性を引き上げる鍵です。"
        ],
        "long": [
            "マクロ経済では政府支出や税制改正などの財政政策と、金利操作を中心とした金融政策が景気循環に大きな影響を及ぼします。データを活用した迅速な政策決定が求められています。",
            "企業経営では気候変動リスクやサプライチェーンのレジリエンスが重要なテーマになりました。ESGを意識した経営は投資家からの信頼を高め、市場での評価につながります。",
            "個人投資では長期の資産形成とリスク分散が基本です。積立投資や分散投資を通じて市場の変動に備える戦略が広がっています。"
        ],
    },
    "science": {
        "name": "科学・技術",
        "short": [
            "気候モデルは将来の気象変動を予測します。",
            "量子コンピュータは特定の計算を高速化します。",
            "再生医療は細胞を用いて臓器機能を補います。",
            "ロボティクスは危険環境での作業を支援します。",
            "人工衛星は地球観測と通信を支えています。",
            "AIはデータの特徴を学習して意思決定を支援します。",
            "電池技術の進歩は再生可能エネルギーを後押しします。",
            "宇宙探査は惑星の成り立ちを解き明かします。",
            "遺伝子解析は個別化医療の基盤を提供します。",
            "サイバーセキュリティは社会インフラの防御に不可欠です。"
        ],
        "long": [
            "科学技術の進歩は生活を豊かにする一方で、新たな倫理的課題も生み出します。研究成果を社会に実装する際は、透明性と合意形成が欠かせません。",
            "データサイエンスは自然科学と社会科学の橋渡しを行い、複雑な現象の理解を助けます。観測データとシミュレーションを組み合わせることで政策立案に役立つ洞察が得られます。",
            "サステナブルな技術開発にはライフサイクル全体での環境影響評価が必要です。製造から廃棄までの過程を可視化し、資源循環を前提とした設計が求められています。"
        ],
    },
    "history": {
        "name": "歴史",
        "short": [
            "考古学は遺構から当時の暮らしを再構成します。",
            "古文書は政治の意思決定過程を読み解く資料です。",
            "産業革命は社会構造と労働観を大きく変えました。",
            "近代化は教育制度の整備とともに進みました。",
            "戦後復興は国際協調と国内改革の両輪で進展しました。",
            "文化交流は地域固有の芸術を発展させました。",
            "外交史は国益と価値観の調整を描き出します。",
            "都市史は暮らしとインフラの変遷を映し出します。",
            "女性史は社会参画の歩みを記録しています。",
            "環境史は自然と人間活動の関係を教えてくれます。"
        ],
        "long": [
            "歴史研究は一次資料の読み込みから始まります。文献や遺物を複数の視点で比較し、当時の価値観や制度を浮かび上がらせます。",
            "地域史では地形や産業構造といった要素が人々の暮らしにどのような影響を与えたのかを探ります。生活文化を丹念に追うことで地域の個性が見えてきます。",
            "歴史を学ぶことは、過去の成功例や失敗例から学びを得て現在の課題解決に生かすことでもあります。史料批判と解釈の両面から考える姿勢が大切です。"
        ],
    },
}

english = {
    "communication": {
        "name": "Communication",
        "short": [
            "Active listening builds rapport with any audience.",
            "Well-structured agendas keep meetings focused.",
            "Clear subject lines improve email response rates.",
            "Paraphrasing confirms mutual understanding.",
            "Storytelling transforms data into memorable insights.",
            "Visual aids highlight the core message quickly.",
            "Empathy defuses tense conversations before they escalate.",
            "Documenting decisions prevents scope creep later on.",
            "Constructive feedback pairs observations with suggestions.",
            "Consistent tone strengthens brand trust online."
        ],
        "long": [
            "Effective communication balances clarity and empathy. Speakers tailor vocabulary and pace to the audience, while listeners ask clarifying questions to surface assumptions.",
            "Distributed teams rely on written updates to stay aligned. Shared templates and checklists reduce misunderstandings across time zones.",
            "Feedback cultures thrive when praise and improvement points are both concrete. Celebrating small wins keeps motivation high during long projects."
        ],
    },
    "business": {
        "name": "Business",
        "short": [
            "Mission statements explain why the organization exists.",
            "Cash flow metrics reveal operational resilience.",
            "Customer interviews guide product roadmaps.",
            "Key results translate strategy into measurable targets.",
            "Portfolio diversification cushions market shocks.",
            "Negotiations succeed when value is created for both sides.",
            "Brand narratives shape long-term loyalty.",
            "Ethical governance strengthens stakeholder confidence.",
            "Remote teams need explicit handoffs and timelines.",
            "Continuous learning keeps companies adaptive."
        ],
        "long": [
            "Strategy is a living process that responds to data and human judgment. Scenario planning allows leadership teams to test assumptions before committing resources.",
            "Sustainable management integrates environmental and social indicators into reporting frameworks. Transparent metrics help stakeholders evaluate progress.",
            "Innovation programs prosper when experimentation is rewarded and lessons learned are shared openly across departments."
        ],
    },
    "technology": {
        "name": "Technology",
        "short": [
            "Modular architecture simplifies long-term maintenance.",
            "API contracts allow independent deployment cycles.",
            "Observability tools surface regressions quickly.",
            "Continuous delivery shortens feedback loops.",
            "Security reviews should accompany every major change.",
            "Edge computing reduces latency for real-time workloads.",
            "Accessible design expands reach to more users.",
            "Automated tests guard core business flows overnight.",
            "Data catalogues clarify ownership and lineage.",
            "Incident retrospectives focus on systems, not blame."
        ],
        "long": [
            "High-performing engineering teams blend craftsmanship with automation. Investing in developer experience pays dividends in cycle time and reliability.",
            "Cloud-native systems embrace redundancy and graceful degradation. Observability—logs, metrics, traces—provides the visibility needed to operate at scale.",
            "Governance frameworks outline how data is collected, processed, and retained. Clear policies build customer trust and simplify compliance audits."
        ],
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
            "Well-being rests on the balance of body, mind, and relationships. Small daily habits like stretching and hydration compound into long-term resilience.",
            "Organizations that respect downtime see higher engagement and retention. Flexible scheduling acknowledges the realities of modern life.",
            "Community spaces and peer support programs normalize conversations about mental health and encourage early intervention."
        ],
    },
}

programming = {
    "frontend": {
        "name": "フロントエンド",
        "short": [
            "const heading = document.querySelector('h1');",
            "setState(prev => ({ ...prev, loading: true }));",
            "<button type=\"button\" aria-label=\"Close\"></button>",
            "const total = cartItems.reduce((sum, item) => sum + item.price, 0);",
            "useEffect(() => scrollTo(0, 0), [pathname]);",
            "const isMobile = window.matchMedia('(max-width: 640px)').matches;",
            "style.setProperty('--row-count', String(rows.length));",
            "const memoized = useMemo(() => heavyCalc(data), [data]);",
            "return <Suspense fallback={<Spinner />}>{children}</Suspense>;",
            "const formData = Object.fromEntries(new FormData(form));"
        ],
        "long": [
            dedent("""
            import { useEffect } from "react";

            export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
              useEffect(() => {
                const start = ref.current;
                if (!start) return;

                const handler = (event: KeyboardEvent) => {
                  if (event.key !== "Tab") return;
                  const focusable = start.querySelectorAll<HTMLElement>(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                  );
                  if (focusable.length === 0) return;

                  const first = focusable[0];
                  const last = focusable[focusable.length - 1];

                  if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                  } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                  }
                };

                start.addEventListener("keydown", handler);
                return () => start.removeEventListener("keydown", handler);
              }, [ref]);
            }
            """).strip(),
            dedent("""
            import { Fragment } from "react";

            export function Breadcrumb({ items }: { items: string[] }) {
              return (
                <nav aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    {items.map((item, index) => (
                      <Fragment key={item}>
                        <li className="font-medium text-foreground">{item}</li>
                        {index < items.length - 1 && <span>/</span>}
                      </Fragment>
                    ))}
                  </ol>
                </nav>
              );
            }
            """).strip(),
            dedent("""
            import { useState } from "react";

            export function FilterPills({ options }: { options: string[] }) {
              const [selected, setSelected] = useState<string[]>([]);

              const toggle = (value: string) => {
                setSelected((prev) =>
                  prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
                );
              };

              return (
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggle(option)}
                      className={selected.includes(option) ? "bg-primary text-primary-foreground" : "bg-muted"}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              );
            }
            """).strip(),
        ],
    },
    "backend": {
        "name": "バックエンド",
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
            dedent("""
            import { Router } from "express";
            import { z } from "zod";

            const schema = z.object({
              email: z.string().email(),
              message: z.string().min(10),
            });

            export function createFeedbackRouter(repository: FeedbackRepository) {
              const router = Router();

              router.post('/', async (req, res, next) => {
                try {
                  const payload = schema.parse(req.body);
                  await repository.save(payload);
                  res.status(201).json({ ok: true });
                } catch (error) {
                  next(error);
                }
              });

              return router;
            }
            """).strip(),
            dedent("""
            import { Pool } from "pg";

            const pool = new Pool({ connectionString: process.env.DATABASE_URL });

            export async function listRecentPosts(limit = 20) {
              const client = await pool.connect();
              try {
                const { rows } = await client.query(
                  'SELECT id, title, published_at FROM posts ORDER BY published_at DESC LIMIT ',
                  [limit]
                );
                return rows;
              } finally {
                client.release();
              }
            }
            """).strip(),
            dedent("""
            import type { FastifyInstance } from "fastify";

            export async function registerHealthEndpoint(app: FastifyInstance) {
              app.get('/healthz', async () => ({ status: 'ok', time: Date.now() }));
            }
            """).strip(),
        ],
    },
    "algorithms": {
        "name": "アルゴリズム",
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
            "numbers.filter((n) => n % 2 === 0);"
        ],
        "long": [
            dedent("""
            export function binarySearch(list: number[], target: number): number {
              let low = 0;
              let high = list.length - 1;

              while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const guess = list[mid];

                if (guess === target) return mid;
                if (guess > target) {
                  high = mid - 1;
                } else {
                  low = mid + 1;
                }
              }

              return -1;
            }
            """).strip(),
            dedent("""
            export function breadthFirst(start: string, graph: Record<string, string[]>) {
              const queue = [start];
              const visited = new Set<string>([start]);

              while (queue.length > 0) {
                const node = queue.shift()!;
                for (const next of graph[node] ?? []) {
                  if (!visited.has(next)) {
                    visited.add(next);
                    queue.push(next);
                  }
                }
              }

              return visited;
            }
            """).strip(),
            dedent("""
            export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 200) {
              let timer: ReturnType<typeof setTimeout> | null = null;
              return (...args: Parameters<T>) => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                  fn(...args);
                }, delay);
              };
            }
            """).strip(),
        ],
    },
}


def ts_repr(value: str) -> str:
    if "\n" in value:
        escaped = value.replace("", "\\")
        return f"{escaped}"
    return json.dumps(value, ensure_ascii=True)


def write_collection(var_name: str, data: dict) -> str:
    lines = [f"export const {var_name}: ThemeCollection = {{\n"]
    for key, block in data.items():
        lines.append(f"  {key}: {{\n")
        lines.append(f"    name: {ts_repr(block['name'])},\n")
        lines.append("    short: [\n")
        for item in block['short']:
            lines.append(f"      {ts_repr(item)},\n")
        lines.append("    ],\n")
        lines.append("    long: [\n")
        for item in block['long']:
            lines.append(f"      {ts_repr(item)},\n")
        lines.append("    ],\n")
        lines.append("  },\n")
    lines.append("};\n")
    return ''.join(lines)

out = ["import type { ThemeCollection } from '../types';\n\n"]
out.append(write_collection('japaneseThemes', japanese))
out.append('\n')
out.append(write_collection('englishThemes', english))
out.append('\n')
out.append(write_collection('programmingThemes', programming))

Path(r"C:\Users\ozawa1481\アプリ開発\typing-app\app\data\themes.ts").write_text(''.join(out), encoding='utf-8')
