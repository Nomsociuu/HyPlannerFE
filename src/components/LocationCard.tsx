import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Check } from "lucide-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  responsiveFont,
  responsiveWidth,
  responsiveHeight,
} from "../../assets/styles/utils/responsive";

const { width } = Dimensions.get("window");

interface LocationCardProps {
  id: string;
  name: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  onPress?: () => void;
  showPinButton?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  id,
  name,
  image,
  isSelected,
  onSelect,
  onPress,
  showPinButton = true,
}) => {
  const getItemWidth = () => {
    const paddingHorizontal = 32; // 16px on each side
    const gap = 8;
    const availableWidth = width - paddingHorizontal;
    const totalGapWidth = gap; // 1 gap between 2 items
    return (availableWidth - totalGapWidth) / 2;
  };

  const getItemHeight = () => {
    return getItemWidth(); // Square aspect ratio
  };

  const itemWidth = getItemWidth();
  const itemHeight = getItemHeight();

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { width: itemWidth }]}
      onPress={onPress || onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={encodeURI(image)}
          style={[
            styles.itemImage,
            { width: itemWidth - 12, height: itemHeight },
          ]}
          contentFit="cover"
          cachePolicy="immutable"
          transition={0}
          placeholder={require("../../assets/images/default.png") as any}
          recyclingKey={id}
        />
        {showPinButton && (
          <View style={[styles.pinIconContainer, { top: itemHeight - 25 }]}>
            <Pressable
              style={[
                styles.pinButton,
                isSelected ? styles.pinButtonSelected : undefined,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {isSelected ? (
                <Check size={12} color="#E07181" style={styles.checkIcon} />
              ) : (
                <FontAwesome5
                  name="thumbtack"
                  size={12}
                  color="#ffffff"
                  style={styles.pinIcon}
                />
              )}
            </Pressable>
          </View>
        )}
      </View>
      <Text style={styles.itemName} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: responsiveHeight(24),
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    borderRadius: responsiveWidth(8),
    overflow: "hidden",
    marginBottom: responsiveHeight(8),
  },
  itemImage: {
    borderRadius: responsiveWidth(8),
  },
  pinIconContainer: {
    position: "absolute",
    right: responsiveWidth(3),
    zIndex: 1,
  },
  pinButton: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    backgroundColor: "#F9A8D4",
    borderRadius: responsiveWidth(10),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinButtonSelected: {
    backgroundColor: "#ffffff",
  },
  checkIcon: {
    backgroundColor: "#fff",
    borderRadius: responsiveWidth(10),
    padding: responsiveWidth(4),
  },
  pinIcon: {
    transform: [{ rotate: "45deg" }],
  },
  itemName: {
    fontSize: responsiveFont(14),
    fontWeight: "500",
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default LocationCard;
