import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { Shield } from 'lucide-react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Shield size={24} color={Colors.primary} />
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.lastUpdated}>Last updated: January 20, 2025</Text>
        
        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create an account, 
            log eco-friendly activities, participate in challenges, or contact us for support.
          </Text>
          
          <Text style={styles.subTitle}>Personal Information:</Text>
          <Text style={styles.bulletPoint}>• Name and email address</Text>
          <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
          <Text style={styles.bulletPoint}>• Activity logs and environmental data</Text>
          <Text style={styles.bulletPoint}>• Wallet addresses for NFT transactions</Text>
          
          <Text style={styles.subTitle}>Automatically Collected Information:</Text>
          <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
          <Text style={styles.bulletPoint}>• Usage data and app interactions</Text>
          <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to provide, maintain, and improve our services:
          </Text>
          
          <Text style={styles.bulletPoint}>• Track and verify your eco-friendly activities</Text>
          <Text style={styles.bulletPoint}>• Calculate carbon footprint savings</Text>
          <Text style={styles.bulletPoint}>• Mint and manage NFT rewards</Text>
          <Text style={styles.bulletPoint}>• Facilitate marketplace transactions</Text>
          <Text style={styles.bulletPoint}>• Send notifications about challenges and achievements</Text>
          <Text style={styles.bulletPoint}>• Provide customer support</Text>
          <Text style={styles.bulletPoint}>• Improve app functionality and user experience</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or otherwise transfer your personal information to third parties, 
            except in the following circumstances:
          </Text>
          
          <Text style={styles.bulletPoint}>• With your explicit consent</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
          <Text style={styles.bulletPoint}>• With service providers who assist our operations</Text>
          <Text style={styles.bulletPoint}>• In connection with blockchain transactions (public by nature)</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>4. Blockchain and NFTs</Text>
          <Text style={styles.paragraph}>
            GreenMint uses blockchain technology for NFT rewards. Please understand:
          </Text>
          
          <Text style={styles.bulletPoint}>• Blockchain transactions are public and permanent</Text>
          <Text style={styles.bulletPoint}>• NFT ownership and transfers are recorded on-chain</Text>
          <Text style={styles.bulletPoint}>• We cannot reverse blockchain transactions</Text>
          <Text style={styles.bulletPoint}>• Your wallet address may be visible to others</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your information:
          </Text>
          
          <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
          <Text style={styles.bulletPoint}>• Secure data transmission protocols</Text>
          <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
          <Text style={styles.bulletPoint}>• Limited access to personal information</Text>
          <Text style={styles.bulletPoint}>• Secure cloud storage with reputable providers</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the following rights regarding your personal information:
          </Text>
          
          <Text style={styles.bulletPoint}>• Access your personal data</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>• Export your data</Text>
          <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Control location data sharing</Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            GreenMint is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If we become aware that we have 
            collected such information, we will take steps to delete it.
          </Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data during such transfers.
          </Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new policy in the app and updating the "Last updated" date.
          </Text>
        </Card>

        <Card style={styles.contentCard}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          
          <Text style={styles.bulletPoint}>• Email: privacy@greenmint.app</Text>
          <Text style={styles.bulletPoint}>• Address: GreenMint Privacy Team</Text>
          <Text style={styles.bulletPoint}>• Phone: +1 (555) 123-4567</Text>
          
          <Text style={styles.paragraph}>
            We will respond to your inquiry within 30 days.
          </Text>
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
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  contentCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 4,
  },
});