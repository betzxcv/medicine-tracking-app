import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, Dimensions, Pressable, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { usePlan } from '../context/PlanContext';

const doseOptions = [1, 2, 3, 4, 5];
const dayOptions = [1, 3, 5, 7, 14, 30];

const { width, height } = Dimensions.get('window');
const RECT_HEIGHT = height * 0.62;

function getIconComp() {
  return <MaterialCommunityIcons name="pill" size={54} color="#2C45C7" />;
}

export default function PlanScreen() {
  const navigation = useNavigation();

  const { addPlanMedicine } = usePlan();
  const [medicineTemplates, setMedicineTemplates] = useState([]);
  const [medicineIndex, setMedicineIndex] = useState(0);
  const [doseModalVisible, setDoseModalVisible] = useState(false);
  const [selectedDose, setSelectedDose] = useState(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [notifyEnd, setNotifyEnd] = useState(false);

  const [period, setPeriod] = useState('Ö.Ö');
  const [selectedTime, setSelectedTime] = useState('Sabah');
  const [selectedHoursSet, setSelectedHoursSet] = useState([[]]);
  const [activeHourSetIndex, setActiveHourSetIndex] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('https://api.fda.gov/drug/label.json?limit=10')
      .then(res => res.json())
      .then(apiData => {
        const mapped = (apiData.results || []).map(item => ({
          name: item.openfda.brand_name?.[0] || 'İsim Yok',
          mg: item.openfda.substance_name?.[0] || 'Etken Madde Yok',
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'pill',
            iconComp: getIconComp()
          }
        }));
        setMedicineTemplates(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getTimesForPart = (part, period) => {
    if (period === 'Ö.Ö') {
      if (part === 'Sabah') return ['06.00', '07.00', '08.00'];
      if (part === 'Öğle') return ['09.00', '10.00', '11.00'];
      return [];
    } else {
      if (part === 'Öğle') return ['12.00', '14.00', '16.00'];
      if (part === 'Akşam') return ['18.00', '20.00', '21.00'];
      return [];
    }
  };
  const hours = getTimesForPart(selectedTime, period);

  const toggleHour = (hour, setIdx) => {
    setSelectedHoursSet(prev => prev.map((arr, idx) =>
      idx === setIdx
        ? (arr.includes(hour) ? arr.filter(h => h !== hour) : [...arr, hour])
        : arr
    ));
  };

  const addHourSet = () => {
    if(selectedHoursSet.length < 5) {
      setSelectedHoursSet(prev => [...prev, []]);
      setActiveHourSetIndex(selectedHoursSet.length);
    }
  };

  const removeHourSet = (idx) => {
    if (selectedHoursSet.length > 1) {
      setSelectedHoursSet(prev => prev.filter((_, i) => i !== idx));
      setActiveHourSetIndex(0);
    }
  };

  const handleCreatePlan = () => {
    if (!selectedHoursSet.flat().length || !selectedDose || !selectedDay) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    const selectedMedicine = medicineTemplates[medicineIndex];
    
    addPlanMedicine({
      name: selectedMedicine.name,
      dose: selectedMedicine.mg,
      icon: selectedMedicine.icon,
      plan: {
        period,
        timePart: selectedTime,
        hours: selectedHoursSet.flat(),
        dose: selectedDose,
        days: selectedDay,
        notifyEnd,
      },
    });
    setSelectedHoursSet([[]]);
    setSelectedDose(null);
    setSelectedDay(null);
    setNotifyEnd(false);
    Alert.alert('Başarılı', 'Plan oluşturuldu ve ilaçlarım listesine eklendi!');
  };

  const nextMedicine = () => setMedicineIndex((medicineIndex + 1) % medicineTemplates.length);
  const prevMedicine = () => setMedicineIndex((medicineIndex - 1 + medicineTemplates.length) % medicineTemplates.length);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#d6dcf4', '#f7f9fb']}
        style={styles.headerGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={28} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.medicineBox}>
          <TouchableOpacity onPress={prevMedicine} style={styles.arrowBtn}>
            <Ionicons name="chevron-back" size={32} color="#2C45C7" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', flex: 1 }}>
            {loading ? (
              <ActivityIndicator color="#2C45C7" size="large" style={{ marginTop: 32 }} />
            ) : medicineTemplates.length > 0 ? (
              <>
                {medicineTemplates[medicineIndex].icon.iconComp}
                <Text style={styles.medicineName}>{medicineTemplates[medicineIndex].name}</Text>
                <Text style={styles.medicineMg}>{medicineTemplates[medicineIndex].mg}</Text>
              </>
            ) : (
              <Text style={{ color: '#222', fontSize: 18, marginTop: 32 }}>İlaç verisi yok</Text>
            )}
          </View>
          <TouchableOpacity onPress={nextMedicine} style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={32} color="#2C45C7" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.rectWrapper}>
        <View style={styles.rectCard}>
          
          <View style={styles.periodRow}>
            {['Ö.Ö', 'Ö.S'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                onPress={() => {
                  setPeriod(p);
                  setSelectedTime(p === 'Ö.Ö' ? 'Sabah' : 'Öğle');
                  setSelectedHoursSet([[]]);
                  setActiveHourSetIndex(0);
                }}
              >
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.dayPartRow}>
            {['Sabah', 'Öğle', 'Akşam'].map((part) => (
              <TouchableOpacity
                key={part}
                style={[
                  styles.dayPartBtn,
                  selectedTime === part && styles.dayPartBtnActive,
                  (period === 'Ö.Ö' && part === 'Akşam') || (period === 'Ö.S' && part === 'Sabah')
                    ? styles.dayPartBtnDisabled
                    : null,
                ]}
                disabled={
                  (period === 'Ö.Ö' && part === 'Akşam') ||
                  (period === 'Ö.S' && part === 'Sabah')
                }
                onPress={() => {
                  setSelectedTime(part);
                  setSelectedHoursSet([[]]);
                  setActiveHourSetIndex(0);
                }}
              >
                <Text
                  style={[
                    styles.dayPartText,
                    selectedTime === part && styles.dayPartTextActive,
                    ((period === 'Ö.Ö' && part === 'Akşam') || (period === 'Ö.S' && part === 'Sabah')) && { color: '#bbb' },
                  ]}
                >
                  {part}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedHoursSet.map((selectedHours, idx) => (
            <View key={idx} style={styles.timeBoxesRow}>
              <View style={styles.timeBoxes}>
                {hours.map((time, tIdx) => (
                  <TouchableOpacity
                    key={tIdx}
                    style={[
                      styles.timeBox,
                      selectedHours.includes(time) && styles.timeBoxActive
                    ]}
                    onPress={() => toggleHour(time, idx)}
                  >
                    <Text style={[
                      styles.timeText,
                      selectedHours.includes(time) && { color: '#fff' }
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.timeBoxActions}>
                {selectedHoursSet.length > 1 && (
                  <TouchableOpacity onPress={() => removeHourSet(idx)} style={styles.removeHourSetBtn}>
                    <MaterialCommunityIcons name="minus-circle-outline" size={22} color="#da3b3b" />
                  </TouchableOpacity>
                )}
                {idx === selectedHoursSet.length - 1 && selectedHoursSet.length < 5 && (
                  <TouchableOpacity onPress={addHourSet} style={styles.addHourSetBtn}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#2C45C7" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <Text style={styles.label}>Kaç adet kullanılmalı?</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => setDoseModalVisible(true)}>
            <Text style={[styles.selectText, !selectedDose && { color: '#bbb' }]}>
              {selectedDose ? selectedDose : 'Seç'}
            </Text>
            <Ionicons name="chevron-down" size={22} color="#2C45C7" />
          </TouchableOpacity>
          <Text style={styles.label}>Kaç gün boyunca kullanılacak?</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => setDayModalVisible(true)}>
            <Text style={[styles.selectText, !selectedDay && { color: '#bbb' }]}>
              {selectedDay ? selectedDay : 'Seç'}
            </Text>
            <Ionicons name="chevron-down" size={22} color="#2C45C7" />
          </TouchableOpacity>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>İlacım bitince haber ver.</Text>
            <Switch
              value={notifyEnd}
              onValueChange={setNotifyEnd}
              trackColor={{ false: "#e1e4ef", true: "#bcd6ff" }}
              thumbColor={notifyEnd ? "#2C45C7" : "#999"}
            />
          </View>
          <View style={styles.createBtnRow}>
            <Pressable style={styles.createBtn} onPress={handleCreatePlan}>
              <Text style={styles.createBtnText}>Planı Oluştur</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Modal visible={doseModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setDoseModalVisible(false)}>
          <View style={styles.modalBox}>
            {doseOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.modalItem}
                onPress={() => { setSelectedDose(d); setDoseModalVisible(false); }}
              >
                <Text style={{ fontSize: 18, color: '#222' }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={dayModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setDayModalVisible(false)}>
          <View style={styles.modalBox}>
            {dayOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={styles.modalItem}
                onPress={() => { setSelectedDay(d); setDayModalVisible(false); }}
              >
                <Text style={{ fontSize: 18, color: '#222' }}>{d} gün</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#f7f9fb' },
  headerGradient: {
    height: 210,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 62,
    marginBottom: 14,
    paddingHorizontal: 42,
    zIndex: 3,
  },
  headerIcon: { paddingHorizontal: 6, paddingVertical: 6 },
  medicineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '88%',
    marginBottom: 2,
  },
  arrowBtn: {
    padding: 8,
  },
  medicineName: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
    marginTop: 6,
    letterSpacing: 1.2,
  },
  medicineMg: {
    fontSize: 14,
    color: '#222',
    marginTop: 3,
    marginBottom: 2,
    letterSpacing: 0.7,
    fontWeight: '500',
  },
  rectWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -34,
  },
  rectCard: {
    backgroundColor: '#fff',
    borderRadius: 36,
    width: width * 0.92,
    minHeight: RECT_HEIGHT,
    maxWidth: 440,
    alignSelf: 'center',
    paddingTop: 18,
    paddingBottom: 34,
    paddingHorizontal: 10,
    shadowColor: '#a0a9d7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 7,
    position: 'relative',
    zIndex: 2,
    marginBottom: 0,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    gap: 16,
  },
  periodBtn: {
    backgroundColor: '#f3f6fd',
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 26,
    marginHorizontal: 9,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  periodBtnActive: {
    backgroundColor: '#e3eafe',
    borderColor: '#2C45C7',
  },
  periodText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#222',
    fontWeight: '700',
  },
  dayPartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginBottom: 10,
    marginTop: 2,
  },
  dayPartBtn: {
    flex: 1,
    backgroundColor: '#f3f6fd',
    marginHorizontal: 5,
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dayPartBtnDisabled: {
    backgroundColor: '#ececec',
  },
  dayPartBtnActive: {
    backgroundColor: '#e3eafe',
  },
  dayPartText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  dayPartTextActive: {
    color: '#222',
    fontWeight: '700',
  },
  timeBoxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    marginTop: 2,
  },
  timeBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 2,
    flex: 1,
  },
  timeBox: {
    backgroundColor: '#f7f8fd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    minWidth: 58,
    alignItems: 'center',
  },
  timeBoxActive: {
    backgroundColor: '#2C45C7',
  },
  timeText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  timeBoxActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    gap: 2,
  },
  addHourSetBtn: {
    marginLeft: 2,
    marginTop: 2,
  },
  removeHourSetBtn: {
    marginRight: 2,
    marginTop: 2,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
    marginLeft: 3,
  },
  selectBox: {
    backgroundColor: '#f2f4fb',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 2,
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#222',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 6,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  createBtnRow: {
    marginTop: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtn: {
    backgroundColor: '#2C45C7',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 44,
    alignItems: 'center',
    marginTop: 2,
    elevation: 2,
    shadowColor: '#b3baf0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.19,
    shadowRadius: 7,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(45,45,70,0.12)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 32,
    alignItems: 'center',
  },
  modalItem: {
    paddingVertical: 13,
    width: width * 0.92,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#eef1f6',
  },
});