import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight || 24;

function getIcon(icon) {
  if (!icon) return null;
  switch (icon.type) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={icon.name} size={28} color="#222" />;
    case 'FontAwesome5':
      return <FontAwesome5 name={icon.name} size={26} color="#222" />;
    case 'MaterialIcons':
      return <MaterialIcons name={icon.name} size={28} color="#222" />;
    default:
      return <MaterialCommunityIcons name="pill" size={28} color="#222" />;
  }
}

export default function PastMedicinesScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch('https://api.fda.gov/drug/label.json?limit=10')
      .then(res => res.json())
      .then(apiData => {
        const mapped = (apiData.results || []).map((item, idx) => ({
          id: item.id || idx.toString(),
          name: item.openfda.brand_name?.[0] || 'İsim Yok',
          dose: item.openfda.substance_name?.[0] || 'Etken Madde Yok',
          icon: { type: 'MaterialCommunityIcons', name: 'pill' },
          percent: Math.floor(Math.random() * 51) + 50, 
        }));
        setData(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const renderMedicine = ({ item }) => (
    <View style={styles.pastMedicineRow}>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#222" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.pastMedicineCard} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {getIcon(item.icon)}
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={styles.pastMedicineName}>{item.name}</Text>
            <Text style={styles.pastMedicineDose}>{item.dose}</Text>
          </View>
          <Text style={styles.percentText}>%{item.percent}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d6dcf4', '#f7f9fb']}
        style={styles.gradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GEÇMİŞ İLAÇLAR</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="add" size={28} color="#222" />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.profileAvatar}
            />
          </View>
        </View>
        <Text style={styles.subtitle}>ÖNCEDEN ALDIĞIM İLAÇLAR</Text>
        {loading ? (
          <ActivityIndicator color="#2C45C7" size="large" style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={data}
            renderItem={renderMedicine}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.pastMedicineList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb' },
  gradient: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    letterSpacing: 2,
    fontWeight: '400',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
    fontWeight: '400',
    letterSpacing: 1,
    textAlign: 'left',
    marginLeft: 4,
    marginTop: 12,
  },
  pastMedicineList: {
    paddingBottom: 8,
  },
  pastMedicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteBtn: {
    marginRight: 8,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastMedicineCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#c6d0f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  pastMedicineName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 1,
  },
  pastMedicineDose: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
    fontWeight: '400',
  },
  percentText: {
    fontSize: 15,
    color: '#2C45C7',
    fontWeight: '700',
    marginLeft: 10,
    marginRight: 2,
  },
});