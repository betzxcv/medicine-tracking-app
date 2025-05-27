import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePlan } from '../context/PlanContext';

const { width } = Dimensions.get('window');

function getIconByName(name) {
  const key = (name || '').toLowerCase();
  if (key.includes('arveles')) {
    return <MaterialCommunityIcons name="pill" size={54} color="#2C45C7" />;
  } else if (key.includes('vitamin') || key.includes('e vitamini')) {
    return <MaterialCommunityIcons name="flower" size={54} color="#388e3c" />;
  } else if (key.includes('calpol')) {
    return <MaterialIcons name="medication" size={54} color="#c62828" />;
  } else if (key.includes('dolorex')) {
    return <FontAwesome5 name="capsules" size={50} color="#1565c0" />;
  } else if (key.includes('cold')) {
    return <MaterialCommunityIcons name="bottle-tonic-plus-outline" size={54} color="#0097a7" />;
  }
  return <MaterialCommunityIcons name="pill" size={54} color="#2C45C7" />;
}

export default function MedicineDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { medicineId, medicine } = route.params || {};
  const { planMedicines } = usePlan();


  let medicineObj = null;
  if (medicineId && planMedicines) {
    medicineObj = planMedicines.find(med => med.id === medicineId);
  }
  if (!medicineObj && medicine) {
    medicineObj = medicine;
  }

  if (!medicineObj) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>İlaç bilgisi bulunamadı.</Text>
      </View>
    );
  }

 
  const name = medicineObj.name || medicineObj.openfda?.brand_name?.[0] || 'İsim yok';
  const dose = medicineObj.dose || medicineObj.openfda?.substance_name?.[0] || 'Doz yok';
  const purpose =
    medicineObj.program || medicineObj.purpose?.[0]
    || medicineObj.openfda?.purpose?.[0]
    || medicineObj.description
    || 'Açıklama yok';

  
  let hatirlatma = 'Yok';
  let program = 'Belirtilmedi';
  if (medicineObj.plan) {
    if (medicineObj.plan.period && medicineObj.plan.hours && medicineObj.plan.hours.length > 0) {
      hatirlatma = `${medicineObj.plan.period} ${medicineObj.plan.hours[0]}`;
    }
    if (medicineObj.plan.dose && medicineObj.plan.days && medicineObj.plan.hours && medicineObj.plan.hours.length > 0) {
      program = `Günde ${medicineObj.plan.dose} kez / ${medicineObj.plan.period} ${medicineObj.plan.hours[0]} - ${medicineObj.plan.hours[medicineObj.plan.hours.length - 1]} (${medicineObj.plan.days} gün)`;
    }
  } else if (medicineObj.purpose || medicineObj.openfda?.purpose) {
    hatirlatma = 'API Verisi';
    program = purpose;
  }

  
  let iconElement = medicineObj.icon?.iconComp
    || (medicineObj.icon && medicineObj.icon.type && medicineObj.icon.name
      ? getIconByName(medicineObj.name)
      : getIconByName(name)
    );


  const alindi = medicineObj.plan ? 8 : 0;
  const kaldi = medicineObj.plan ? 12 : 0;

  return (
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
        <Text style={styles.headerTitle}>İLAÇ DETAYI</Text>
        <View style={styles.headerRight}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.profileAvatar}
          />
        </View>
      </View>
      <View style={styles.infoCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginRight: 18 }}>
            {iconElement}
          </View>
          <View>
            <Text style={styles.infoLabel}>İsim</Text>
            <Text style={styles.infoValue}>{name}</Text>
            <Text style={styles.infoLabel}>Doz</Text>
            <Text style={styles.infoValue}>{dose}</Text>
            <Text style={styles.infoLabel}>Hatırlatma</Text>
            <Text style={styles.infoValue}>{hatirlatma}</Text>
          </View>
        </View>
      </View>
      <View style={styles.programCard}>
        <Text style={styles.programLabel}>Program / Açıklama</Text>
        <Text style={styles.programValue}>
          {program}
        </Text>
      </View>
      <View style={styles.miktarRow}>
        <View style={styles.miktarBox}>
          <Text style={styles.miktarNumber}>{alindi} Alındı</Text>
          <MaterialCommunityIcons name="check-circle-outline" size={22} color="#2C45C7" />
        </View>
        <View style={styles.miktarBox}>
          <Text style={styles.miktarNumber}>{kaldi} Kaldı</Text>
          <MaterialCommunityIcons name="clock-outline" size={22} color="#2C45C7" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 52,
    paddingHorizontal: 0,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
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
    letterSpacing: 5,
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 15,
    padding: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#c6d0f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#2C45C7',
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 0,
    letterSpacing: 0.2,
  },
  programCard: {
    backgroundColor: '#e0e8fb',
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 16,
    marginBottom: 20,
  },
  programLabel: {
    fontSize: 15,
    color: '#2C45C7',
    fontWeight: '700',
    marginBottom: 2,
  },
  programValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginBottom: 2,
  },
  miktarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 17,
    marginTop: 6,
  },
  miktarBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    elevation: 2,
    shadowColor: '#e6ebf7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
  },
  miktarNumber: {
    fontSize: 15,
    color: '#2C45C7',
    fontWeight: '700',
    marginRight: 3,
  },
});