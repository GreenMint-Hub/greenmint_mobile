
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { 
  User, 
  Award, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Globe, 
  Shield, 
  Wallet,
  CheckSquare,
  ChevronRight
} from 'lucide-react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToHelp = () => {
    router.push('/help');
  };

  const navigateToPrivacy = () => {
    router.push('/privacy');
  };

  const navigateToNFTs = () => {
    router.push('/nft/details');
  };

  const navigateToVerification = () => {
    router.push('/verification');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.profileCard} onPress={navigateToProfile}>
        <Image 
          source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
          style={styles.avatar} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{(user as any).username || user.name || user.email}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
        <ChevronRight size={20} color={Colors.textLight} />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
            <View style={styles.menuIconContainer}>
              <User size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Profile</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToNFTs}>
            <View style={styles.menuIconContainer}>
              <Award size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>My NFTs</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Wallet size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Connect Wallet</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moderation</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToVerification}>
            <View style={styles.menuIconContainer}>
              <CheckSquare size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Verify Evidence</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
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
              <Globe size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>English</Text>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToSettings}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>App Settings</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToHelp}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToPrivacy}>
            <View style={styles.menuIconContainer}>
              <Shield size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
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
  badgeContainer: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 24,
  },
});

