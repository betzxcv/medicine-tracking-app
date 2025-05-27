import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function AddMedicineScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = () => {
    if (!name || !dose || !time) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    const newMed = { id: Date.now().toString(), name, dose, time };
    if (route.params && route.params.addMedicine) {
      route.params.addMedicine(newMed);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>İlaç Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="İlaç adı"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Doz"
        value={dose}
        onChangeText={setDose}
      />
      <TextInput
        style={styles.input}
        placeholder="Saat (örn: 08:00)"
        value={time}
        onChangeText={setTime}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#F6F8FC' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dbeafe'
  },
  addButton: {
    backgroundColor: '#2B74F7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});