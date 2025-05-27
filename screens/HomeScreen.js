import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const dates = [
  { id: '1', day: '01', month: 'Ekim' },
  { id: '2', day: '02', month: 'Ekim' },
  { id: '3', day: '03', month: 'Ekim' },
  { id: '4', day: '04', month: 'Ekim' },
  { id: '5', day: '05', month: 'Ekim' },
  { id: '6', day: '06', month: 'Ekim' },
  { id: '7', day: '07', month: 'Ekim' },
];

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;
const HEADER_HEIGHT = height * 0.45;
const RECT_HEIGHT = HEADER_HEIGHT * 0.80;

function getIcon(idx) {
  
  const icons = [
    <MaterialCommunityIcons name="pill" size={34} color="#828282" />,
    <FontAwesome5 name="tablets" size={30} color="#828282" />,
    <MaterialIcons name="medication" size={32} color="#828282" />,
    <MaterialCommunityIcons name="alpha-e-circle-outline" size={34} color="#828282" />,
  ];
  return icons[idx % icons.length];
}

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState('4');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.fda.gov/drug/label.json?limit=8')
      .then(res => res.json())
      .then(data => {
        const mapped = (data.results || []).map((item, idx) => ({
          id: item.id || idx.toString(),
          name: item.openfda.brand_name?.[0] || 'İsim Yok',
          hour: item.openfda.product_type?.[0] === 'HUMAN OTC DRUG' ? '08.00' : '09.00',
          icon: getIcon(idx),
        }));
        setMedicines(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e8ecfa', '#f7f9fb']}
        style={styles.headerGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.avatarBox}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.centerArea}>
          <View style={styles.transRect}>
            <Text style={styles.homeTitle}>HOME</Text>
            <Text style={styles.meditrack}>MEDITRACK</Text>
          </View>
        </View>
        <View style={styles.dateBarOuter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {dates.map(date => {
              const isSelected = date.id === selectedDate;
              return (
                <TouchableOpacity
                  key={date.id}
                  style={[styles.dateBox, isSelected && styles.selectedDateBox]}
                  onPress={() => setSelectedDate(date.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateDay, isSelected && styles.selectedDateDay]}>{date.day}</Text>
                  <Text style={[styles.dateMonth, isSelected && styles.selectedDateMonth]}>{date.month}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>
      <View style={{ flex: 1, marginTop: 12 }}>
        {loading ? (
          <ActivityIndicator color="#2C45C7" size="large" style={{ marginTop: 42 }} />
        ) : (
          <FlatList
            data={medicines}
            numColumns={2}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.iconBox}>{item.icon}</View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardHourRow}>
                  <View style={styles.cardHourBox}>
                    <Text style={styles.cardHour}>{item.hour}</Text>
                  </View>
                  <Text style={styles.cardDots}>•••••</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB', paddingHorizontal: 18 },
  headerGradient: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 0,
    paddingTop: 0,
    height: HEADER_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    width: width,
    marginLeft: -18,
    marginRight: -18,
  },
  avatarBox: {
    position: 'absolute',
    top: 56, 
    right: 36,
    zIndex: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  centerArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transRect: {
    backgroundColor: 'rgba(90,100,180,0.92)',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: width * 0.88,
    minHeight: RECT_HEIGHT,
    maxWidth: 440,
    shadowColor: '#6b7bd1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'center',
  },
  homeTitle: {
    fontSize: 24,
    letterSpacing: 3,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  meditrack: {
    fontSize: 16,
    color: '#e1e4fa',
    letterSpacing: 2,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 18,
  },
  dateBarOuter: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  dateScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
    height: 44,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: 'transparent',
    height: 38,
  },
  selectedDateBox: {
    backgroundColor: '#CFD8FC',
  },
  dateDay: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '500',
    lineHeight: 18,
  },
  dateMonth: {
    fontSize: 11,
    color: '#B0B0B0',
    fontWeight: '400',
    lineHeight: 15,
  },
  selectedDateDay: {
    color: '#2C45C7',
    fontWeight: 'bold',
  },
  selectedDateMonth: {
    color: '#2C45C7',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    width: CARD_WIDTH,
    alignItems: 'center',
    shadowColor: '#A6B1E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  cardHourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cardHourBox: {
    backgroundColor: '#CFD8FC',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 13,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHour: {
    color: '#2237A5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDots: {
    color: '#848484',
    fontSize: 18,
    marginLeft: 2,
    fontWeight: 'bold',
  },
});