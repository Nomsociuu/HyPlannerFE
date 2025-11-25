// src/navigation/RootStackNavigator.tsx

import React, { useEffect } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { User } from "lucide-react-native";

// Types và configs đã tách ra
import { RootStackParamList } from "./types";
import { linking } from "./linking";
import { MainTabNavigator } from "./MainTabNavigator";

// Redux
import { selectCurrentUser, selectRememberMe } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUserInvitation } from "../store/invitationSlice";

// Import tất cả các màn hình
import BeginScreen from "../screens/auth/BeginScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
// ... (import tất cả các màn hình khác của bạn ở đây)
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OTPScreen from "../screens/auth/OTPScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";
import PasswordUpdatedScreen from "../screens/auth/PasswordUpdatedScreen";
import InviteOrCreateScreen from "../screens/auth/InviteOrCreateScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import InvitationLettersScreen from "../screens/invitation/InvitationLetterScreen";
import CreateWeddingSiteScreen from "../screens/invitation/CreateWeddingSiteScreen";
import EditCoupleInfoScreen from "../screens/invitation/EditCoupleInfoScreen";
import WebsiteManagementScreen from "../screens/invitation/WebsiteManagementScreen";
import UpgradeAccountScreen from "../screens/payment/UpgradeAccountScreen";
import PaymentSuccessScreen from "../screens/payment/PaymentSuccessScreen";
import PaymentCancelledScreen from "../screens/payment/PaymentCancelledScreen";
import TaskListScreen from "../screens/tasks/TaskListScreen";
import CreateNewTaskScreen from "../screens/tasks/CreateNewTaskScreen";
import EditTaskScreen from "../screens/tasks/EditTaskScreen";
import AddMemberScreen from "../screens/profile/AddMemberScreen";
import AddWeddingInfo from "../screens/wedding-setup/AddWeddingInfo";
import JoinWeddingEvent from "../screens/wedding-setup/JoinWeddingEvent";
import BudgetListScreen from "../screens/budget/BudgetListScreen";
import CreateNewBudgetScreen from "../screens/budget/CreateNewBudgetScreen";
import EditBudgetScreen from "../screens/budget/EditBudgetScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import ChooseStyleScreen from "../screens/wedding-setup/ChooseStyleScreen";
import WeddingDressScreen from "../screens/bride/WeddingDressScreen";
import WeddingMaterialScreen from "../screens/bride/WeddingMaterialScreen";
import WeddingNecklineScreen from "../screens/bride/WeddingNecklineScreen";
import WeddingDetailScreen from "../screens/bride/WeddingDetailScreen";
import AccessoriesScreen from "../screens/accessories/AccessoriesScreen";
import WeddingFlowersScreen from "../screens/venue-theme/WeddingFlowersScreen";
import LocationScreen from "../screens/venue-theme/LocationScreen";
import StyleScreen from "../screens/venue-theme/StyleScreen";
import ColorToneScreen from "../screens/venue-theme/ColorToneScreen";
import AccessoriesJewelryScreen from "../screens/accessories/AccessoriesJewelryScreen";
import AccessoriesHairClipScreen from "../screens/accessories/AccessoriesHairClipScreen";
import AccessoriesCrownScreen from "../screens/accessories/AccessoriesCrownScreen";
import AlbumScreen from "../screens/album/AlbumScreen";
import AlbumDetailScreen from "../screens/album/AlbumDetailScreen";
import MoodBoardsScreen from "../screens/album/MoodBoardsScreen";
import NotificationsScreen from "../screens/home/NotificationsScreen";
import GroomSuitScreen from "../screens/groom/GroomSuitScreen";
import GroomMaterialScreen from "../screens/groom/GroomMaterialScreen";
import GroomColorScreen from "../screens/groom/GroomColorScreen";
import GroomAccessoriesLapelScreen from "../screens/groom/GroomAccessoriesLapelScreen";
import GroomAccessoriesPocketSquareScreen from "../screens/groom/GroomAccessoriesPocketSquareScreen";
import GroomAccessoriesDecorScreen from "../screens/groom/GroomAccessoriesDecorScreen";
import BrideAoDaiStyleScreen from "../screens/bride/BrideAoDaiStyleScreen";
import BrideAoDaiMaterialScreen from "../screens/bride/BrideAoDaiMaterialScreen";
import BrideAoDaiPatternScreen from "../screens/bride/BrideAoDaiPatternScreen";
import BrideHeadscarfScreen from "../screens/bride/BrideHeadscarfScreen";
import GroomEngagementOutfitScreen from "../screens/groom/GroomEngagementOutfitScreen";
import GroomEngagementAccessoriesScreen from "../screens/groom/GroomEngagementAccessoriesScreen";
import EditPhaseScreen from "../screens/tasks/EditPhase/EditPhaseScreen";
import WhoIsNextMarriedScreen from "../screens/shared/WhoIsNextMarriedScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import PostDetailScreen from "../screens/community/PostDetailScreen";
import CreatePostScreen from "../screens/community/CreatePostScreen";
import { TopicGroupsScreen } from "../screens/community/TopicGroupsScreen";
import { TopicGroupDetailScreen } from "../screens/community/TopicGroupDetailScreen";
import { InspireBoardScreen } from "../screens/community/InspireBoardScreen";
import CommunityAlbumsScreen from "../screens/community/CommunityAlbumsScreen";
import GuestManagementScreen from "../screens/guest/GuestManagementScreen";
import GuestDetailScreen from "../screens/guest/GuestDetailScreen";

const Stack = createStackNavigator<RootStackParamList>();

