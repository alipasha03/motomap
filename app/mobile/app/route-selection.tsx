import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RouteSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rota Seçimi</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <View style={styles.locationTextBlock}>
              <Text style={styles.locationLabel}>Nereden</Text>
              <Text style={styles.locationValue}>Mevcut Konum</Text>
            </View>
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationRow}>
            <View style={styles.locationPin}>
              <Text style={styles.locationPinText}>◎</Text>
            </View>
            <View style={styles.locationTextBlock}>
              <Text style={styles.locationLabel}>Nereye</Text>
              <Text style={styles.locationValueSearch}>⌕  Kilyos, İstanbul</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sürüş Tarzını Seç</Text>

        <TouchableOpacity style={styles.routeCard} activeOpacity={0.85}>
          <View style={styles.routeIconWrap}>
            <Text style={styles.routeIcon}>⚡</Text>
          </View>
          <View style={styles.routeTextBlock}>
            <View style={styles.routeTopRow}>
              <Text style={styles.routeTitle}>En Hızlı</Text>
              <Text style={styles.routeTime}>45 dk</Text>
            </View>
            <Text style={styles.routeDesc}>Otoban ve ana yolları kullanarak{"\n"}en kısa sürede var.</Text>
            <View style={styles.routeTagRow}>
              <View style={styles.routeTagGray}>
                <Text style={styles.routeTagText}>32 km</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.routeCard, styles.routeCardActive]} activeOpacity={0.85}>
          <View style={[styles.routeIconWrap, styles.routeIconWrapActive]}>
            <Text style={styles.routeIcon}>✕</Text>
          </View>
          <View style={styles.routeTextBlock}>
            <View style={styles.routeTopRow}>
              <Text style={[styles.routeTitle, styles.routeTitleWhite]}>Virajlı Yollar</Text>
              <Text style={[styles.routeTime, styles.routeTimeWhite]}>1s 15dk</Text>
            </View>
            <Text style={[styles.routeDesc, styles.routeDescWhite]}>
              Sürüş keyfini maksimize eden,{"\n"}bol virajlı alternatif rota.
            </Text>
            <View style={styles.routeTagRow}>
              <View style={styles.routeTagBlue}>
                <Text style={styles.routeTagBlueText}>Önerilen</Text>
              </View>
              <View style={styles.routeTagDark}>
                <Text style={styles.routeTagText}>48 km</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.routeCard} activeOpacity={0.85}>
          <View style={[styles.routeIconWrap, styles.routeIconWrapOrange]}>
            <Text style={styles.routeIcon}>△</Text>
          </View>
          <View style={styles.routeTextBlock}>
            <View style={styles.routeTopRow}>
              <Text style={styles.routeTitle}>Macera / Arazi</Text>
              <Text style={[styles.routeTime, styles.routeTimeOrange]}>1s 40dk</Text>
            </View>
            <Text style={styles.routeDesc}>Toprak yollar ve orman içi{"\n"}manzaralı zorlu rota.</Text>
            <View style={styles.routeTagRow}>
              <View style={styles.routeTagOrange}>
                <Text style={styles.routeTagOrangeText}>41 km • Toprak Yol Uyarısı</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 30,
    color: "#0A1E3D",
    lineHeight: 34,
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0A1E3D",
    letterSpacing: 0.2,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  locationCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3D8BFF",
  },
  locationPin: {
    width: 20,
    alignItems: "center",
  },
  locationPinText: {
    fontSize: 18,
    color: "#888",
  },
  locationTextBlock: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: "rgba(10,30,61,0.45)",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A1E3D",
  },
  locationValueSearch: {
    fontSize: 15,
    fontWeight: "400",
    color: "#0A1E3D",
  },
  locationDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginLeft: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A1E3D",
    marginBottom: 4,
    marginTop: 6,
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  routeCardActive: {
    backgroundColor: "#0A2461",
  },
  routeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  routeIconWrapActive: {
    backgroundColor: "#3D8BFF",
  },
  routeIconWrapOrange: {
    backgroundColor: "#FFF0E5",
  },
  routeIcon: {
    fontSize: 20,
    color: "#0A1E3D",
  },
  routeTextBlock: {
    flex: 1,
    gap: 4,
  },
  routeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0A1E3D",
  },
  routeTitleWhite: {
    color: "#fff",
  },
  routeTime: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A1E3D",
  },
  routeTimeWhite: {
    color: "#fff",
  },
  routeTimeOrange: {
    color: "#E07020",
  },
  routeDesc: {
    fontSize: 13,
    color: "rgba(10,30,61,0.55)",
    lineHeight: 19,
  },
  routeDescWhite: {
    color: "rgba(255,255,255,0.7)",
  },
  routeTagRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  routeTagGray: {
    backgroundColor: "#EAECF0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeTagDark: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeTagBlue: {
    backgroundColor: "#3D8BFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeTagOrange: {
    backgroundColor: "#FFF0E5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routeTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(10,30,61,0.7)",
  },
  routeTagBlueText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  routeTagOrangeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E07020",
  },
});
