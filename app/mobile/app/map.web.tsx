import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_URL = isLocal ? "http://localhost:8000" : (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000");

type LatLng = { lat: number; lng: number };
type ModeStats = {
  mesafe_m: number;
  sure_s: number;
  viraj_fun: number;
  viraj_tehlike: number;
  yuksek_risk: number;
  ortalama_egim: number;
  ucretli: boolean;
};
type RouteData = {
  origin: LatLng;
  destination: LatLng;
  origin_label: string;
  destination_label: string;
  google_route: LatLng[];
  google_stats: { mesafe_m: number; sure_s: number; mesafe_text: string; sure_text: string };
  modes: Record<string, { coordinates: LatLng[]; stats: ModeStats }>;
};

const MODES = [
  { key: "standart", label: "Standart", icon: "🗺️" },
  { key: "viraj_keyfi", label: "Viraj Keyfi", icon: "🌀" },
  { key: "guvenli", label: "Güvenli", icon: "🛡️" },
];

function formatDist(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
function formatTime(s: number) {
  const mins = Math.round(s / 60);
  if (mins >= 60) return `${Math.floor(mins / 60)}s ${mins % 60}dk`;
  return `${mins} dk`;
}

export default function MapScreenWeb() {
  const router = useRouter();
  const [data, setData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState("standart");

  useEffect(() => {
    fetch(`${API_URL}/api/route`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: RouteData) => setData(d))
      .catch((e) => setError(String(e)));
  }, []);

  const mode = data?.modes[activeMode];
  const stats = mode?.stats;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Image
            source={require("../assets/motomap_logo_white.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mapPlaceholder}>
        <View style={styles.routeViz}>
          <View style={styles.originDot} />
          <View style={styles.routeLine}>
            <View style={[styles.routeSegment, { backgroundColor: "#4285F4", flex: 1 }]} />
            <View style={[styles.routeSegment, { backgroundColor: "#3D8BFF", flex: 1 }]} />
          </View>
          <View style={styles.destDot} />
        </View>
        {data && (
          <View style={styles.mapLabels}>
            <Text style={styles.mapLabel}>{data.origin_label}</Text>
            <Text style={styles.mapLabelDest}>{data.destination_label}</Text>
          </View>
        )}
        <Text style={styles.mapNote}>📱 Harita görünümü için Expo Go uygulamasını kullanın</Text>
      </View>

      <View style={styles.panel}>
        {error ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>⚠️ Bağlantı hatası</Text>
            <Text style={styles.errorSub}>{error}</Text>
          </View>
        ) : !data ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color="#3D8BFF" size="large" />
            <Text style={styles.loadingText}>Rota yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modeRow}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.modeBtn, activeMode === m.key && styles.modeBtnActive]}
                  onPress={() => setActiveMode(m.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modeIcon}>{m.icon}</Text>
                  <Text style={[styles.modeBtnText, activeMode === m.key && styles.modeBtnTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.routeCompare}>
              <View style={styles.compareCard}>
                <View style={[styles.compareDot, { backgroundColor: "#4285F4" }]} />
                <Text style={styles.compareLabel}>Google</Text>
                <Text style={[styles.compareValue, { color: "#4285F4" }]}>
                  {formatDist(data.google_stats.mesafe_m)}
                </Text>
                <Text style={styles.compareSub}>{formatTime(data.google_stats.sure_s)}</Text>
              </View>
              <View style={styles.compareDivider} />
              <View style={styles.compareCard}>
                <View style={[styles.compareDot, { backgroundColor: "#3D8BFF" }]} />
                <Text style={styles.compareLabel}>MOTOMAP</Text>
                <Text style={[styles.compareValue, { color: "#3D8BFF" }]}>
                  {formatDist(stats?.mesafe_m ?? 0)}
                </Text>
                <Text style={styles.compareSub}>{formatTime(stats?.sure_s ?? 0)}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              {MODES.find((m) => m.key === activeMode)?.icon}{" "}
              {MODES.find((m) => m.key === activeMode)?.label} Modu Detayları
            </Text>

            {stats && (
              <View style={styles.statsGrid}>
                <GlassStatCard label="Eğlenceli Viraj" value={String(stats.viraj_fun)} color="#3D8BFF" icon="🌀" />
                <GlassStatCard label="Tehlikeli Viraj" value={String(stats.viraj_tehlike)} color="#f59e0b" icon="⚠️" />
                <GlassStatCard label="Yüksek Risk" value={String(stats.yuksek_risk)} color="#ef4444" icon="🔴" />
                <GlassStatCard label="Ort. Eğim" value={`%${(stats.ortalama_egim * 100).toFixed(1)}`} color="#a78bfa" icon="⛰️" />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function GlassStatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <View style={glassStyles.card}>
      <Text style={glassStyles.icon}>{icon}</Text>
      <Text style={[glassStyles.value, { color }]}>{value}</Text>
      <Text style={glassStyles.label}>{label}</Text>
    </View>
  );
}

const glassStyles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "rgba(61,139,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(61,139,255,0.25)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  icon: { fontSize: 22, marginBottom: 2 },
  value: { fontSize: 24, fontWeight: "800" },
  label: { color: "rgba(255,255,255,0.55)", fontSize: 11, textAlign: "center" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#081C50" },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(8,28,80,0.88)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  logoImg: {
    width: 110,
    height: 38,
  },
  mapPlaceholder: {
    height: height * 0.28,
    backgroundColor: "rgba(61,139,255,0.07)",
    borderBottomWidth: 1,
    borderColor: "rgba(61,139,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  routeViz: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    gap: 0,
  },
  originDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#14532d",
  },
  routeLine: {
    flex: 1,
    height: 4,
    flexDirection: "row",
    gap: 0,
    marginHorizontal: 4,
  },
  routeSegment: { height: "100%" },
  destDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#f97316",
    borderWidth: 2,
    borderColor: "#7c2d12",
  },
  mapLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  mapLabel: { color: "#22c55e", fontSize: 11, fontWeight: "700" },
  mapLabelDest: { color: "#f97316", fontSize: 11, fontWeight: "700" },
  mapNote: { color: "rgba(255,255,255,0.35)", fontSize: 11, textAlign: "center" },
  panel: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadingText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  errorText: { color: "#f59e0b", fontSize: 16, fontWeight: "700" },
  errorSub: { color: "rgba(255,255,255,0.5)", fontSize: 12, textAlign: "center" },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  modeBtnActive: { borderColor: "#3D8BFF", backgroundColor: "rgba(61,139,255,0.2)" },
  modeIcon: { fontSize: 14 },
  modeBtnText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700" },
  modeBtnTextActive: { color: "#3D8BFF" },
  routeCompare: {
    flexDirection: "row",
    backgroundColor: "rgba(61,139,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(61,139,255,0.2)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  compareCard: { flex: 1, alignItems: "center", gap: 4 },
  compareDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  compareLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
  compareValue: { fontSize: 22, fontWeight: "800" },
  compareSub: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  compareDivider: { width: 1, height: 50, backgroundColor: "rgba(255,255,255,0.12)", marginHorizontal: 16 },
  sectionTitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "700", marginBottom: 10 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
});
