import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Polyline, Circle, PROVIDER_DEFAULT } from "react-native-maps";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const PANEL_HEIGHT = height * 0.44;

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

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
  { key: "viraj_keyfi", label: "Viraj", icon: "🌀" },
  { key: "guvenli", label: "Güvenli", icon: "🛡️" },
];

function toMapCoords(coords: LatLng[]) {
  return coords.map((c) => ({ latitude: c.lat, longitude: c.lng }));
}

function formatDist(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

function formatTime(s: number) {
  const mins = Math.round(s / 60);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}s ${m}dk`;
  }
  return `${mins} dk`;
}

export default function MapScreen() {
  const router = useRouter();
  const [data, setData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState("standart");
  const panelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch(`${API_URL}/api/route`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: RouteData) => {
        setData(d);
        Animated.spring(panelAnim, { toValue: 1, useNativeDriver: true, bounciness: 3 }).start();
      })
      .catch((e) => setError(String(e)));
  }, []);

  const mode = data?.modes[activeMode];
  const stats = mode?.stats;

  const centerLat = data
    ? (data.origin.lat + data.destination.lat) / 2
    : 40.9811;
  const centerLng = data
    ? (data.origin.lng + data.destination.lng) / 2
    : 29.031;

  const panelTranslate = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [PANEL_HEIGHT, 0],
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.045,
          longitudeDelta: 0.035,
        }}
      >
        {data && (
          <>
            <Polyline
              coordinates={toMapCoords(data.google_route)}
              strokeColor="#4285F4"
              strokeWidth={4}
              lineDashPattern={[8, 4]}
            />
            {mode && (
              <Polyline
                coordinates={toMapCoords(mode.coordinates)}
                strokeColor="#3D8BFF"
                strokeWidth={5}
              />
            )}
            <Circle
              center={{ latitude: data.origin.lat, longitude: data.origin.lng }}
              radius={50}
              fillColor="rgba(34,197,94,0.85)"
              strokeColor="#14532d"
              strokeWidth={2}
            />
            <Circle
              center={{ latitude: data.destination.lat, longitude: data.destination.lng }}
              radius={50}
              fillColor="rgba(249,115,22,0.85)"
              strokeColor="#7c2d12"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Image
          source={require("../assets/motomap_logo_white.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Animated.View style={[styles.panel, { transform: [{ translateY: panelTranslate }] }]}>
        <View style={styles.panelHandle} />

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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDash, { backgroundColor: "#4285F4" }]} />
                <Text style={styles.legendLabel}>Google Maps</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDash, { backgroundColor: "#3D8BFF" }]} />
                <Text style={styles.legendLabel}>MOTOMAP</Text>
              </View>
            </View>

            <View style={styles.routeCompare}>
              <CompareCard
                label="Google"
                distance={formatDist(data.google_stats.mesafe_m)}
                time={formatTime(data.google_stats.sure_s)}
                color="#4285F4"
              />
              <View style={styles.compareDivider} />
              <CompareCard
                label="MOTOMAP"
                distance={formatDist(stats?.mesafe_m ?? 0)}
                time={formatTime(stats?.sure_s ?? 0)}
                color="#3D8BFF"
              />
            </View>

            <Text style={styles.sectionTitle}>
              {MODES.find((m) => m.key === activeMode)?.icon}{" "}
              {MODES.find((m) => m.key === activeMode)?.label} Modu Detayları
            </Text>

            {stats && (
              <View style={styles.statsGrid}>
                <GlassStatCard
                  label="Eğlenceli Viraj"
                  value={String(stats.viraj_fun)}
                  color="#3D8BFF"
                  icon="🌀"
                />
                <GlassStatCard
                  label="Tehlikeli Viraj"
                  value={String(stats.viraj_tehlike)}
                  color="#f59e0b"
                  icon="⚠️"
                />
                <GlassStatCard
                  label="Yüksek Risk"
                  value={String(stats.yuksek_risk)}
                  color="#ef4444"
                  icon="🔴"
                />
                <GlassStatCard
                  label="Ort. Eğim"
                  value={`%${(stats.ortalama_egim * 100).toFixed(1)}`}
                  color="#a78bfa"
                  icon="⛰️"
                />
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

function CompareCard({
  label,
  distance,
  time,
  color,
}: {
  label: string;
  distance: string;
  time: string;
  color: string;
}) {
  return (
    <View style={compareStyles.card}>
      <View style={[compareStyles.dot, { backgroundColor: color }]} />
      <Text style={compareStyles.label}>{label}</Text>
      <Text style={[compareStyles.value, { color }]}>{distance}</Text>
      <Text style={compareStyles.sub}>{time}</Text>
    </View>
  );
}

const compareStyles = StyleSheet.create({
  card: { flex: 1, alignItems: "center", gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  label: { color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
  value: { fontSize: 22, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
});

function GlassStatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: string;
}) {
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
  label: { color: "rgba(255,255,255,0.55)", fontSize: 11, textAlign: "center", letterSpacing: 0.5 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#081C50" },
  map: { flex: 1 },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 16,
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
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
    backgroundColor: "#081C50",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 24,
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 14,
  },
  scrollContent: { paddingBottom: 8 },
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
  modeBtnActive: {
    borderColor: "#3D8BFF",
    backgroundColor: "rgba(61,139,255,0.2)",
  },
  modeIcon: { fontSize: 14 },
  modeBtnText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700" },
  modeBtnTextActive: { color: "#3D8BFF" },
  legend: { flexDirection: "row", gap: 20, marginBottom: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  legendDash: { width: 24, height: 3, borderRadius: 2 },
  legendLabel: { color: "rgba(255,255,255,0.55)", fontSize: 12 },
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
  compareDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
