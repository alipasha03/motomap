import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const WEATHER = { temp: "18°C", desc: "Güneşli", sub: "Sürüş için ideal hava", city: "İstanbul" };

export default function DashboardScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const isWork = mode === "work";
  const greeting = isWork ? "HOŞ GELDİN, KURYE" : "HOŞ GELDİN, SÜRÜCÜ";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerTitle}>MOTOMAP</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>🌤</Text>
            <View>
              <Text style={styles.weatherTemp}>{WEATHER.temp} {WEATHER.desc}</Text>
              <Text style={styles.weatherSub}>{WEATHER.sub}</Text>
            </View>
          </View>
          <Text style={styles.weatherCity}>{WEATHER.city}</Text>
        </View>

        <TouchableOpacity
          style={styles.ctaCard}
          onPress={() => router.push("/route-selection")}
          activeOpacity={0.88}
        >
          <View style={styles.ctaIconWrap}>
            <Text style={styles.ctaIconText}>▲</Text>
          </View>
          <Text style={styles.ctaTitle}>YENİ ROTA BAŞLAT</Text>
          <Text style={styles.ctaSub}>Hedefini seç ve sürüş tarzını belirle</Text>
        </TouchableOpacity>

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard} activeOpacity={0.85} onPress={() => router.push("/garage")}>
            <Text style={styles.quickIcon}>🔧</Text>
            <Text style={styles.quickTitle}>Garaj</Text>
            <Text style={styles.quickSub}>Motor bilgileri &{"\n"}Bakım</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} activeOpacity={0.85} onPress={() => router.push("/saved-routes")}>
            <Text style={styles.quickIcon}>〰</Text>
            <Text style={styles.quickTitle}>Kayıtlı Rotalar</Text>
            <Text style={styles.quickSub}>0 rota</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Rota</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionLink}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyRouteCard}>
          <View style={styles.emptyMapBg}>
            <View style={styles.emptyMapGrid} />
            <View style={[styles.emptyMapLine, { top: "35%", left: "20%", width: "60%", transform: [{ rotate: "15deg" }] }]} />
            <View style={[styles.emptyMapLine, { top: "55%", left: "30%", width: "40%", transform: [{ rotate: "-10deg" }] }]} />
          </View>
          <View style={styles.emptyRouteBadge}>
            <Text style={styles.emptyRouteIcon}>🔵</Text>
            <View>
              <Text style={styles.emptyRouteTitle}>Henüz rota yok</Text>
              <Text style={styles.emptyRouteSub}>İlk rotanı oluşturmak için "Yeni Rota Başlat"a dokun</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081C50",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3D8BFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  weatherCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherIcon: {
    fontSize: 26,
  },
  weatherTemp: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  weatherSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 2,
  },
  weatherCity: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  ctaCard: {
    backgroundColor: "#2D6FE8",
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2D6FE8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  ctaIconText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  ctaTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  ctaSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    textAlign: "center",
  },

  quickRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },
  quickCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  quickTitle: {
    color: "#0A1E3D",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  quickSub: {
    color: "rgba(10,30,61,0.5)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionLink: {
    color: "#3D8BFF",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyRouteCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyMapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8EFF8",
  },
  emptyMapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    backgroundColor: "transparent",
  },
  emptyMapLine: {
    position: "absolute",
    height: 3,
    borderRadius: 2,
    backgroundColor: "#3D8BFF",
    opacity: 0.6,
  },
  emptyRouteBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  emptyRouteIcon: {
    fontSize: 18,
  },
  emptyRouteTitle: {
    color: "#0A1E3D",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyRouteSub: {
    color: "rgba(10,30,61,0.5)",
    fontSize: 11,
    marginTop: 1,
  },
});
