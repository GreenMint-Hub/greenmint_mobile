import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useToast } from '@/hooks/useToast';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { CheckCircle, XCircle, Clock, User, Camera, Play } from 'lucide-react-native';

interface VerificationItem {
  id: string;
  userName: string;
  userAvatar: string;
  activityType: string;
  activityTitle: string;
  description: string;
  evidence: {
    type: 'photo' | 'video';
    url: string;
  }[];
  submittedAt: string;
  co2Claimed: number;
  points: number;
}

const VERIFICATION_QUEUE: VerificationItem[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    activityType: 'cycling',
    activityTitle: 'Cycled to work',
    description: 'Cycled 15km to work instead of driving. Took the scenic route through the park.',
    evidence: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
      { type: 'photo', url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
    ],
    submittedAt: '2 hours ago',
    co2Claimed: 3.5,
    points: 35,
  },
  {
    id: '2',
    userName: 'Mike Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    activityType: 'recycling',
    activityTitle: 'Recycled household waste',
    description: 'Sorted and recycled paper, plastic, and glass from this week. Took everything to the local recycling center.',
    evidence: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
      { type: 'video', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
    ],
    submittedAt: '4 hours ago',
    co2Claimed: 2.8,
    points: 28,
  },
  {
    id: '3',
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    activityType: 'publicTransport',
    activityTitle: 'Used public transport',
    description: 'Took the bus and metro instead of driving to downtown. Much more relaxing than dealing with traffic!',
    evidence: [
      { type: 'photo', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
    ],
    submittedAt: '6 hours ago',
    co2Claimed: 4.2,
    points: 42,
  },
];

export default function VerificationScreen() {
  const { toast, showToast, hideToast } = useToast();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [verificationQuestions] = useState([
    'Does the evidence clearly show the claimed activity?',
    'Is the CO₂ savings estimate reasonable for this activity?',
    'Does the description match the evidence provided?',
    'Is this a legitimate eco-friendly activity?',
  ]);
  const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({});

  const currentItem = VERIFICATION_QUEUE[currentItemIndex];

  const handleAnswer = (questionIndex: number, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleApprove = () => {
    const allAnswered = verificationQuestions.every((_, index) => answers[index] !== undefined);
    const allPositive = verificationQuestions.every((_, index) => answers[index] === true);

    if (!allAnswered) {
      showToast('Please answer all verification questions', 'error');
      return;
    }

    if (allPositive) {
      showToast('Activity approved! User will receive their points.', 'success');
    } else {
      Alert.alert(
        'Approve with Issues?',
        'Some questions were answered negatively. Are you sure you want to approve this activity?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Approve Anyway', 
            onPress: () => showToast('Activity approved with notes.', 'success')
          },
        ]
      );
      return;
    }

    moveToNext();
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Activity',
      'Are you sure you want to reject this activity? The user will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            showToast('Activity rejected. User has been notified.', 'info');
            moveToNext();
          }
        },
      ]
    );
  };

  const moveToNext = () => {
    if (currentItemIndex < VERIFICATION_QUEUE.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setAnswers({});
    } else {
      showToast('All verification items completed!', 'success');
    }
  };

  const handleSkip = () => {
    showToast('Item skipped for later review', 'info');
    moveToNext();
  };

  if (!currentItem) {
    return (
      <View style={styles.emptyContainer}>
        <CheckCircle size={64} color={Colors.success} />
        <Text style={styles.emptyTitle}>All Caught Up!</Text>
        <Text style={styles.emptyDescription}>
          No activities pending verification at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast 
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Verify Evidence</Text>
        <Text style={styles.subtitle}>
          {currentItemIndex + 1} of {VERIFICATION_QUEUE.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <Image source={{ uri: currentItem.userAvatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentItem.userName}</Text>
              <Text style={styles.activityTitle}>{currentItem.activityTitle}</Text>
              <Text style={styles.submittedTime}>Submitted {currentItem.submittedAt}</Text>
            </View>
            <View style={styles.claimsContainer}>
              <Text style={styles.claimValue}>{currentItem.co2Claimed}kg CO₂</Text>
              <Text style={styles.claimPoints}>{currentItem.points} points</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Activity Description</Text>
          <Text style={styles.description}>{currentItem.description}</Text>
        </Card>

        <Card style={styles.evidenceCard}>
          <Text style={styles.sectionTitle}>Evidence Provided</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.evidenceContainer}>
              {currentItem.evidence.map((item, index) => (
                <View key={index} style={styles.evidenceItem}>
                  <Image source={{ uri: item.url }} style={styles.evidenceImage} />
                  {item.type === 'video' && (
                    <View style={styles.playButton}>
                      <Play size={24} color={Colors.white} />
                    </View>
                  )}
                  <Text style={styles.evidenceType}>
                    {item.type === 'photo' ? '📷 Photo' : '🎥 Video'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Card style={styles.questionsCard}>
          <Text style={styles.sectionTitle}>Verification Questions</Text>
          <Text style={styles.questionsDescription}>
            Please review the evidence and answer the following questions:
          </Text>
          
          {verificationQuestions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question}</Text>
              <View style={styles.answerButtons}>
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    styles.yesButton,
                    answers[index] === true && styles.selectedAnswer
                  ]}
                  onPress={() => handleAnswer(index, true)}
                >
                  <CheckCircle 
                    size={16} 
                    color={answers[index] === true ? Colors.white : Colors.success} 
                  />
                  <Text 
                    style={[
                      styles.answerText,
                      answers[index] === true && styles.selectedAnswerText
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    styles.noButton,
                    answers[index] === false && styles.selectedAnswer
                  ]}
                  onPress={() => handleAnswer(index, false)}
                >
                  <XCircle 
                    size={16} 
                    color={answers[index] === false ? Colors.white : Colors.error} 
                  />
                  <Text 
                    style={[
                      styles.answerText,
                      answers[index] === false && styles.selectedAnswerText
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button 
          title="Skip" 
          variant="outline" 
          onPress={handleSkip}
          style={styles.skipButton}
        />
        <Button 
          title="Reject" 
          variant="outline" 
          onPress={handleReject}
          style={[styles.rejectButton, { borderColor: Colors.error }]}
          textStyle={{ color: Colors.error }}
        />
        <Button 
          title="Approve" 
          variant="primary" 
          onPress={handleApprove}
          style={styles.approveButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    margin: 16,
    marginBottom: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  submittedTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  claimsContainer: {
    alignItems: 'flex-end',
  },
  claimValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  claimPoints: {
    fontSize: 12,
    color: Colors.textLight,
  },
  descriptionCard: {
    margin: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  evidenceCard: {
    margin: 16,
    marginVertical: 8,
  },
  evidenceContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  evidenceItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  evidenceImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceType: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  questionsCard: {
    margin: 16,
    marginVertical: 8,
  },
  questionsDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  answerButtons: {
    flexDirection: 'row',
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  yesButton: {
    borderColor: Colors.success,
    backgroundColor: Colors.white,
  },
  noButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  selectedAnswer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  selectedAnswerText: {
    color: Colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  skipButton: {
    flex: 1,
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    flex: 1,
    marginLeft: 8,
  },
});