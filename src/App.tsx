import { useState, useEffect } from "react";
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
      background: "linear-gradient(to bottom right, #f0f5ff, #e8eaff)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    header: {
      background: "#4338ca",
      color: "white",
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
      color: "#e0e7ff",
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
      background: "white",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e0e7ff",
      marginBottom: isMobile ? "1rem" : 0,
      width: "100%",
    },
    chartCard: {
      background: "white",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e0e7ff",
      marginBottom: isMobile ? "1rem" : 0,
      gridColumn: isTablet ? "span 2" : "auto",
    },
    cardHeader: {
      background: "#eef2ff",
      padding: "1rem",
      borderBottom: "1px solid #e0e7ff",
    },
    cardTitle: {
      fontSize: isMobile ? "1rem" : "1.25rem",
      fontWeight: 600,
      color: "#3730a3",
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
      color: "#4b5563",
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
      color: "#4338ca",
    },
    select: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.375rem",
      border: "1px solid #d1d5db",
      background: "#eef2ff",
      outline: "none",
      transition: "border-color 0.2s",
    },
    range: {
      width: "100%",
      height: isMobile ? "0.6rem" : "0.5rem",
      borderRadius: "0.25rem",
      accentColor: "#4338ca",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    infoCard: {
      background: "#f5f7ff",
      padding: "1rem",
      borderRadius: "0.5rem",
    },
    wideInfoCard: {
      background: "#f5f7ff",
      padding: "1rem",
      borderRadius: "0.5rem",
      gridColumn: isMobile ? "auto" : "span 2",
    },
    infoLabel: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: "0 0 0.25rem 0",
    },
    infoValue: {
      fontSize: isMobile ? "1.25rem" : "1.5rem",
      fontWeight: "bold",
      color: "#4338ca",
      margin: 0,
    },
    modelExplanation: {
      background: "#f5f7ff",
      padding: "1rem",
      borderRadius: "0.5rem",
      marginTop: "1rem",
    },
    explainTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#4338ca",
      marginBottom: "0.5rem",
    },
    explainText: {
      fontSize: "0.875rem",
      color: "#4b5563",
      margin: 0,
    },
    formula: {
      background: "white",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      margin: "0.5rem 0",
      textAlign: "center" as const,
      fontWeight: 500,
      overflowX: "auto" as const,
    },
    formulaNote: {
      fontSize: "0.75rem",
      color: "#6b7280",
      marginTop: "0.5rem",
    },
    chartContainer: {
      height: isMobile ? "300px" : isTablet ? "350px" : "400px",
      padding: "1rem",
    },
    footer: {
      background: "#312e81",
      color: "white",
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

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

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
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: windowWidth < 640 ? 12 : 20, right: windowWidth < 640 ? 12 : 20, bottom: windowWidth < 640 ? 8 : 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
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
                    stroke="#4338ca"
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
                    stroke="#4338ca"
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
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: "#4338ca",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(67, 56, 202, 0.15)",
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
                    stroke="#4338ca"
                    strokeWidth={windowWidth < 640 ? 2 : 3}
                    dot={false}
                    activeDot={{
                      r: windowWidth < 640 ? 6 : 8,
                      fill: "#4338ca",
                      stroke: "#fff",
                    }}
                  />
                  {modelType === "logistic" && (
                    <Line
                      type="monotone"
                      dataKey="capacityLine"
                      name="Capacidade de Suporte"
                      stroke="#10B981"
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
