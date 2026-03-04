import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/moto_bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.inner}>
          <View style={styles.topBar}>
            <Image
              source={require("../assets/motomap_logo_white.png")}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroBlock}>
            <Text style={styles.heroWhite}>YOLUN</Text>
            <Text style={styles.heroBlue}>RUHUNU</Text>
            <Text style={styles.heroWhite}>KEŞFET.</Text>
            <Text style={styles.subtitle}>
              Sadece en hızlı değil, en keyifli{"\n"}rotalar için tasarlandı.
            </Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Text style={styles.featureIconText}>⚡</Text>
            </View>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>Akıllı Rotalar</Text>
              <Text style={styles.featureCardSub}>Virajlı ve manzaralı seçenekler.</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/onboarding")}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>BAŞLAYALIM  ›</Text>
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
    backgroundColor: "rgba(8, 28, 80, 0.72)",
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
    marginBottom: 40,
    marginLeft: -24,
  },
  logoImg: {
    width: 280,
    height: 96,
  },
  heroBlock: {
    marginBottom: 8,
  },
  heroWhite: {
    color: "#ffffff",
    fontSize: 58,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 62,
  },
  heroBlue: {
    color: "#3D8BFF",
    fontSize: 58,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 62,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 18,
    fontWeight: "400",
  },
  spacer: {
    flex: 1,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 18,
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(61,139,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconText: {
    fontSize: 22,
  },
  featureCardText: {
    flex: 1,
  },
  featureCardTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  featureCardSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
  },
  ctaButton: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: "#0A1E3D",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
