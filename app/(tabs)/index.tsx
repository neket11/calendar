import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';


interface Workout {
  date: string;
  text: string;
  completed: boolean;
}


interface Preset {
  id: number;
  text: string;
}

const IndexScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [newPresetText, setNewPresetText] = useState<string>('');
  const [presets, setPresets] = useState<Preset[]>([
    { id: 1, text: 'Бег 30 минут' },
    { id: 2, text: 'Силовая тренировка' },
    { id: 3, text: 'Йога утром' },
  ]);
  
  
  const [showAddPresetModal, setShowAddPresetModal] = useState(false);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleAddWorkout = (preset: Preset) => {
    if (selectedDate) {
      const newWorkout: Workout = { date: selectedDate, text: preset.text, completed: false };
      setWorkouts([...workouts, newWorkout]);
      setShowPresetModal(false);
    } else {
      alert('Выберите дату в календаре!');
    }
  };

  const handleLongPressDay = (day: { dateString: string }) => {
    setWorkouts(workouts.filter(w => w.date !== day.dateString));
  };

  const handleDeleteWorkout = (index: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts.splice(index, 1);
    setWorkouts(updatedWorkouts);
  };

  const toggleWorkoutCompleted = (index: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index].completed = !updatedWorkouts[index].completed;
    setWorkouts(updatedWorkouts);
  };

  const renderWorkoutItem = ({ item, index }: { item: Workout, index: number }) => {
    return (
      <View style={styles.workoutItemContainer}>
        <TouchableOpacity style={styles.completeButton} onPress={() => toggleWorkoutCompleted(index)}>
          <Text style={styles.completeButtonText}>{item.completed ? '✔' : '◻'}</Text>
        </TouchableOpacity>
        <Text style={[styles.workoutItem, item.completed && styles.completedText]}>
          {item.date}: {item.text}
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteWorkout(index)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleAddNewPreset = () => {
    if (newPresetText.trim()) {
      const newId = presets.length > 0 ? presets[presets.length - 1].id + 1 : 1;
      const newPreset: Preset = { id: newId, text: newPresetText.trim() };
      setPresets([...presets, newPreset]);
      setNewPresetText('');
      setShowAddPresetModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь Тренировок</Text>
      <Calendar
        onDayPress={handleDayPress}
        onDayLongPress={handleLongPressDay}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <Text style={styles.selectedDate}>Выбрана дата: {selectedDate || 'нет'}</Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowPresetModal(true)}>
          <Text style={styles.iconText}>➕</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => setShowAddPresetModal(true)}>
          <Text style={styles.iconText}>★</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWorkoutItem}
        style={styles.workoutList}
      />

      
      <Modal visible={showPresetModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите Пресет:</Text>
            <FlatList
              data={presets}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.presetItem} onPress={() => handleAddWorkout(item)}>
                  <Text>{item.text}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Отмена" onPress={() => setShowPresetModal(false)} />
          </View>
        </View>
      </Modal>

      
      <Modal visible={showAddPresetModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить новый пресет:</Text>
            <TextInput
              style={styles.input}
              value={newPresetText}
              onChangeText={setNewPresetText}
              placeholder="Введите текст пресета"
            />
            <Button title="Сохранить" onPress={handleAddNewPreset} />
            <Button title="Отмена" color="red" onPress={() => setShowAddPresetModal(false)} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10,
    textAlign: 'center'
  },
  selectedDate: {
    fontSize: 16,
    marginVertical: 10
  },
  workoutList: {
    marginTop: 20
  },
  workoutItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between'
  },
  workoutItem: {
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa'
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10
  },
  deleteButtonText: {
    color: '#fff'
  },
  completeButton: {
    padding: 5,
    marginLeft: 5
  },
  completeButtonText: {
    fontSize: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10
  },
  iconButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginRight: 10
  },
  iconText: {
    fontSize: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10
  },
  presetItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10
  }
});

export default IndexScreen;
