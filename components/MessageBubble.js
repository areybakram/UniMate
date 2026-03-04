import { Linking, Text, View } from "react-native";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split text into parts: URLs and normal text
  const renderTextWithLinks = (text) => {
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Text
            key={index}
            style={{ color: "#0A5EFF", textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      } else {
        return (
          <Text key={index} style={{ color: isUser ? "#fff" : "#000" }}>
            {part}
          </Text>
        );
      }
    });
  };

  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#0A5EFF" : "#fff",
        padding: 12,
        borderRadius: 18,
        marginVertical: 6,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Text>{renderTextWithLinks(message.content)}</Text>
    </View>
  );
};

export default MessageBubble;
