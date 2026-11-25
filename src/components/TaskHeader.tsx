import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TaskHeaderProps {
  email: string | null;
  onSignOut: () => void;
}

export function TaskHeader({ email, onSignOut }: TaskHeaderProps) {
  return (
    <View style={styles.userBar}>
      <View style={styles.userInfo}>
        <Text style={styles.userGreeting}>Cloud Synced As:</Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {email || 'Anonymous User'}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  signOutButtonText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
});
