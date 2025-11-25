import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import { fonts } from "../../theme/fonts";
import {
  responsiveFont,
  responsiveWidth,
  responsiveHeight,
  spacing,
} from "../../../assets/styles/utils/responsive";

interface MenuItem {
  id: string;
  title: string;
  backgroundColor: string;
  screen: string;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    title: "Địa điểm",
    backgroundColor: "#E9D5FF", // Light purple
    screen: "Location",
  },
  {
    id: "2",
    title: "Phong cách",
    backgroundColor: "#E9B8FF", // Medium purple
    screen: "Style",
  },
  {
    id: "3",
    title: "Tone màu",
    backgroundColor: "#FFE4E6", // Light pink
    screen: "ColorTone",
  },
  {
    id: "4",
    title: "Lễ ăn hỏi",
    backgroundColor: "#FECDD3", // Medium pink
    screen: "Engagement",
  },
  {
    id: "5",
    title: "Lễ cưới",
    backgroundColor: "#BFDBFE", // Light blue
    screen: "Wedding",
  },
  {
    id: "6",
    title: "Mood board",
    backgroundColor: "#93C5FD", // Medium blue
    screen: "MoodBoard",
  },
];

const ChooseStyleScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: item.backgroundColor }]}
      onPress={() => {
        if (item.id === "5") {
          // Lễ cưới
          navigation.navigate(
            "RoleSelection" as never,
            { from: "wedding" } as never
          );
        } else if (item.id === "4") {
          // Lễ ăn hỏi
          navigation.navigate(
            "RoleSelection" as never,
            { from: "engagement" } as never
          );
        } else if (item.id === "6") {
          // Mood board
          navigation.navigate("Album" as never);
        } else {
          navigation.navigate(item.screen as never);
        }
      }}
    >
      <Text style={styles.itemNumber}>{item.id}.</Text>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const topPad =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 8 : 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Main", { screen: "Home" })}
        >
          <ChevronLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Main", { screen: "Home" })}
        >
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile" as never)}
        >
          <Image
            source={require("../../../assets/images/default.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom:
              Platform.OS === "android"
                ? responsiveHeight(80)
                : responsiveHeight(24),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuGrid}>{menuItems.map(renderMenuItem)}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(20),
    height: responsiveHeight(72),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logo: {
    height: responsiveHeight(32),
    width: responsiveWidth(48),
  },
  avatar: {
    width: responsiveWidth(32),
    height: responsiveWidth(32),
    borderRadius: responsiveWidth(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(16),
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: responsiveHeight(60),
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: responsiveWidth(16),
    paddingVertical: responsiveHeight(20),
  },
  menuItem: {
    width: "47%",
    aspectRatio: 4 / 3,
    borderRadius: responsiveWidth(16),
    padding: responsiveWidth(16),
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemNumber: {
    fontSize: responsiveFont(20),
    fontFamily: fonts.montserratSemiBold,
    color: "#1f2937",
  },
  itemTitle: {
    fontSize: responsiveFont(16),
    fontFamily: fonts.montserratMedium,
    color: "#1f2937",
  },
});

export default ChooseStyleScreen;
