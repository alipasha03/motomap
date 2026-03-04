import { useRouter } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  const handleSelect = (mode: "work" | "hobby") => {
    router.push({ pathname: "/dashboard", params: { mode } });
  };

  return (
    <ImageBackground
      source={require("../assets/moto_bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.inner}>
          <View style={styles.topBar}>
            <View style={styles.globeCircle}>
              <Text style={styles.globeIcon}>🌐</Text>
            </View>
            <Text style={styles.brandText}>MOTOMAP</Text>
          </View>

          <View style={styles.heroBlock}>
            <Text style={styles.heroWhite}>Seni Daha İyi</Text>
            <Text style={styles.heroBlue}>Tanıyalım.</Text>
            <Text style={styles.subtitle}>
              Uygulamayı genellikle hangi amaçla{"\n"}kullanacaksın?
            </Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.cardsBlock}>
            <TouchableOpacity
              style={styles.selectionCard}
              onPress={() => handleSelect("work")}
              activeOpacity={0.85}
            >
              <View style={styles.cardIconWrap}>
                <Text style={styles.cardIcon}>💼</Text>
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>İş / Kurye</Text>
                <Text style={styles.cardSub}>Hızlı teslimat ve{"\n"}verimli rotalar.</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectionCard}
              onPress={() => handleSelect("hobby")}
              activeOpacity={0.85}
            >
              <View style={styles.cardIconWrap}>
                <Text style={styles.cardIcon}>🤍</Text>
              </View>
              <View style={styles.cardTextBlock}>
                <Text style={styles.cardTitle}>Gezi / Hobi</Text>
                <Text style={styles.cardSub}>Keyifli turlar ve{"\n"}virajlı yollar.</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>GERİ DÖN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 28, 80, 0.68)",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  globeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3D8BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  globeIcon: {
    fontSize: 18,
  },
  brandText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroBlock: {
    marginBottom: 8,
  },
  heroWhite: {
    color: "#ffffff",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  heroBlue: {
    color: "#3D8BFF",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    fontWeight: "400",
  },
  spacer: {
    flex: 1,
  },
  cardsBlock: {
    gap: 14,
    marginBottom: 28,
  },
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.11)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    lineHeight: 19,
  },
  cardArrow: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 24,
    fontWeight: "300",
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backBtnText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
