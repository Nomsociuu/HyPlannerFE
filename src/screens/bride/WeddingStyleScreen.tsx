import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useWeddingDress } from "../../contexts/WeddingDressContext";
import WeddingDressFeatureScreen from "../../components/WeddingDressFeatureScreen";
import ErrorRetry from "../../components/ErrorRetry";
import { Style } from "../../types/weddingCostume";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";

const WeddingStyleScreen = () => {
  const { styles, loading, error, retryFetch } = useWeddingDress();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleStylePress = (style: Style) => {
    navigation.navigate("WeddingMaterial");
  };

  if (loading) {
    return (
      <View style={screenStyles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b9d" />
      </View>
    );
  }

  if (error) {
    return <ErrorRetry message={error} onRetry={retryFetch} />;
  }

  return (
    <WeddingDressFeatureScreen
      title="Kiểu dáng"
      currentScreen="WeddingDress"
      data={styles}
      onItemPress={handleStylePress}
    />
  );
};

const screenStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeddingStyleScreen;

