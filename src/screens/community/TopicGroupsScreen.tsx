import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllTopicGroups,
  fetchMyTopicGroups,
} from "../../store/topicGroupSlice";
import { TopicGroupCard } from "../../components/TopicGroupCard";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFont,
} from "../../../assets/styles/utils/responsive";

export const TopicGroupsScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { groups, myGroups, isLoading } = useAppSelector(
    (state: any) => state.topicGroups
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "my">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const categories = [
    "All",
    "Rustic",
    "DIY",
    "Outdoor Photography",
    "Budget Saving",
    "Venue Selection",
    "Dress & Fashion",
    "Decoration",
  ];

  useEffect(() => {
    loadGroups();
  }, [selectedTab, selectedCategory, searchQuery]);

  const loadGroups = () => {
    if (selectedTab === "all") {
      dispatch(
        fetchAllTopicGroups({
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery || undefined,
        })
      );
    } else {
      dispatch(fetchMyTopicGroups());
    }
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate("TopicGroupDetail", { groupId });
  };

  const handleCreateGroup = () => {
    navigation.navigate("CreateTopicGroup");
  };

  const displayedGroups = selectedTab === "all" ? groups : myGroups;
  const myGroupIds = myGroups.map((g: any) => g._id);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Nhóm Chủ Đề</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhóm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "all" && styles.activeTab]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "all" && styles.activeTabText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "my" && styles.activeTab]}
          onPress={() => setSelectedTab("my")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "my" && styles.activeTabText,
            ]}
          >
            Của tôi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      {selectedTab === "all" && (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          style={styles.categoriesList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (selectedCategory === item ||
                  (item === "All" && !selectedCategory)) &&
                  styles.activeCategoryChip,
              ]}
              onPress={() =>
                setSelectedCategory(item === "All" ? undefined : item)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  (selectedCategory === item ||
                    (item === "All" && !selectedCategory)) &&
                    styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Groups List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
        </View>
      ) : (
        <FlatList
          data={displayedGroups}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TopicGroupCard
              group={item}
              onPress={() => handleGroupPress(item._id)}
              joined={myGroupIds.includes(item._id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có nhóm nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFont(24),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  createButton: {
    backgroundColor: "#e91e63",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: responsiveWidth(2),
  },
  searchInput: {
    flex: 1,
    paddingVertical: responsiveHeight(1.5),
    fontSize: responsiveFont(15),
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveHeight(1),
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#e91e63",
  },
  tabText: {
    fontSize: responsiveFont(15),
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  categoriesList: {
    maxHeight: responsiveHeight(5),
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
  },
  categoryChip: {
    backgroundColor: "#fff",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: 20,
    marginRight: responsiveWidth(2),
  },
  activeCategoryChip: {
    backgroundColor: "#e91e63",
  },
  categoryText: {
    fontSize: responsiveFont(14),
    color: "#666",
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    marginTop: responsiveHeight(10),
    alignItems: "center",
  },
  emptyText: {
    fontSize: responsiveFont(16),
    color: "#999",
  },
});
