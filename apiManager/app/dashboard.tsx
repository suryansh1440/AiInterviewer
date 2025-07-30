import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BACKEND_URL = 'http://192.168.251.173:5000/api'; // Your computer's IP address
const BACKEND_URL = 'http://localhost:5000/api'; // Your computer's IP address

interface Api {
  _id: string;
  apiEmail: string;
  apiKey: string;
  apiStatus: 'active' | 'overloaded';
  apiUsage: number;
  createdAt: string;
}

export default function DashboardScreen() {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApiEmail, setNewApiEmail] = useState('');
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    checkAuth();
    fetchApis();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        router.replace('/');
      }
    } catch (error) {
      console.log('Auth check error:', error);
      router.replace('/');
    }
  };

  const fetchApis = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/getAllApis`);
      if (response.ok) {
        const data = await response.json();
        setApis(data);
      } else {
        Alert.alert('Error', 'Failed to fetch APIs');
      }
    } catch (error) {
      console.log('Fetch APIs error:', error);
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApis();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const addApi = async () => {
    if (!newApiEmail || !newApiKey) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/addApi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiEmail: newApiEmail,
          apiKey: newApiKey,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'API added successfully');
        setShowAddModal(false);
        setNewApiEmail('');
        setNewApiKey('');
        fetchApis();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to add API');
      }
    } catch (error) {
      console.log('Add API error:', error);
      Alert.alert('Error', 'Network error');
    }
  };

  const resetApi = async (apiKey: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/resetApi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        Alert.alert('Success', 'API reset successfully');
        fetchApis();
      } else {
        Alert.alert('Error', 'Failed to reset API');
      }
    } catch (error) {
      console.log('Reset API error:', error);
      Alert.alert('Error', 'Network error');
    }
  };

  const pauseApi = async (apiKey: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/overUsage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        Alert.alert('Success', 'API paused successfully');
        fetchApis();
      } else {
        Alert.alert('Error', 'Failed to pause API');
      }
    } catch (error) {
      console.log('Pause API error:', error);
      Alert.alert('Error', 'Network error');
    }
  };

  const deleteApi = async (apiId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this API?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/deleteApi`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiId }),
              });

              if (response.ok) {
                Alert.alert('Success', 'API deleted successfully');
                fetchApis();
              } else {
                Alert.alert('Error', 'Failed to delete API');
              }
            } catch (error) {
              console.log('Delete API error:', error);
              Alert.alert('Error', 'Network error');
            }
          },
        },
      ]
    );
  };

  const renderApiItem = ({ item }: { item: Api }) => (
    <View style={styles.apiCard}>
      <View style={styles.apiHeader}>
        <Text style={styles.apiEmail}>{item.apiEmail}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.apiStatus === 'active' ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.statusText}>{item.apiStatus}</Text>
        </View>
      </View>
      
      <Text style={styles.apiKey}>Key: {item.apiKey.substring(0, 20)}...</Text>
      <Text style={styles.apiUsage}>Usage: {item.apiUsage}</Text>
      <Text style={styles.apiDate}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={() => resetApi(item.apiKey)}
        >
          <Text style={styles.actionButtonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.pauseButton]}
          onPress={() => pauseApi(item.apiKey)}
        >
          <Text style={styles.actionButtonText}>Pause</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteApi(item._id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading APIs...</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>API Manager</ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{apis.length}</Text>
          <Text style={styles.statLabel}>Total APIs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{apis.filter(api => api.apiStatus === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{apis.filter(api => api.apiStatus === 'overloaded').length}</Text>
          <Text style={styles.statLabel}>Paused</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.addButtonText}>+ Add New API</Text>
      </TouchableOpacity>

      <FlatList
        data={apis}
        renderItem={renderApiItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No APIs found</Text>
            <Text style={styles.emptySubtext}>Add your first API to get started</Text>
          </View>
        }
      />

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New API</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="API Email"
              placeholderTextColor="#666"
              value={newApiEmail}
              onChangeText={setNewApiEmail}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="API Key"
              placeholderTextColor="#666"
              value={newApiKey}
              onChangeText={setNewApiKey}
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={addApi}
              >
                <Text style={styles.addModalButtonText}>Add API</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  apiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  apiKey: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  apiUsage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  apiDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addModalButton: {
    backgroundColor: '#007AFF',
  },
  addModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 