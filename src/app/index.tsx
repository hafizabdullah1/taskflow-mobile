import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    // The main container View
    <View style={styles.container}>
      <Text style={styles.title}>Hello, Task Master!</Text>
      <Text style={styles.subtitle}>Welcome to Phase 1: Core Primitives</Text>
    </View>
  );
}

// Stylesheet definition
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height and width of the screen
    backgroundColor: '#0f172a', // Deep slate dark background
    alignItems: 'center', // Centers items horizontally
    justifyContent: 'center', // Centers items vertically
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#38bdf8', // Sky blue color
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Slate grey
  },
});