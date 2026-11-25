import React, { useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface TaskInputProps {
  onAddTask: (title: string) => Promise<void> | void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;
    onAddTask(taskTitle.trim());
    setTaskTitle('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Add cloud task..."
        placeholderTextColor="#64748b"
        value={taskTitle}
        onChangeText={setTaskTitle}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
