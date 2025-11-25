import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles } from "lucide-react-native";
import * as postService from "../../service/postService";
import * as albumService from "../../service/albumService";
import { PostCard } from "../../components/PostCard";
import AlbumCard from "../../components/AlbumCard";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFont,
} from "../../../assets/styles/utils/responsive";

export const InspireBoardScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<"posts" | "albums">("posts");
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadInspireData();
  }, [selectedTab]);

  const loadInspireData = async () => {
    setIsLoading(true);
    try {
      if (selectedTab === "posts") {
        const [featured, trending] = await Promise.all([
          postService.getFeaturedPosts(10),
          postService.getTrendingPosts(10, 7),
        ]);
        setFeaturedPosts(featured);
        setTrendingPosts(trending);
      } else {
        const albums = await albumService.getFeaturedAlbums(20);
        setFeaturedAlbums(albums);
      }
    } catch (error) {
      console.error("Error loading inspire data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate("PostDetail", { postId });
  };

  const handleAlbumPress = (albumId: string) => {
    navigation.navigate("AlbumDetail", { albumId });
  };

  const renderPost = ({ item }: any) => (
    <PostCard
      post={item}
      currentUserId={currentUserId}
      onPress={() => handlePostPress(item._id)}
      onReact={(type) => console.log("React", type)}
      onUnreact={() => console.log("Unreact")}
    />
  );

  const renderAlbum = ({ item }: any) => (
    <AlbumCard
      id={item._id}
      title={item.name || "Album"}
      imageUrl={item.coverImage}
      onPress={() => handleAlbumPress(item._id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Sparkles size={32} color="#ffc107" />
        <Text style={styles.title}>Bảng Cảm Hứng</Text>
      </View>

      <Text style={styles.subtitle}>
        Những ý tưởng được yêu thích nhất từ cộng đồng
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "posts" && styles.activeTab]}
          onPress={() => setSelectedTab("posts")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "posts" && styles.activeTabText,
            ]}
          >
            Bài viết
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "albums" && styles.activeTab]}
          onPress={() => setSelectedTab("albums")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "albums" && styles.activeTabText,
            ]}
          >
            Album
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffc107" />
        </View>
      ) : (
        <>
          {selectedTab === "posts" ? (
            <FlatList
              data={featuredPosts.length > 0 ? featuredPosts : trendingPosts}
              keyExtractor={(item) => item._id}
              renderItem={renderPost}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                featuredPosts.length > 0 ? (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>⭐ Nổi bật tuần này</Text>
                  </View>
                ) : (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Đang thịnh hành</Text>
                  </View>
                )
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Chưa có bài viết nổi bật</Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={featuredAlbums}
              keyExtractor={(item) => item._id}
              renderItem={renderAlbum}
              contentContainerStyle={styles.listContent}
              numColumns={2}
              columnWrapperStyle={styles.albumRow}
              ListHeaderComponent={
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    💎 Album được yêu thích
                  </Text>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Chưa có album nổi bật</Text>
                </View>
              }
            />
          )}
        </>
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
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
  title: {
    fontSize: responsiveFont(28),
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: responsiveWidth(3),
  },
  subtitle: {
    fontSize: responsiveFont(14),
    color: "#666",
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
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
    backgroundColor: "#ffc107",
  },
  tabText: {
    fontSize: responsiveFont(15),
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  sectionHeader: {
    paddingVertical: responsiveHeight(1.5),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(2),
  },
  albumRow: {
    justifyContent: "space-between",
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
