import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight || 24;

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d6dcf4', '#f7f9fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={28} color="#2C45C7" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#2C45C7" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>MEDITRACK</Text>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.profileAvatar}
          />
        </View>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Hesap</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('PastMedicines')}
          >
            <Text style={styles.menuText}>Geçmiş İlaçlar</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Hesap Ekle</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Arkadaş Ekle</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Premium’a Geç</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Ayarlar</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Çıkış Yap</Text>
            <Ionicons name="chevron-forward" size={24} color="#222" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb' },
  gradient: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT + 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
    marginHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    justifyContent: 'space-between',
    marginHorizontal: 2,
  },
  title: {
    fontSize: 24,
    letterSpacing: 6,
    fontWeight: '400',
    color: '#2C45C7',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: 8,
  },
  menuBox: {
    backgroundColor: 'rgba(255,255,255,0.57)',
    borderRadius: 18,
    marginBottom: 16,
    paddingVertical: 2,
    shadowColor: '#c6d0f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderBottomColor: '#e5e9fa',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  menuText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    letterSpacing: 1,
  },
});