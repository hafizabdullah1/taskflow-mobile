import { 
  DocumentData, 
  FirestoreDataConverter, 
  QueryDocumentSnapshot, 
  SnapshotOptions, 
  Timestamp 
} from 'firebase/firestore';

/**
 * Core Task entity representing a task in the application.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date | null;
}

/**
 * Data Transfer Object for creating a new task.
 */
export interface CreateTaskDTO {
  title: string;
  userId: string;
}

/**
 * Type-safe Firestore Data Converter.
 * Ensures bidirectional type safety between Firestore DocumentData and TypeScript Task entity.
 */
export const taskConverter: FirestoreDataConverter<Task> = {
  toFirestore(task: Task): DocumentData {
    return {
      title: task.title,
      completed: task.completed,
      userId: task.userId,
      createdAt: task.createdAt ? Timestamp.fromDate(task.createdAt) : null,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Task {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title ?? '',
      completed: data.completed ?? false,
      userId: data.userId ?? '',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
    };
  },
};
