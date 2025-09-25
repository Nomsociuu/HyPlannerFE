import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Bold } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }

    // Handle form submission
    console.log("Email submitted:", email);
    navigation.navigate("OTP");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Quên mật khẩu</Text>
          <Text style={styles.subtitle}>Hãy nhập lại email của bạn</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: email ? 1 : 0.6 }]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={!email}
        >
          <Text style={styles.buttonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    padding: 32,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    fontWeight: "500",
    color: "#e56e8a",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    fontFamily: "Montserrat-Medium",
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  button: {
    height: 48,
    backgroundColor: "#f9cbd6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#000000",
  },
});
