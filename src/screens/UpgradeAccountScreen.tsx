import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ChevronLeft,
  Crown,
  Sparkles,
  Check,
  X,
  Infinity,
  ArrowLeft,
  CheckCircle,
} from "lucide-react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  NavigationProp,
} from "@react-navigation/native";
import { Linking } from "react-native";
import apiClient from "../api/client";
import { useAppDispatch } from "../store/hooks";
import { fetchUserInvitation } from "../store/invitationSlice";
import { RootStackParamList } from "src/navigation/AppNavigator";

export default function UpgradeAccountScreen() {
  console.log("--- MÀN HÌNH UPGRADE ĐƯỢC RENDER ---"); // Log khi component render

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  type UpgradeAccountRouteParams = { status?: string };
  const route = useRoute() as { params?: UpgradeAccountRouteParams };
  const dispatch = useAppDispatch();

  const [activeUpgradeTab, setActiveUpgradeTab] = useState("VIP");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log("--- useFocusEffect ĐƯỢC KÍCH HOẠT ---");
      console.log("Toàn bộ route object:", JSON.stringify(route, null, 2));
      console.log("Kiểm tra route.params:", route.params);

      if (route.params?.status) {
        console.log(`TÌM THẤY STATUS: ${route.params.status}`);
        if (route.params.status === "success") {
          console.log("==> Đang xử lý logic SUCCESS");
          dispatch(fetchUserInvitation());
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 3000);
        } else if (route.params.status === "cancelled") {
          console.log("==> Đang xử lý logic CANCELLED");
          Alert.alert("Thông báo", "Giao dịch đã bị hủy.");
        }
        console.log("Đang xóa params...");
        navigation.setParams({ status: undefined });
      } else {
        console.log("KHÔNG TÌM THẤY 'status' TRONG route.params");
      }
    }, [route.params]) // Chỉ chạy lại khi params thay đổi
  );

  const handleUpgrade = async (packageType: string) => {
    setIsProcessing(true);
    let orderDetails = {};
    if (packageType === "VIP") {
      orderDetails = {
        description: "Nang cap VIP HyPlanner",
        price: 5000,
        packageType: "VIP",
      };
    } else if (packageType === "SUPER") {
      orderDetails = {
        description: "Nang cap SUPER HyPlanner",
        price: 149000,
        packageType: "SUPER",
      };
    }

    try {
      const response = await apiClient.post(
        "/payments/create-link",
        orderDetails
      );
      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
      }
    } catch (error: any) {
      console.error("Lỗi khi nâng cấp:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể tạo yêu cầu thanh toán vào lúc này."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      label: "Giá",
      free: "Miễn phí",
      vip: "99.000 đ",
      super: "149.000 đ",
      isPrice: true,
      oldVipPrice: "199.000 đ",
      oldSuperPrice: "299.000 đ",
    },
    {
      label: "Giới hạn checklist",
      free: <Infinity color="#666" size={18} />,
      vip: <Infinity color="#666" size={18} />,
      super: <Infinity color="#666" size={18} />,
    },
    {
      label: "Giới hạn ngân sách",
      free: <Infinity color="#666" size={18} />,
      vip: <Infinity color="#666" size={18} />,
      super: <Infinity color="#666" size={18} />,
    },
    {
      label: "Giới hạn nhà cung cấp",
      free: <Infinity color="#666" size={18} />,
      vip: <Infinity color="#666" size={18} />,
      super: <Infinity color="#666" size={18} />,
    },
    {
      label: "Giới hạn danh sách khách",
      free: <Infinity color="#666" size={18} />,
      vip: <Infinity color="#666" size={18} />,
      super: <Infinity color="#666" size={18} />,
    },
    {
      label: "Thời hạn website được công khai",
      free: "3 Tháng",
      vip: "1 Năm",
      super: "Trọn đời",
    },
    { label: "Số lượng ảnh album", free: "6", vip: "20", super: "50" },
    {
      label: "Tính năng cơ bản",
      free: <Check color="#2ecc71" size={20} />,
      vip: <Check color="#2ecc71" size={20} />,
      super: <Check color="#2ecc71" size={20} />,
    },
    {
      label: "Loại bỏ quảng cáo",
      free: <X color="#e74c3c" size={20} />,
      vip: <Check color="#2ecc71" size={20} />,
      super: <Check color="#2ecc71" size={20} />,
    },
    {
      label: "Hộp mừng cưới",
      free: <X color="#e74c3c" size={20} />,
      vip: <Check color="#2ecc71" size={20} />,
      super: <Check color="#2ecc71" size={20} />,
    },
  ];

  const renderFeatureCell = (content: React.ReactNode) => {
    if (React.isValidElement(content)) {
      return content;
    }
    return <Text style={styles.featureCellText}>{content}</Text>;
  };

  const selectedPackagePrice =
    activeUpgradeTab === "VIP" ? features[0].vip : features[0].super;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#e07181" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nâng cấp Tài Khoản</Text>
      </View>

      <View style={styles.upgradeTabsContainer}>
        <TouchableOpacity
          style={[
            styles.upgradeTabButton,
            activeUpgradeTab === "VIP" && styles.activeUpgradeTabButton,
          ]}
          onPress={() => setActiveUpgradeTab("VIP")}
        >
          <Crown
            size={16}
            color={activeUpgradeTab === "VIP" ? "#fff" : "#f1c40f"}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.upgradeTabButtonText,
              activeUpgradeTab === "VIP" && styles.activeUpgradeTabButtonText,
            ]}
          >
            Nâng cấp VIP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.upgradeTabButton,
            activeUpgradeTab === "SUPER" && styles.activeUpgradeTabButton,
          ]}
          onPress={() => setActiveUpgradeTab("SUPER")}
        >
          <Sparkles
            size={16}
            color={activeUpgradeTab === "SUPER" ? "#fff" : "#3498db"}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.upgradeTabButtonText,
              activeUpgradeTab === "SUPER" && styles.activeUpgradeTabButtonText,
            ]}
          >
            Nâng cấp SUPER
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCellLabel}></Text>
            <View style={styles.verticalSeparator} />
            <Text style={styles.tableHeaderCell}>FREE</Text>
            <View style={styles.verticalSeparator} />
            <Text style={styles.tableHeaderCell}>VIP</Text>
            <View style={styles.verticalSeparator} />
            <Text style={styles.tableHeaderCell}>SUPER</Text>
          </View>

          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <Text style={styles.featureLabelText}>{feature.label}</Text>
              <View style={styles.verticalSeparator} />
              <View style={styles.featureCell}>
                {renderFeatureCell(feature.free)}
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.featureCell}>
                {feature.isPrice ? (
                  <>
                    <Text style={styles.oldPrice}>{feature.oldVipPrice}</Text>
                    <Text style={styles.price}>{feature.vip}</Text>
                  </>
                ) : (
                  renderFeatureCell(feature.vip)
                )}
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.featureCell}>
                {feature.isPrice ? (
                  <>
                    <Text style={styles.oldPrice}>{feature.oldSuperPrice}</Text>
                    <Text style={styles.price}>{feature.super}</Text>
                  </>
                ) : (
                  renderFeatureCell(feature.super)
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.upgradeButton, isProcessing && styles.buttonDisabled]}
          onPress={() => handleUpgrade(activeUpgradeTab)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.upgradeButtonText}>
              Nâng cấp {activeUpgradeTab}: {selectedPackagePrice}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {showSuccessOverlay && (
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <CheckCircle size={60} color="#2ecc71" />
            <Text style={styles.successTitle}>Nâng cấp thành công!</Text>
            <Text style={styles.successSubtitle}>
              Tài khoản của bạn đã được cập nhật.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: "#e07181",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    left: 40,
    right: 40,
  },
  upgradeTabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  upgradeTabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeUpgradeTabButton: {
    backgroundColor: "#e07181",
    borderColor: "#e07181",
  },
  upgradeTabButtonText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#555",
    fontWeight: "bold",
    fontSize: 14,
  },
  activeUpgradeTabButtonText: {
    color: "#fff",
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Tăng padding để không bị nút che mất
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
  },
  tableHeaderCellLabel: {
    fontFamily: "Montserrat-SemiBold",
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  tableHeaderCell: {
    fontFamily: "Montserrat-SemiBold",
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#fdfdfd",
  },
  featureLabelText: {
    fontFamily: "Montserrat-Medium",
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#555",
  },
  featureCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCellText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  oldPrice: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  price: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    fontWeight: "bold",
    color: "#e07181",
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  upgradeButton: {
    backgroundColor: "#e07181",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#f2b6c0",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-SemiBold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    width: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
