import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Task, taskConverter } from '../types/task';

// Attach strict type converter to the tasks collection reference
const tasksCollection = collection(db, 'tasks').withConverter(taskConverter);

/**
 * Subscribes to real-time updates for a specific user's tasks with ordering and limits.
 */
export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    tasksCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(25) // Query limit to safeguard performance and Firestore quota
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => docSnap.data());
      onUpdate(tasks);
    },
    (error) => {
      onError(error);
    }
  );
}

/**
 * Subscribes to a single task document by its ID (for live details screen consistency).
 */
export function subscribeToTaskById(
  taskId: string,
  onUpdate: (task: Task | null) => void,
  onError: (error: Error) => void
): () => void {
  const taskDocRef = doc(db, 'tasks', taskId).withConverter(taskConverter);

  return onSnapshot(
    taskDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      onError(error);
    }
  );
}

/**
 * Creates a new task in Firestore.
 */
export async function createTask(userId: string, title: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'tasks'), {
    title: title.trim(),
    completed: false,
    userId: userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Updates task completion status.
 */
export async function updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    completed,
  });
}

/**
 * Updates task title.
 */
export async function updateTaskTitle(taskId: string, title: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    title: title.trim(),
  });
}

/**
 * Deletes a task by ID.
 */
export async function deleteTaskById(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}
