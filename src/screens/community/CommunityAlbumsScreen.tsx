import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, Bookmark, Eye } from "lucide-react-native";
import * as albumService from "../../service/albumService";
import AlbumCard from "../../components/AlbumCard";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFont,
} from "../../../assets/styles/utils/responsive";

export const CommunityAlbumsScreen = ({ navigation }: any) => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "featured" | "trending"
  >("all");

  useEffect(() => {
    loadAlbums();
  }, [selectedFilter]);

  const loadAlbums = async (pageNum: number = 1, append: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let result;
      if (selectedFilter === "featured") {
        result = await albumService.getFeaturedAlbums(20);
        setAlbums(result);
        setHasMore(false);
      } else {
        const response = await albumService.getAllAlbums(pageNum, 20);
        const newAlbums = response.albums || [];

        if (append) {
          setAlbums((prev) => [...prev, ...newAlbums]);
        } else {
          setAlbums(newAlbums);
        }

        setHasMore(response.pagination?.hasNextPage || newAlbums.length === 20);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error loading community albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlbums(1, false);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore && selectedFilter === "all") {
      loadAlbums(page + 1, true);
    }
  };

  const handleAlbumPress = (albumId: string) => {
    navigation.navigate("AlbumDetail", { albumId });
  };

  const handleFilterChange = (filter: "all" | "featured" | "trending") => {
    setSelectedFilter(filter);
    setPage(1);
    setHasMore(true);
  };

  const renderAlbum = ({ item }: any) => (
    <View style={styles.albumWrapper}>
      <AlbumCard
        id={item._id}
        title={item.name || "Album"}
        imageUrl={item.images?.[0] || item.coverImage}
        onPress={() => handleAlbumPress(item._id)}
      />
      <View style={styles.albumStats}>
        <View style={styles.statItem}>
          <Heart size={14} color="#ff6b9d" />
          <Text style={styles.statText}>{item.totalVotes || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Bookmark size={14} color="#ffc107" />
          <Text style={styles.statText}>{item.totalSaves || 0}</Text>
        </View>
        {item.averageRating > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.ratingText}>
              ⭐ {item.averageRating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      {item.user && (
        <Text style={styles.userName} numberOfLines={1}>
          bởi {item.user.fullName || "Ẩn danh"}
        </Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Album Cộng Đồng</Text>
        <Text style={styles.subtitle}>
          Khám phá ý tưởng từ các cặp đôi khác
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange("all")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "all" && styles.filterTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "featured" && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange("featured")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "featured" && styles.filterTextActive,
            ]}
          >
            💎 Nổi bật
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || albums.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#ff6b9d" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isLoading && albums.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b9d" />
        </View>
      ) : (
        <FlatList
          data={albums}
          keyExtractor={(item) => item._id}
          renderItem={renderAlbum}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có album công khai</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#ff6b9d"]}
              tintColor="#ff6b9d"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
  title: {
    fontSize: responsiveFont(28),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: responsiveHeight(0.5),
  },
  subtitle: {
    fontSize: responsiveFont(14),
    color: "#666",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(2),
    gap: responsiveWidth(3),
  },
  filterButton: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterButtonActive: {
    backgroundColor: "#ff6b9d",
    borderColor: "#ff6b9d",
  },
  filterText: {
    fontSize: responsiveFont(14),
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(3),
  },
  row: {
    justifyContent: "space-between",
  },
  albumWrapper: {
    flex: 1,
    marginBottom: responsiveHeight(1),
  },
  albumStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(1),
    gap: responsiveWidth(2),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: responsiveFont(12),
    color: "#666",
  },
  ratingText: {
    fontSize: responsiveFont(12),
    fontWeight: "600",
    color: "#ffc107",
  },
  userName: {
    fontSize: responsiveFont(12),
    color: "#999",
    marginTop: 2,
    paddingHorizontal: responsiveWidth(1),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: responsiveHeight(2),
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

export default CommunityAlbumsScreen;
