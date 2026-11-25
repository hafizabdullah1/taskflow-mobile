import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';
import AuthScreen from '../components/AuthScreen';
import { TaskHeader } from '../components/TaskHeader';
import { TaskInput } from '../components/TaskInput';
import { TaskItem } from '../components/TaskItem';

export default function HomeScreen() {
  const router = useRouter();

  // Custom Hooks encapsulating business logic
  const { user, loading: authLoading, signOutUser } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks(user?.uid);

  // Navigate to Details Screen
  const handleOpenDetails = (task: Task) => {
    router.push({
      pathname: '/details',
      params: {
        id: task.id
      },
    });
  };

  // Initial Authentication Loading State
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Connecting to Firebase...</Text>
      </View>
    );
  }

  // Unauthenticated State Guard
  if (!user) {
    return <AuthScreen />;
  }

  // Authenticated Task Manager Screen
  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Decomposed User Profile Header */}
        <TaskHeader email={user.email} onSignOut={signOutUser} />

        {/* User-visible error banner if any operation fails */}
        {tasksError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{tasksError}</Text>
          </View>
        ) : null}

        {/* Decomposed Task Input Form */}
        <TaskInput onAddTask={addTask} />

        {/* Task List */}
        {tasksLoading && tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color="#38bdf8" />
            <Text style={styles.loadingText}>Fetching cloud tasks...</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onOpenDetails={handleOpenDetails}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>☁️ No cloud tasks yet!</Text>
                <Text style={styles.emptySubtext}>
                  Add your first task above to save it to Firestore.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  errorBanner: {
    backgroundColor: '#7f1d1d',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#fecaca',
    fontSize: 13,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 40,
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
