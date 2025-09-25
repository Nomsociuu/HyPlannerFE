import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import WeddingItemCard from '../components/WeddingItemCard';
import { fonts } from '../theme/fonts';
import { Album } from '../service/userSelectionService';

const { width } = Dimensions.get('window');

interface RouteParams {
  album: Album;
}

const AlbumDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { album } = route.params as RouteParams;
  
  const [allItems, setAllItems] = useState<any[]>([]);

  useEffect(() => {
    // Flatten all selections into a single array for display
    const items: any[] = [];
    
    if (album.selections && album.selections.length > 0) {
      album.selections.forEach(selection => {
        // Add styles
        if (selection.styles && selection.styles.length > 0) {
          selection.styles.forEach(style => {
            items.push({
              ...style,
              category: 'Kiểu dáng',
              categoryColor: '#FEF0F3'
            });
          });
        }
        
        // Add materials
        if (selection.materials && selection.materials.length > 0) {
          selection.materials.forEach(material => {
            items.push({
              ...material,
              category: 'Chất liệu',
              categoryColor: '#F0F9FF'
            });
          });
        }
        
        // Add necklines
        if (selection.necklines && selection.necklines.length > 0) {
          selection.necklines.forEach(neckline => {
            items.push({
              ...neckline,
              category: 'Cổ áo',
              categoryColor: '#F0FDF4'
            });
          });
        }
        
        // Add details
        if (selection.details && selection.details.length > 0) {
          selection.details.forEach(detail => {
            items.push({
              ...detail,
              category: 'Chi tiết',
              categoryColor: '#FFFBEB'
            });
          });
        }
        
        // Add accessories
        if (selection.accessories) {
          // Veils
          if (selection.accessories.veils && selection.accessories.veils.length > 0) {
            selection.accessories.veils.forEach(veil => {
              items.push({
                ...veil,
                category: 'Voan cưới',
                categoryColor: '#FDF2F8'
              });
            });
          }
          
          // Jewelry
          if (selection.accessories.jewelries && selection.accessories.jewelries.length > 0) {
            selection.accessories.jewelries.forEach(jewelry => {
              items.push({
                ...jewelry,
                category: 'Trang sức',
                categoryColor: '#FEF3C7'
              });
            });
          }
          
          // Hairpins
          if (selection.accessories.hairpins && selection.accessories.hairpins.length > 0) {
            selection.accessories.hairpins.forEach(hairpin => {
              items.push({
                ...hairpin,
                category: 'Kẹp tóc',
                categoryColor: '#E0E7FF'
              });
            });
          }
          
          // Crowns
          if (selection.accessories.crowns && selection.accessories.crowns.length > 0) {
            selection.accessories.crowns.forEach(crown => {
              items.push({
                ...crown,
                category: 'Vương miện',
                categoryColor: '#F3E8FF'
              });
            });
          }
        }
        
        // Add flowers
        if (selection.flowers && selection.flowers.length > 0) {
          selection.flowers.forEach(flower => {
            items.push({
              ...flower,
              category: 'Hoa cưới',
              categoryColor: '#ECFDF5'
            });
          });
        }
      });
    }
    
    setAllItems(items);
  }, [album]);

  const renderAlbumItem = (item: any, index: number) => {
    return (
      <View key={`${item._id}-${item.category}-${index}`} style={styles.itemWrapper}>
        <WeddingItemCard
          id={item._id}
          name={item.name}
          image={item.image}
          isSelected={true} // All items in album are "selected"
          onSelect={() => {}} // No selection in detail view
          showPinButton={false} // Hide pin button in detail view
        />
        <View style={[styles.categoryBadge, { backgroundColor: item.categoryColor }]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    );
  };

  const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPad }] }>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{album.name}</Text>
          <Text style={styles.headerSubtitle}>{allItems.length} mục đã chọn</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Album Items Grid */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.itemsGrid}>
          {allItems.map((item, index) => renderAlbumItem(item, index))}
        </View>

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
    backgroundColor: '#FEF0F3',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.montserratSemiBold,
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.montserratMedium,
    color: '#6b7280',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  itemWrapper: {
    position: 'relative',
    width: (width - 48) / 3, // 3 cards per row with 16px padding on each side
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: fonts.montserratSemiBold,
    color: '#1f2937',
  },
});

export default AlbumDetailScreen;
