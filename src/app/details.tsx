import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function TaskDetailsScreen() {
  const router = useRouter();

  const { id, title, completed } = useLocalSearchParams<{
    id: string;
    title: string;
    completed: string;
  }>();

  const isCompleted = completed === 'true';

  return (
    <View style={styles.container}>

        <Stack.Screen
            options={{
                title: title ? `Task: ${title}` : "Task Details",
            }}

        />

      <View style={styles.card}>
        <Text style={styles.label}>Task ID</Text>
        <Text style={styles.idValue}>#{id}</Text>

        <Text style={styles.label}>Task Title</Text>
        <Text style={styles.titleValue}>{title}</Text>

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              isCompleted ? styles.dotCompleted : styles.dotPending,
            ]}
          />
          <Text style={styles.statusText}>
            {isCompleted ? 'Completed' : 'Pending Action'}
          </Text>
        </View>
      </View>

      {/* Button to pop back to the list screen */}
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
    marginTop: 12,
    marginBottom: 4,
  },
  idValue: {
    fontSize: 14,
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