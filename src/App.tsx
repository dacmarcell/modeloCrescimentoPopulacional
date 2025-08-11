import { useState, useEffect, useMemo, useRef } from "react";
import { Line } from "recharts";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = { year: number; population: number };

type Preset = {
  id: string;
  name: string;
  modelType: "exponential" | "logistic";
  initialPopulation: number;
  growthRate: number;
  carryingCapacity: number;
  timeSpan: number;
};

// Import JSON presets (Vite supports JSON imports)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import presetsRaw from "./assets/presets.json";
const PRESETS = presetsRaw as Preset[];

const createStyles = (windowWidth: number) => {
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  return {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      minHeight: "100vh",
      minWidth: "100%",
      background: "var(--bg-gradient)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "var(--text)",
    },
    header: {
      background: "var(--header-bg)",
      color: "var(--header-text)",
      padding: isMobile ? "0.75rem 1rem" : "1.25rem 1.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "sticky" as const,
      top: 0,
      zIndex: 1000,
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      textAlign: "center" as const,
    },
    mainTitle: {
      fontSize: isMobile ? "1.25rem" : "1.875rem",
      fontWeight: "bold",
      margin: 0,
    },
    subtitle: {
      marginTop: "0.5rem",
      color: "var(--header-subtle)",
      fontSize: isMobile ? "0.8rem" : "1rem",
    },
    main: {
      flexGrow: 1,
      padding: isMobile ? "0.75rem" : isTablet ? "1.25rem" : "2rem",
      maxWidth: "1200px",
      width: "100%",
      margin: "0 auto",
      boxSizing: "border-box" as const,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isDesktop
        ? "1fr 1fr 1fr"
        : isTablet
        ? "1fr 1fr"
        : "1fr",
      gap: isMobile ? "1rem" : "1.5rem",
    },
    card: {
      background: "var(--surface)",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid var(--border)",
      marginBottom: isMobile ? "1rem" : 0,
      width: "100%",
    },
    chartCard: {
      background: "var(--surface)",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid var(--border)",
      marginBottom: isMobile ? "1rem" : 0,
      gridColumn: isTablet ? "span 2" : "auto",
    },
    cardHeader: {
      background: "var(--accent-soft)",
      padding: "1rem",
      borderBottom: "1px solid var(--border)",
    },
    cardTitle: {
      fontSize: isMobile ? "1rem" : "1.25rem",
      fontWeight: 600,
      color: "var(--accent)",
      margin: 0,
    },
    cardBody: {
      padding: isMobile ? "0.75rem" : "1.5rem",
    },
    formGroup: {
      marginBottom: isMobile ? "0.75rem" : "1.5rem",
    },
    label: {
      display: "block",
      fontSize: isMobile ? "0.8125rem" : "0.875rem",
      fontWeight: 500,
      color: "var(--muted-text)",
      marginBottom: "0.5rem",
    },
    labelRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    value: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "var(--accent)",
    },
    select: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.375rem",
      border: "1px solid var(--select-border)",
      background: "var(--select-bg)",
      outline: "none",
      transition: "border-color 0.2s",
    },
    range: {
      width: "100%",
      height: isMobile ? "0.6rem" : "0.5rem",
      borderRadius: "0.25rem",
      accentColor: "var(--accent)",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    infoCard: {
      background: "var(--surface-2)",
      padding: "1rem",
      borderRadius: "0.5rem",
    },
    wideInfoCard: {
      background: "var(--surface-2)",
      padding: "1rem",
      borderRadius: "0.5rem",
      gridColumn: isMobile ? "auto" : "span 2",
    },
    infoLabel: {
      fontSize: "0.875rem",
      color: "var(--muted-text)",
      margin: "0 0 0.25rem 0",
    },
    infoValue: {
      fontSize: isMobile ? "1.25rem" : "1.5rem",
      fontWeight: "bold",
      color: "var(--accent)",
      margin: 0,
    },
    modelExplanation: {
      background: "var(--surface-2)",
      padding: "1rem",
      borderRadius: "0.5rem",
      marginTop: "1rem",
    },
    explainTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "var(--accent)",
      marginBottom: "0.5rem",
    },
    explainText: {
      fontSize: "0.875rem",
      color: "var(--muted-text)",
      margin: 0,
    },
    formula: {
      background: "var(--formula-bg)",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      margin: "0.5rem 0",
      textAlign: "center" as const,
      fontWeight: 500,
      overflowX: "auto" as const,
    },
    formulaNote: {
      fontSize: "0.75rem",
      color: "var(--muted-text)",
      marginTop: "0.5rem",
    },
    chartContainer: {
      height: isMobile ? "300px" : isTablet ? "350px" : "400px",
      padding: "1rem",
    },
    footer: {
      background: "var(--footer-bg)",
      color: "var(--footer-text)",
      textAlign: "center" as const,
      padding: "1rem",
      marginTop: "2rem",
    },
    footerText: {
      fontSize: isMobile ? "0.75rem" : "0.875rem",
      margin: 0,
    },
  };
};