// Component HeaderAvatar
const HeaderAvatar = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) => {
  const user = useAppSelector(selectCurrentUser);
  const picture = user?.picture;

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      {picture ? (
        <Image source={{ uri: picture }} style={headerStyles.avatar} />
      ) : (
        <View style={[headerStyles.avatar, { backgroundColor: "#e5e7eb" }]}>
          <User color="#9ca3af" size={24} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const RootStackNavigator = () => {
  const user = useAppSelector(selectCurrentUser);
  const rememberMe = useAppSelector(selectRememberMe);
  const dispatch = useAppDispatch();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // Xác định màn hình khởi đầu dựa trên auth state
  const getInitialRouteName = (): keyof RootStackParamList => {
    // Nếu user đã login và có rememberMe, auto-navigate đến Main
    if (user && rememberMe) {
      return "Main";
    }
    // Ngược lại, hiển thị BeginScreen
    return "BeginScreen";
  };

  useEffect(() => {
    const handleDeepLink = (url: string | null) => {
      if (!url || !navigationRef.isReady()) return;
      const { path, queryParams } = Linking.parse(url);
      if (path === "upgrade-account" && queryParams) {
        navigationRef.navigate("UpgradeAccountScreen", queryParams);
      }
    };
    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener("url", ({ url }) =>
      handleDeepLink(url)
    );
    return () => subscription.remove();
  }, [navigationRef]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserInvitation());
    }
  }, [user, dispatch]);

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      fallback={<Text>Loading...</Text>}
    >
      <Stack.Navigator initialRouteName={getInitialRouteName()}>
        {/* Các màn hình Auth & Onboarding */}
        <Stack.Screen
          name="BeginScreen"
          component={BeginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasswordUpdated"
          component={PasswordUpdatedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InviteOrCreate"
          component={InviteOrCreateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{ headerShown: false }}
        />

        {/* Màn hình chính chứa Tab Navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={({ navigation }) => ({
            headerTitle: "Hỷ Planner",
            headerTitleStyle: headerStyles.title,
            headerRight: () => <HeaderAvatar navigation={navigation} />,
            headerLeft: () => <View style={{ width: 15 }} />,
            headerTitleAlign: "left",
            headerStyle: {
              backgroundColor: "#fff",
              elevation: 1,
              shadowOpacity: 0.1,
            },
          })}
        />

        {/* Các màn hình khác */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpgradeAccountScreen"
          component={UpgradeAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InvitationLettersScreen"
          component={InvitationLettersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateWeddingSite"
          component={CreateWeddingSiteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebsiteManagement"
          component={WebsiteManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditCoupleInfo"
          component={EditCoupleInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentCancelled"
          component={PaymentCancelledScreen}
          options={{ headerShown: false }}
        />

        {/* ...Thêm tất cả các Stack.Screen còn lại của bạn vào đây... */}
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={CreateNewTaskScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTaskScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BudgetList"
          component={BudgetListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddBudget"
          component={CreateNewBudgetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditBudget"
          component={EditBudgetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPhaseScreen"
          component={EditPhaseScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMemberScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddWeddingInfo"
          component={AddWeddingInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinWedding"
          component={JoinWeddingEvent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseStyle"
          component={ChooseStyleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeddingDress"
          component={WeddingDressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accessories"
          component={AccessoriesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeddingMaterial"
          component={WeddingMaterialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeddingNeckline"
          component={WeddingNecklineScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeddingDetail"
          component={WeddingDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeddingFlowers"
          component={WeddingFlowersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Style"
          component={StyleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ColorTone"
          component={ColorToneScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccessoriesJewelry"
          component={AccessoriesJewelryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccessoriesHairClip"
          component={AccessoriesHairClipScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccessoriesCrown"
          component={AccessoriesCrownScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlbumDetail"
          component={AlbumDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrideAoDaiStyle"
          component={BrideAoDaiStyleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrideAoDaiMaterial"
          component={BrideAoDaiMaterialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrideAoDaiPattern"
          component={BrideAoDaiPatternScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrideHeadscarf"
          component={BrideHeadscarfScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomEngagementOutfit"
          component={GroomEngagementOutfitScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomEngagementAccessories"
          component={GroomEngagementAccessoriesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomSuit"
          component={GroomSuitScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomMaterial"
          component={GroomMaterialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomColor"
          component={GroomColorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomAccessoriesLapel"
          component={GroomAccessoriesLapelScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomAccessoriesPocketSquare"
          component={GroomAccessoriesPocketSquareScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroomAccessoriesDecor"
          component={GroomAccessoriesDecorScreen}
          options={{ headerShown: false }}
        />
        {/* Who is next married screen */}
        <Stack.Screen
          name="WhoIsNextMarried"
          component={WhoIsNextMarriedScreen}
          options={{ headerShown: false }}
        />
        {/* Community Screens */}
        <Stack.Screen
          name="CommunityScreen"
          component={CommunityScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetailScreen"
          component={PostDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatePostScreen"
          component={CreatePostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopicGroupsScreen"
          component={TopicGroupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopicGroupDetailScreen"
          component={TopicGroupDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InspireBoardScreen"
          component={InspireBoardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommunityAlbumsScreen"
          component={CommunityAlbumsScreen}
          options={{ headerShown: false }}
        />
        {/* Guest Management Screens */}
        <Stack.Screen
          name="GuestManagementScreen"
          component={GuestManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GuestDetailScreen"
          component={GuestDetailScreen}
          options={{ headerShown: false }}
        />
        {/* MoodBoards Screen */}
        <Stack.Screen
          name="MoodBoards"
          component={MoodBoardsScreen}
          options={{ headerShown: false }}
        />
        {/* Notifications Screen */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const headerStyles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: "Agbalumo",
    color: "#ff6b9d",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootStackNavigator;
