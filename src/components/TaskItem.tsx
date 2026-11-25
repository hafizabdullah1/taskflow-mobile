import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (task: Task) => void;
}

/**
 * Memoized TaskItem component to prevent unnecessary re-renders in large lists.
 */
export const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onDelete,
  onOpenDetails,
}: TaskItemProps) {
  return (
    <View style={styles.taskCard}>
      {/* Checkbox status area */}
      <Pressable
        style={styles.checkArea}
        onPress={() => onToggle(task.id, task.completed)}
      >
        <View
          style={[
            styles.statusDot,
            task.completed ? styles.dotCompleted : styles.dotPending,
          ]}
        />
      </Pressable>

      {/* Tappable body to navigate to Details */}
      <Pressable
        style={styles.taskContent}
        onPress={() => onOpenDetails(task)}
      >
        <Text
          style={[
            styles.taskTitle,
            task.completed && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Text>
        <Text style={styles.taskSubtext}>Tap for details →</Text>
      </Pressable>

      {/* Delete action button */}
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
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
});
