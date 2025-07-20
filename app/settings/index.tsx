import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { useOnboarding } from '@/store/onboardingStore';
import { 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  Info, 
  Moon, 
  Smartphone,
  Database,
  ChevronRight,
  Settings as SettingsIcon
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataUsageOptimized, setDataUsageOptimized] = useState(true);

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Settings',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Kinyarwanda', onPress: () => console.log('Kinyarwanda selected') },
        { text: 'Korean', onPress: () => console.log('Korean selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => console.log('Cache cleared') },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported as a JSON file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Data exported') },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset the onboarding flow. You will see the welcome screens again on next app launch.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            await resetOnboarding();
            router.replace('/onboarding');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon size={24} color={Colors.primary} />
        <Text style={styles.title}>App Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Notification Schedule</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>8 AM - 8 PM</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Moon size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={darkModeEnabled ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageChange}>
            <View style={styles.menuIconContainer}>
              <Globe size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>English</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Smartphone size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Optimize for Low Data</Text>
            <Switch
              value={dataUsageOptimized}
              onValueChange={setDataUsageOptimized}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={dataUsageOptimized ? Colors.primary : Colors.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
            <View style={styles.menuIconContainer}>
              <Database size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Clear Cache</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>2.4 MB</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
            <View style={styles.menuIconContainer}>
              <Database size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Export My Data</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/help')}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.menuIconContainer}>
              <Shield size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Info size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>About GreenMint</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>v1.0.0</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Database size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Developer Options</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleResetOnboarding}>
            <View style={styles.menuIconContainer}>
              <Info size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Reset Onboarding</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Info size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Debug Information</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
});