import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: { prefillUsername?: string } | undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Wishlist: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: number };
};

// Composite prop typings for correct TS compilation in nested screens
export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type WishlistScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Wishlist'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
