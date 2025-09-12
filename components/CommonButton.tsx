import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";

type CommonButtonProps = {
  text: string;
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap | null;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const CommonButton: React.FC<CommonButtonProps> = ({
  text,
  onPress,
  iconName,
  buttonStyle,
  textStyle,
  iconStyle,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={accessibilityLabel || text}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      <Ionicons name={iconName} size={21} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    height: "5.9%",
    width: "55%",
    borderRadius: 90,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    flex: 1,
    textAlign: "center",
  },
  icon: {
    marginLeft: 10,
  },
});

export default CommonButton;
