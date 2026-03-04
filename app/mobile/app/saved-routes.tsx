import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SavedRoutesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kayıtlı Rotalar</Text>
      </View>

      <View style={styles.emptyState}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>📍</Text>
        </View>
        <Text style={styles.emptyTitle}>Henüz Rota Yok</Text>
        <Text style={styles.emptyDesc}>
          Navigasyonu başlattığında rotaların burada görünecek.
        </Text>
        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/route-selection")}
        >
          <Text style={styles.createBtnText}>Rota Oluştur</Text>
        </TouchableOpacity>
      </View>
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EAECF0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 36,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A1E3D",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    color: "rgba(10,30,61,0.5)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  createBtn: {
    backgroundColor: "#3D8BFF",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 8,
    shadowColor: "#3D8BFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
