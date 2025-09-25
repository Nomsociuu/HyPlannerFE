import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AlbumCard from '../components/AlbumCard';
import * as userSelectionService from '../service/userSelectionService';
import { Album } from '../service/userSelectionService';
import { fonts } from '../theme/fonts';

const AlbumScreen = () => {
  const navigation = useNavigation();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await userSelectionService.getUserAlbums();
      setAlbums(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải albums');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewAlbum = () => {
    navigation.navigate('ChooseStyle' as never);
  };

  const handleAlbumPress = (album: Album) => {
    navigation.navigate('AlbumDetail' as never, { album } as never);
  };

  const getFirstImage = (album: Album): string => {
    // Get first image from album selections
    if (album.selections && album.selections.length > 0) {
      const firstSelection = album.selections[0];
      // Try to get image from various sources
      if (firstSelection.styles && firstSelection.styles.length > 0) {
        return firstSelection.styles[0].image || '';
      }
      if (firstSelection.accessories?.veils && firstSelection.accessories.veils.length > 0) {
        return firstSelection.accessories.veils[0].image || '';
      }
      if (firstSelection.flowers && firstSelection.flowers.length > 0) {
        return firstSelection.flowers[0].image || '';
      }
    }
    return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop';
  };

  const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPad }] }>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ChooseStyle' as never)}>
          <ChevronLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <Image
            source={require('../../assets/images/default.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tải albums...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAlbums}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.albumGrid}>
            {albums.map((album) => (
              <AlbumCard
                key={album._id}
                id={album._id}
                title={album.name}
                imageUrl={getFirstImage(album)}
                onPress={() => handleAlbumPress(album)}
              />
            ))}
            <AlbumCard
              id="add-new"
              title="Thêm Album mới"
              isAddNew
              onPress={handleAddNewAlbum}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logo: {
    height: 32,
    width: 48,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.montserratMedium,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.montserratMedium,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F9CBD6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: fonts.montserratSemiBold,
    color: '#1f2937',
  },
});

export default AlbumScreen;