export default function PopulationGrowthModel() {
  const [initialPopulation, setInitialPopulation] = useState(1000);
  const [growthRate, setGrowthRate] = useState(0.05);
  const [carryingCapacity, setCarryingCapacity] = useState(10000);
  const [timeSpan, setTimeSpan] = useState(100);
  const [modelType, setModelType] = useState("exponential");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [activePreset, setActivePreset] = useState<string>("");
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  // URL <-> State Sync Helpers
  const urlParams = useMemo(
    () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""),
    []
  );

  const applyParamsFromUrl = () => {
    const m = urlParams.get("model");
    const p0 = Number(urlParams.get("P0"));
    const r = Number(urlParams.get("r"));
    const K = Number(urlParams.get("K"));
    const T = Number(urlParams.get("T"));

    if (m === "exponential" || m === "logistic") setModelType(m);
    if (!Number.isNaN(p0) && p0 > 0) setInitialPopulation(p0);
    if (!Number.isNaN(r) && r > 0) setGrowthRate(r);
    if (!Number.isNaN(K) && K > 0) setCarryingCapacity(K);
    if (!Number.isNaN(T) && T > 0) setTimeSpan(T);
  };

  const updateUrlFromState = (replace = true) => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams();
    sp.set("model", modelType);
    sp.set("P0", String(initialPopulation));
    sp.set("r", String(growthRate));
    sp.set("K", String(carryingCapacity));
    sp.set("T", String(timeSpan));
    const newUrl = `${window.location.pathname}?${sp.toString()}`;
    if (replace) window.history.replaceState({}, "", newUrl);
    else window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // initialize state from URL if present
    applyParamsFromUrl();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = createStyles(windowWidth);

  useEffect(() => {
    // Calcula dados de crescimento populacional
    const calculatePopulationData = () => {
      const data = [];
      let currentPopulation = initialPopulation;

      for (let year = 0; year <= timeSpan; year++) {
        data.push({
          year,
          population: Math.round(currentPopulation),
        });

        // Calcular próxima população com base no modelo selecionado
        if (modelType === "exponential") {
          // Crescimento exponencial: P(t+1) = P(t) * (1 + r)
          currentPopulation = currentPopulation * (1 + growthRate);
        } else if (modelType === "logistic") {
          // Crescimento logístico: P(t+1) = P(t) + r*P(t)*(1 - P(t)/K)
          currentPopulation =
            currentPopulation +
            growthRate *
              currentPopulation *
              (1 - currentPopulation / carryingCapacity);
        }
      }

      setChartData(data);
    };

    calculatePopulationData();
  }, [initialPopulation, growthRate, carryingCapacity, timeSpan, modelType]);

  // keep URL in sync with state
  useEffect(() => {
    updateUrlFromState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPopulation, growthRate, carryingCapacity, timeSpan, modelType]);

  const formatPopulation = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Determinar se estamos em tablet (para ajuste do layout)
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const handleApplyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setActivePreset(id);
    setModelType(p.modelType);
    setInitialPopulation(p.initialPopulation);
    setGrowthRate(p.growthRate);
    setCarryingCapacity(p.carryingCapacity);
    setTimeSpan(p.timeSpan);
    updateUrlFromState(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência.");
    } catch {
      alert("Não foi possível copiar o link. Copie da barra de endereços.");
    }
  };

  const download = (filename: string, href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportCSV = () => {
    const header = "year,population\n";
    const rows = chartData.map((d) => `${d.year},${d.population}`).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    download("population-data.csv", url);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    const wrapper = chartWrapperRef.current;
    if (!wrapper) return;
    const svg = wrapper.querySelector("svg");
    if (!svg) {
      alert("Gráfico não encontrado para exportação.");
      return;
    }
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = window.btoa(unescape(encodeURIComponent(xml)));
    const image64 = `data:image/svg+xml;base64,${svg64}`;
    const img = new Image();
    const { width, height } = wrapper.getBoundingClientRect();
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const url = canvas.toDataURL("image/png");
      download("population-chart.png", url);
    };
    img.onerror = () => alert("Falha ao renderizar imagem para exportação.");
    img.src = image64;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>Modelo de Crescimento Populacional</h1>
          <p style={styles.subtitle}>
            Simulação interativa de modelos matemáticos de crescimento
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.grid}>
          {/* Left Panel - Parameters */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Parâmetros do Modelo</h2>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Presets</label>
                <select
                  value={activePreset}
                  onChange={(e) => handleApplyPreset(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Selecionar…</option>
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Modelo</label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  style={styles.select}
                >
                  <option value="exponential">Crescimento Exponencial</option>
                  <option value="logistic">Crescimento Logístico</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>População Inicial</label>
                  <span style={styles.value}>
                    {formatPopulation(initialPopulation)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={initialPopulation}
                  onChange={(e) => setInitialPopulation(Number(e.target.value))}
                  style={styles.range}
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Taxa de Crescimento</label>
                  <span style={styles.value}>
                    {(growthRate * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.01"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  style={styles.range}
                />
              </div>

              {modelType === "logistic" && (
                <div style={styles.formGroup}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Capacidade de Suporte</label>
                    <span style={styles.value}>
                      {formatPopulation(carryingCapacity)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={carryingCapacity}
                    onChange={(e) =>
                      setCarryingCapacity(Number(e.target.value))
                    }
                    style={styles.range}
                  />
                </div>
              )}

              <div style={styles.formGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Período de Tempo</label>
                  <span style={styles.value}>{timeSpan} anos</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={timeSpan}
                  onChange={(e) => setTimeSpan(Number(e.target.value))}
                  style={styles.range}
                />
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 12 }}>
                <button
                  onClick={handleShare}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "var(--accent)",
                    color: "var(--accent-contrast)",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Compartilhar
                </button>
                <button
                  onClick={handleExportPNG}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "var(--success)",
                    color: "var(--accent-contrast)",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Exportar PNG
                </button>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "var(--info)",
                    color: "var(--accent-contrast)",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          {/* Middle Panel - Model Info */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Informações do Modelo</h2>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>População Inicial</p>
                  <p style={styles.infoValue}>
                    {formatPopulation(initialPopulation)}
                  </p>
                </div>
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>Taxa de Crescimento</p>
                  <p style={styles.infoValue}>
                    {(growthRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>Tipo de Modelo</p>
                  <p style={styles.infoValue}>
                    {modelType === "exponential" ? "Exponencial" : "Logístico"}
                  </p>
                </div>
                <div style={styles.infoCard}>
                  <p style={styles.infoLabel}>
                    População Final (após {timeSpan} anos)
                  </p>
                  <p style={styles.infoValue}>
                    {chartData.length > 0
                      ? formatPopulation(
                          chartData[chartData.length - 1].population
                        )
                      : "0"}
                  </p>
                </div>
                {modelType === "logistic" && (
                  <div style={styles.wideInfoCard}>
                    <p style={styles.infoLabel}>Capacidade de Suporte</p>
                    <p style={styles.infoValue}>
                      {formatPopulation(carryingCapacity)}
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.modelExplanation}>
                <h3 style={styles.explainTitle}>Explicação do Modelo:</h3>
                {modelType === "exponential" ? (
                  <div>
                    <p style={styles.explainText}>
                      O modelo de crescimento <strong>exponencial</strong>{" "}
                      assume que a população cresce a uma taxa constante, sem
                      limitações de recursos. Este modelo é representado pela
                      fórmula:
                    </p>
                    <div style={styles.formula}>P(t+1) = P(t) × (1 + r)</div>
                    <p style={styles.formulaNote}>
                      onde r é a taxa de crescimento anual.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={styles.explainText}>
                      O modelo de crescimento <strong>logístico</strong>{" "}
                      considera que a taxa de crescimento diminui à medida que a
                      população se aproxima da capacidade de suporte do
                      ambiente. É representado pela fórmula:
                    </p>
                    <div style={styles.formula}>
                      P(t+1) = P(t) + r × P(t) × (1 - P(t)/K)
                    </div>
                    <p style={styles.formulaNote}>
                      onde K é a capacidade de suporte.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Graph, em tablet ocupa toda a largura */}
          <div style={isTablet ? styles.chartCard : styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Visualização</h2>
            </div>
            <div style={styles.chartContainer} ref={chartWrapperRef}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: windowWidth < 640 ? 12 : 20, right: windowWidth < 640 ? 12 : 20, bottom: windowWidth < 640 ? 8 : 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis
                    dataKey="year"
                    label={
                      windowWidth < 640
                        ? undefined
                        : {
                            value: "Anos",
                            position: "insideBottomRight",
                            offset: -5,
                          }
                    }
                    stroke="var(--chart-axis)"
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                  />
                  <YAxis
                    tickFormatter={formatPopulation}
                    label={
                      windowWidth < 640
                        ? undefined
                        : {
                            value: "População",
                            angle: -90,
                            position: "insideLeft",
                          }
                    }
                    stroke="var(--chart-axis)"
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                    width={windowWidth < 640 ? 40 : 60}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatPopulation(Number(value)),
                      "População",
                    ]}
                    labelFormatter={(label) => `Ano ${label}`}
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderColor: "var(--tooltip-border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      fontSize: windowWidth < 640 ? "0.75rem" : "0.875rem",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: windowWidth < 640 ? "0.75rem" : "0.875rem",
                      display: windowWidth < 380 ? "none" : "block",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="population"
                    name="População"
                    stroke="var(--accent)"
                    strokeWidth={windowWidth < 640 ? 2 : 3}
                    dot={false}
                    activeDot={{
                      r: windowWidth < 640 ? 6 : 8,
                      fill: "var(--accent)",
                      stroke: "#fff",
                    }}
                  />
                  {modelType === "logistic" && (
                    <Line
                      type="monotone"
                      dataKey="capacityLine"
                      name="Capacidade de Suporte"
                      stroke="var(--success)"
                      strokeDasharray="5 5"
                      hide={true}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} Simulador de Crescimento Populacional
        </p>
      </footer>
    </div>
  );
}
