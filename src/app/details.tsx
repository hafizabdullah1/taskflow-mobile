import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Task } from '../types/task';
import { subscribeToTaskById, updateTaskStatus } from '../services/taskService';

export default function TaskDetailsScreen() {
  const router = useRouter();
  
  // Read ONLY the document id from navigation parameters
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates for this specific task document
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const unsubscribe = subscribeToTaskById(
      id,
      (liveTask) => {
        setTask(liveTask);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load task');
        setLoading(false);
      }
    );

    return unsubscribe; // Unsubscribe when user leaves the screen
  }, [id]);

  // Handler to toggle status directly from the Details screen
  const handleToggle = async () => {
    if (!task) return;
    try {
      await updateTaskStatus(task.id, !task.completed);
    } catch (err: any) {
      Alert.alert('Permission Error', err?.message || 'Failed to update task in Firestore');
    }
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Loading live task data...</Text>
      </View>
    );
  }

  // Error or Deleted State
  if (error || !task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Task no longer exists.'}</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Return to Tasks</Text>
        </Pressable>
      </View>
    );
  }

  // Live Task Details View
  return (
    <View style={styles.container}>
      {/* Dynamically set native header title from live task data */}
      <Stack.Screen
        options={{
          title: `Task: ${task.title}`,
        }}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Document ID</Text>
        <Text style={styles.idValue}>#{task.id}</Text>

        <Text style={styles.label}>Title</Text>
        <Text style={styles.titleValue}>{task.title}</Text>

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              task.completed ? styles.dotCompleted : styles.dotPending,
            ]}
          />
          <Text style={styles.statusText}>
            {task.completed ? 'Completed' : 'Pending Action'}
          </Text>
        </View>

        {/* Action Button: Toggle task from details screen */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            task.completed ? styles.actionButtonPending : styles.actionButtonComplete,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleToggle}
        >
          <Text style={styles.actionButtonText}>
            {task.completed ? 'Mark as Incomplete' : '✓ Mark as Completed'}
          </Text>
        </Pressable>
      </View>

      {/* Back Button */}
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Go Back to Tasks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: 14,
    marginBottom: 4,
  },
  idValue: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  titleValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotCompleted: {
    backgroundColor: '#22c55e',
  },
  dotPending: {
    backgroundColor: '#f59e0b',
  },
  statusText: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonComplete: {
    backgroundColor: '#16a34a', // Green
  },
  actionButtonPending: {
    backgroundColor: '#d97706', // Amber
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
