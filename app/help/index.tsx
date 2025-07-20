import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronRight,
  Search,
  Book,
  Video,
  Users
} from 'lucide-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I log an eco-friendly activity?',
      answer: 'Go to the Home screen and tap "Log Activity". Select your activity type, add a description, and enter the estimated CO₂ saved. You can also upload evidence for verification.',
      expanded: false,
    },
    {
      id: '2',
      question: 'How are NFTs earned?',
      answer: 'NFTs are earned by completing challenges, reaching carbon saving milestones, and consistently logging eco-friendly activities. Each NFT represents a specific achievement.',
      expanded: false,
    },
    {
      id: '3',
      question: 'How is CO₂ savings calculated?',
      answer: 'CO₂ savings are calculated based on standard environmental impact data for each activity type. For example, cycling 1km saves approximately 0.2kg of CO₂ compared to driving.',
      expanded: false,
    },
    {
      id: '4',
      question: 'Can I transfer my NFTs to another wallet?',
      answer: 'Yes, you can connect your MetaMask or WalletConnect wallet and transfer NFTs. Go to the NFT Gallery and tap "Transfer NFT" on any earned NFT.',
      expanded: false,
    },
    {
      id: '5',
      question: 'How do challenges work?',
      answer: 'Challenges are time-limited activities that encourage specific eco-friendly behaviors. Join a challenge, complete the required activities, and earn rewards including NFTs and points.',
      expanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Email', onPress: () => console.log('Email support') },
        { text: 'Live Chat', onPress: () => console.log('Live chat') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HelpCircle size={24} color={Colors.primary} />
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Help</Text>
        
        <View style={styles.quickHelpGrid}>
          <TouchableOpacity style={styles.quickHelpItem}>
            <Book size={24} color={Colors.primary} />
            <Text style={styles.quickHelpText}>User Guide</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickHelpItem}>
            <Video size={24} color={Colors.primary} />
            <Text style={styles.quickHelpText}>Video Tutorials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickHelpItem}>
            <Users size={24} color={Colors.primary} />
            <Text style={styles.quickHelpText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickHelpItem} onPress={handleContactSupport}>
            <MessageCircle size={24} color={Colors.primary} />
            <Text style={styles.quickHelpText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard}>
            <TouchableOpacity 
              style={styles.faqHeader}
              onPress={() => toggleFAQ(faq.id)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {faq.expanded ? (
                <ChevronDown size={20} color={Colors.textLight} />
              ) : (
                <ChevronRight size={20} color={Colors.textLight} />
              )}
            </TouchableOpacity>
            
            {faq.expanded && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
              </View>
            )}
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        
        <Card style={styles.contactCard}>
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <MessageCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactDescription}>Get instant help from our support team</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDescription}>support@greenmint.app</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactDescription}>+1 (555) 123-4567</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Feedback</Text>
        
        <Card style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Help us improve GreenMint</Text>
          <Text style={styles.feedbackDescription}>
            Your feedback is valuable to us. Let us know how we can make the app better.
          </Text>
          
          <Button 
            title="Send Feedback" 
            variant="primary" 
            onPress={() => Alert.alert('Feedback', 'Feedback form would open here')}
            style={styles.feedbackButton}
          />
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
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
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
  quickHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickHelpItem: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickHelpText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  faqCard: {
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginTop: 12,
  },
  contactCard: {
    padding: 0,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  feedbackCard: {
    padding: 16,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  feedbackButton: {
    width: '100%',
  },
});