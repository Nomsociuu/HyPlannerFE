import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";

export default function OTPScreen() {
  const [otp, setOtp] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleVerify = () => {
    Keyboard.dismiss();

    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 chữ số.");
      return;
    }

    console.log("OTP submitted:", otp);
    Alert.alert("Thành công", "Mã OTP đã được xác thực.");
  };

  const handleResend = () => {
    console.log("Resending OTP...");
    Alert.alert("Thông báo", "Đã gửi lại mã OTP qua email.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>Nhập mã OTP được gửi qua email</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.otpInput}
            placeholder=""
            placeholderTextColor="#9ca3af"
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus={true}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Mã không gửi được,
              <Text style={styles.resendLink} onPress={handleResend}>
                Gửi lại mã
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { opacity: otp.length === 6 ? 1 : 0.6 }]}
            onPress={handleVerify}
            activeOpacity={0.7}
            disabled={otp.length !== 6}
          >
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              Tiếp theo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 32,
    marginTop: 64,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 28,
    color: "#e56e8a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    alignItems: "center",
  },
  otpInput: {
    height: 56,
    width: "100%",
    marginVertical: 16,
    marginBottom: 40,
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontFamily: "Montserrat-Medium",
    color: "#1f2937",
  },
  resendContainer: {
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
  },
  resendLink: {
    color: "#e56e8a",
    fontWeight: "bold",
    textDecorationLine: "none",
    marginLeft: 4,
    fontFamily: "Montserrat-SemiBold",
  },
  button: {
    height: 52,
    backgroundColor: "#f9cbd6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: "#000000",
  },
});
