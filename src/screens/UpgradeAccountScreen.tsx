import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  ChevronLeft,
  Crown,
  Sparkles,
  Check,
  X,
  Infinity,
  ArrowLeft,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function UpgradeAccountScreen() {
  const navigation = useNavigation();
  const [activeUpgradeTab, setActiveUpgradeTab] = useState("VIP");

  const features = [
    {
      label: "Giá",
      free: "Miễn phí",
      vip: "99.000",
      super: "149.000",
      isPrice: true,
      oldVipPrice: "199.000",
      oldSuperPrice: "299.000",
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#e07181" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nâng cấp Tài Khoản</Text>
        <View style={{ width: 24 }} />
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
            color={activeUpgradeTab === "VIP" ? "#e07181" : "#f1c40f"}
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
            color={activeUpgradeTab === "SUPER" ? "#e07181" : "#3498db"}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
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
    paddingBottom: 15,
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
});
