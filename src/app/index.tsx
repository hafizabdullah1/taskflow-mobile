import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Learn React Native Primitives', completed: true },
  { id: '2', title: 'Master Flexbox Layout', completed: true },
  { id: '3', title: 'Understand FlatList Virtualization', completed: false },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 1. CREATE: Add new task
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    Keyboard.dismiss();
  };

  // 2. UPDATE: Toggle task completion status
  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 3. DELETE: Remove task by ID
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Render individual task item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      {/* Tappable task area for toggling completion */}
      <Pressable
        style={styles.taskTouchArea}
        onPress={() => handleToggleTask(item.id)}
      >
        <View
          style={[
            styles.statusDot,
            item.completed ? styles.dotCompleted : styles.dotPending,
          ]}
        />
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.taskTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.taskStatus}>
            {item.completed ? 'Completed' : 'Tap to mark done'}
          </Text>
        </View>
      </Pressable>

      {/* Delete button */}
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Task Master</Text>
        <Text style={styles.headerSubtitle}>Phase 2 Milestone: Local State CRUD</Text>

        {/* Input & Add Button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="#64748b"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            returnKeyType="done"
            onSubmitEditing={handleAddTask}
          />
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAddTask}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        {/* Task List with Empty State */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>🎉 No tasks left!</Text>
              <Text style={styles.emptySubtext}>Add a task above to get started.</Text>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 40,
  },
  taskCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  taskTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
  },
  dotCompleted: {
    backgroundColor: '#22c55e',
  },
  dotPending: {
    backgroundColor: '#f59e0b',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  taskStatus: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButtonPressed: {
    backgroundColor: '#334155',
  },
  deleteButtonText: {
    color: '#ef4444', // Red ✕
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});