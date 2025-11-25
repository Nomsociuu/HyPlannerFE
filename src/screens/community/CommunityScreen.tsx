import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Plus,
  Search,
  MoreHorizontal,
  Sparkles,
  Users,
  Image as ImageIcon,
} from "lucide-react-native";
import { AppDispatch, RootState } from "../../store";
import {
  fetchAllPosts,
  deleteExistingPost,
  reactPost,
  unreactPost,
} from "../../store/postSlice";
import { PostCard } from "../../components/PostCard";
import { RootStackParamList } from "../../navigation/types";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFont,
} from "../../../assets/styles/utils/responsive";
import { MixpanelService } from "../../service/mixpanelService";

type CommunityScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CommunityScreen"
>;

const CommunityScreen = () => {
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const { posts, isLoading } = useSelector((state: RootState) => state.posts);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Đảm bảo lấy ID dưới dạng chuỗi
  const currentUserId =
    currentUser?._id?.toString() || currentUser?.id?.toString() || "";

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    MixpanelService.track("Viewed Community");
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchAllPosts());
    setRefreshing(false);
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate("PostDetailScreen", { postId });
  };

  const handleCreatePost = () => {
    navigation.navigate("CreatePostScreen", {});
  };

  const handleNavigateToTopicGroups = () => {
    navigation.navigate("TopicGroupsScreen");
  };

  const handleNavigateToInspireBoard = () => {
    navigation.navigate("InspireBoardScreen");
  };

  const handleNavigateToCommunityAlbums = () => {
    navigation.navigate("CommunityAlbumsScreen");
  };

  const handleReact = (postId: string, reactionType: "like" | "love") => {
    dispatch(reactPost({ postId, reactionType }));
  };

  const handleUnreact = (postId: string) => {
    dispatch(unreactPost(postId));
  };

  const handleDelete = (postId: string) => {
    Alert.alert("Xóa bài viết", "Bạn có chắc chắn muốn xóa bài viết này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => dispatch(deleteExistingPost(postId)),
      },
    ]);
  };

  const handleEdit = (postId: string) => {
    navigation.navigate("CreatePostScreen", { postId });
  };

  const renderPost = ({ item }: any) => (
    <PostCard
      post={item}
      currentUserId={currentUserId}
      onPress={() => handlePostPress(item._id)}
      onReact={(type) => handleReact(item._id, type)}
      onUnreact={() => handleUnreact(item._id)}
      onDelete={() => handleDelete(item._id)}
      onEdit={() => handleEdit(item._id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />

      {/* Header - Thread Style */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Main", { screen: "Home" } as never)
            }
          >
            <Image
              source={{
                uri: currentUser?.avatarUrl || "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.logo}>HyPlanner</Text>
          <TouchableOpacity style={styles.menuButton}>
            <MoreHorizontal size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity
          style={styles.quickAccessButton}
          onPress={handleNavigateToInspireBoard}
        >
          <Sparkles size={20} color="#ffc107" />
          <Text style={styles.quickAccessText}>Cảm hứng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickAccessButton}
          onPress={handleNavigateToTopicGroups}
        >
          <Users size={20} color="#ff6b9d" />
          <Text style={styles.quickAccessText}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickAccessButton}
          onPress={handleNavigateToCommunityAlbums}
        >
          <ImageIcon size={20} color="#9333ea" />
          <Text style={styles.quickAccessText}>Albums</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1f2937" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#1f2937"]}
              tintColor="#1f2937"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Chào mừng đến cộng đồng!</Text>
              <Text style={styles.emptyText}>
                Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Plus size={28} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: responsiveWidth(16),
    paddingTop: responsiveHeight(8),
    paddingBottom: responsiveHeight(12),
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    backgroundColor: "#e5e7eb",
  },
  logo: {
    fontFamily: "Agbalumo",
    fontSize: responsiveFont(24),
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  menuButton: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: responsiveWidth(16),
    marginTop: responsiveHeight(12),
    marginBottom: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(16),
    height: responsiveHeight(44),
    borderRadius: responsiveWidth(22),
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: responsiveWidth(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: "Montserrat-Medium",
    fontSize: responsiveFont(14),
    color: "#1f2937",
  },
  quickAccessContainer: {
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(16),
    gap: responsiveWidth(12),
    marginBottom: responsiveHeight(8),
  },
  quickAccessButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(12),
    borderRadius: responsiveWidth(12),
    gap: responsiveWidth(6),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickAccessText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: responsiveFont(13),
    color: "#1f2937",
  },
  listContent: {
    paddingTop: responsiveHeight(8),
    paddingBottom:
      Platform.OS === "android" ? responsiveHeight(120) : responsiveHeight(100),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: responsiveHeight(100),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: responsiveHeight(120),
    paddingHorizontal: responsiveWidth(32),
  },
  emptyTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: responsiveFont(20),
    color: "#1f2937",
    textAlign: "center",
    marginBottom: responsiveHeight(8),
  },
  emptyText: {
    fontFamily: "Montserrat-Medium",
    fontSize: responsiveFont(14),
    color: "#6b7280",
    textAlign: "center",
    lineHeight: responsiveHeight(20),
  },
  fab: {
    position: "absolute",
    right: responsiveWidth(16),
    bottom:
      Platform.OS === "android" ? responsiveHeight(40) : responsiveHeight(24),
    width: responsiveWidth(56),
    height: responsiveWidth(56),
    borderRadius: responsiveWidth(28),
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CommunityScreen;
