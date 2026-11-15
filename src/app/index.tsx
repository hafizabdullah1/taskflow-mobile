import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import AuthScreen from '../components/AuthScreen';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const router = useRouter();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cloud Tasks State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 1. Listen for Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2. Real-Time Cloud Firestore Sync for the logged-in user
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    setTasksLoading(true);

    // Query only tasks created by this specific user
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    // onSnapshot listens to live cloud updates
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loadedTasks: Task[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            completed: data.completed || false,
          };
        });

        setTasks(loadedTasks);
        setTasksLoading(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setTasksLoading(false);
      }
    );

    return unsubscribe; // Disconnect cloud listener when user logs out or unmounts
  }, [user]);

  // Handle Logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 3. CREATE: Add new task to Cloud Firestore
  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '' || !user) return;

    const titleToAdd = newTaskTitle.trim();
    setNewTaskTitle('');
    Keyboard.dismiss();

    try {
      await addDoc(collection(db, 'tasks'), {
        title: titleToAdd,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(), // Cloud timestamp
      });
    } catch (error) {
      console.error('Error adding task to Firestore:', error);
    }
  };

  // 4. UPDATE: Toggle task completion in Cloud Firestore
  const handleToggleTask = async (id: string, currentCompleted: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        completed: !currentCompleted,
      });
    } catch (error) {
      console.error('Error updating task in Firestore:', error);
    }
  };

  // 5. DELETE: Delete task from Cloud Firestore
  const handleDeleteTask = async (id: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
    }
  };

  // Open Details screen
  const handleOpenDetails = (task: Task) => {
    router.push({
      pathname: '/details',
      params: {
        id: task.id,
        title: task.title,
        completed: String(task.completed),
      },
    });
  };

  // Render Loading Screen
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Connecting to Firebase...</Text>
      </View>
    );
  }

  // Render Auth Screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Render Task Item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <Pressable
        style={styles.checkArea}
        onPress={() => handleToggleTask(item.id, item.completed)}
      >
        <View
          style={[
            styles.statusDot,
            item.completed ? styles.dotCompleted : styles.dotPending,
          ]}
        />
      </Pressable>

      <Pressable
        style={styles.taskContent}
        onPress={() => handleOpenDetails(item)}
      >
        <Text
          style={[
            styles.taskTitle,
            item.completed && styles.taskTitleCompleted,
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.taskSubtext}>Tap for details →</Text>
      </Pressable>

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
        {/* User Profile Bar */}
        <View style={styles.userBar}>
          <View style={styles.userInfo}>
            <Text style={styles.userGreeting}>Cloud Synced As:</Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>

        {/* Input & Add Button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add cloud task..."
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

        {/* Task List / Loading Indicator */}
        {tasksLoading && tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color="#38bdf8" />
            <Text style={styles.loadingText}>Fetching cloud tasks...</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
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
  userBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userGreeting: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  signOutButton: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  checkArea: {
    paddingRight: 12,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
  taskSubtext: {
    fontSize: 12,
    color: '#64748b',
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
    color: '#ef4444',
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
