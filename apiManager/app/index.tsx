import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BACKEND_URL = 'http://192.168.251.173:5000/api'; // Your computer's IP address
const BACKEND_URL = 'http://localhost:5000/api'; // Your computer's IP address

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user has SUPERADMIN role
        if (data && data.role === 'SUPERADMIN') {
          // Store the token
          await AsyncStorage.setItem('jwt', data.token || 'your-token-here');
          await AsyncStorage.setItem('user', JSON.stringify(data));
          router.replace('/dashboard');
        } else {
          Alert.alert('Access Denied', 'Only SUPERADMIN users can access this application.');
        }
      } else {
        Alert.alert('Error', data.message || 'Authentication failed');
      }
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              API Manager
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Welcome back!
            </ThemedText>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

}); 