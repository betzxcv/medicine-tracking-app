import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, StatusBar, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlan } from '../context/PlanContext';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 36 : StatusBar.currentHeight || 24;

function getIconByName(name) {
  name = (name || '').toLowerCase();
  if (name.includes('arveles')) {
    return <MaterialCommunityIcons name="pill" size={28} color="#2C45C7" />;
  } else if (name.includes('vitamin') || name.includes('vitamin e') || name.includes('e vitamini')) {
    return <MaterialCommunityIcons name="flower" size={28} color="#388e3c" />;
  } else if (name.includes('calpol')) {
    return <MaterialIcons name="medication" size={28} color="#c62828" />;
  } else if (name.includes('dolorex')) {
    return <FontAwesome5 name="capsules" size={26} color="#1565c0" />;
  } else if (name.includes('cold')) {
    return <MaterialCommunityIcons name="bottle-tonic-plus-outline" size={28} color="#0097a7" />;
  }
  return <MaterialCommunityIcons name="pill" size={28} color="#222" />;
}

function AddOptionsModal({ visible, onClose, onAddMedicine }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color="#222" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>İlaç eklemek ister misin?</Text>
          <TouchableOpacity style={styles.modalOption} onPress={onAddMedicine}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="pill" size={22} color="#222" style={{ marginRight: 10 }} />
              <Text style={styles.modalOptionText}>İlaç ekle</Text>
            </View>
            <Ionicons name="add" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function MedicinesScreen() {
  const navigation = useNavigation();
  const { planMedicines, deletePlanMedicine } = usePlan();
  const [modalVisible, setModalVisible] = useState(false);

  const [apiMedicines, setApiMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [allApiMedicines, setAllApiMedicines] = useState([]);

  useEffect(() => {
    fetch('https://api.fda.gov/drug/label.json?limit=15')
      .then(res => res.json())
      .then(data => {
        const fdaDrugs = (data.results || []).map(item => ({
          id: item.id || Math.random().toString(),
          name: Array.isArray(item.openfda?.brand_name)
            ? item.openfda.brand_name[0]
            : (item.openfda?.brand_name || "İsim Yok"),
          dose: Array.isArray(item.openfda?.substance_name)
            ? item.openfda.substance_name[0]
            : (item.openfda?.substance_name || "Etken Madde Yok"),
          icon: getIconByName(
            Array.isArray(item.openfda?.brand_name)
              ? item.openfda.brand_name[0]
              : item.openfda?.brand_name
          ),
          isFromPlan: false,
          raw: item,
        }));
        setApiMedicines(fdaDrugs);
        setAllApiMedicines(fdaDrugs); 
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

 
  const combinedMedicines = [
    ...planMedicines.map(item => ({
      ...item,
      id: item.id || Math.random().toString(),
      icon: getIconByName(item.name),
      isFromPlan: true,
    })),
    ...apiMedicines,
  ];

  const handleDelete = (item) => {
    if (item.isFromPlan) {
      deletePlanMedicine(item.id);
    } else {
      setApiMedicines(prev => prev.filter(med => med.id !== item.id));
    }
  };

  const handleAddMedicine = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate('Plan');
    }, 200);
  };

  const handleMedicinePress = (item) => {
    navigation.navigate('MedicineDetail', { medicine: item, medicineId: item.id });
  };

  const renderMedicine = ({ item }) => (
    <View style={styles.medicineRow}>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#222" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleMedicinePress(item)}
        activeOpacity={0.75}
        style={{ flex: 1 }}
      >
        <View style={styles.medicineCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.icon}
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.medicineName}>{String(item.name)}</Text>
              <Text style={styles.medicineDose}>{String(item.dose)}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#222" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerWrapper}>
      <TouchableOpacity
        style={styles.pastMedicinesBtn}
        onPress={() => navigation.navigate('PastMedicines')}
        activeOpacity={0.77}
      >
        <MaterialCommunityIcons name="history" size={20} color="#2C45C7" style={{ marginRight: 7 }} />
        <Text style={styles.pastMedicinesBtnText}>Geçmiş İlaçlar</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
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
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={28} color="#222" />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.profileAvatar}
            />
          </View>
        </View>
        <View style={styles.titlesContainer}>
          <Text style={styles.headerTitle}>İLAÇLARIM</Text>
          <Text style={styles.subtitle}>TÜM İLAÇLAR</Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#2C45C7" size="large" style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={combinedMedicines}
            renderItem={renderMedicine}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={[styles.medicineList, { paddingBottom: 110 }]}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        )}
      </LinearGradient>
      <AddOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddMedicine={handleAddMedicine}
      />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: 4,
  },
  titlesContainer: {
    marginTop: 34,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '400',
    color: '#222',
    textAlign: 'left',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
    fontWeight: '400',
    letterSpacing: 1,
    textAlign: 'left',
  },
  medicineList: {
    paddingBottom: 8,
  },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  deleteBtn: {
    marginRight: 6,
    backgroundColor: '#ededed',
    padding: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  medicineCard: {
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
  medicineName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 1,
  },
  medicineDose: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 45, 70, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.86,
    backgroundColor: '#b8c8f7',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    shadowColor: '#2C45C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 15,
    elevation: 11,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    marginBottom: 32,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  modalOption: {
    backgroundColor: '#e9effc',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 18,
    marginBottom: 13,
    borderWidth: 1.7,
    borderColor: '#222',
    shadowColor: '#8692c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 13,
    right: 15,
    zIndex: 2,
    padding: 2,
  },
  pastMedicinesBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e8fb',
    borderRadius: 13,
    paddingHorizontal: 22,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#d3dcf7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 5,
  },
  pastMedicinesBtnText: {
    fontSize: 15,
    color: '#2C45C7',
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  footerWrapper: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 18,
  }
});