
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TAG_SIZE = 36;

interface MapTagProps {
  title: string;
  left: number;
  top: number;
  onPress: () => void;
}

export default function MapTag({ title, left, top, onPress }: MapTagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        width: TAG_SIZE,
        height: TAG_SIZE,
        borderRadius: TAG_SIZE / 2,
        backgroundColor: "#0284c7",
        borderWidth: 2,
        borderColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,

        elevation: 5,

        left: left - TAG_SIZE / 2,
        top: top - TAG_SIZE / 2,
      }}
      accessibilityRole="button"
      accessibilityLabel={`Open profile for ${title}`}>
      <View style={styles.inner}>
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: "absolute",
    backgroundColor: "#0284c7",
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  inner: {
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
