

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useMemo, useState } from "react";
import MapTag from "../../../components/MapTag";
import buildings from "../../Modules/Tagging/data";

interface NaturalSize {
  w: number;
  h: number;
}

const CAMPUS_MAP = require("../../../assets/campus-map.png");

export default function MapTaggerScreen() {
  const router = useRouter();
  const { width } = Dimensions.get("window");

  const { width: screenWidth } = useWindowDimensions();
  const [naturalSize, setNaturalSize] = useState<NaturalSize>({
    w: 1920,
    h: 1080,
  });
  const [ready, setReady] = useState(true);

  // useEffect(() => {
  //   Image.getSize(
  //     IMAGE_URI,
  //     (w, h) => {
  //       setNaturalSize({ w, h })
  //       setReady(true)
  //     },
  //     (error) => {
  //       console.error("Failed to load image size:", error)
  //       setNaturalSize({ w: 1920, h: 1080 })
  //       setReady(true)
  //     },
  //   )
  // }, [])

  const { containerWidth, containerHeight } = useMemo(() => {
    if (!naturalSize.w || !naturalSize.h)
      return { containerWidth: 0, containerHeight: 0 };
    const w = screenWidth - 24;
    const aspect = naturalSize.h / naturalSize.w;
    return { containerWidth: w, containerHeight: w * aspect };
  }, [screenWidth, naturalSize]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>COMSATS University Campus</Text>
          <Text style={styles.headerSubtitle}>
            Tap on any building tag to view details
          </Text>
        </View>

        <View
          style={[
            styles.imageWrap,
            { width: containerWidth, height: containerHeight },
          ]}>
          <Image
            source={CAMPUS_MAP}
            style={{
              width: containerWidth,
              height: containerHeight,
              borderRadius: 12,
            }}
            resizeMode="cover"
            accessible
            accessibilityLabel="Campus satellite map with tagged buildings"
          />

          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {buildings &&
              buildings?.map((b: any) => {
                const left = b.x * containerWidth;
                const top = b.y * containerHeight;
                console.log("Rendering tag for", b.id, left, top);
                return (
                  <MapTag
                    key={b.id}
                    title={b.short || b.title}
                    left={left}
                    top={top}
                    onPress={() => {
                      console.log(
                        "Pressed building",
                        `/Modules/Tagging/BuildingProfile?id=${b.id}`
                      );

                      router.navigate(
                        `/Modules/Tagging/BuildingProfile?id=${b.id}`
                      );
                    }}
                  />
                );
              })}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {buildings.length} buildings tagged
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#C3DDF4",
  },
  scrollContent: {
    marginTop: '50%',
    padding: 12,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  header: {
    marginBottom: 16,
    gap: 4,
  },
  headerTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#111827",
    fontSize: 14,
  },
  imageWrap: {
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
  },
});
