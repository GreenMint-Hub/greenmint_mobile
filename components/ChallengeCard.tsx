import Colors from '@/constants/Colors';
import { Challenge } from '@/types';
import { Award, Bike, Leaf, Lightbulb, Recycle, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import Card from './Card';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
  onProgress?: () => void;
}

export default function ChallengeCard({ challenge, onJoin, onProgress }: ChallengeCardProps) {
  const isActive = challenge.active;
  const isCompleted = challenge.completed;

  // Default empty functions to handle optional callbacks
  const handleJoin = () => {
    if (onJoin) onJoin();
  };

  const handleProgress = () => {
    if (onProgress) onProgress();
  };

  // Helper function to determine which icon to show based on title
  const getChallengeIcon = () => {
    const title = challenge.title.toLowerCase();
    
    if (title.includes('cycle') || title.includes('bike')) {
      return <Bike size={24} color={Colors.primary} />;
    } else if (title.includes('energy') || title.includes('power')) {
      return <Lightbulb size={24} color={Colors.primary} />;
    } else if (title.includes('recycle') || title.includes('waste')) {
      return <Recycle size={24} color={Colors.primary} />;
    } else {
      return <Leaf size={24} color={Colors.primary} />;
    }
  };

  return (
    <Card 
      variant={isActive ? "default" : "outlined"} 
      style={[
        styles.card, 
        isActive && styles.activeCard
      ]}
    >
      {isActive ? (
        <View>
          <Text style={styles.activeTitle}>{challenge.title}</Text>
          <Text style={styles.activeDescription}>{challenge.description}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${challenge.progress}%` }
                ]} 
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{challenge.progress}% complete</Text>
              <Text style={styles.daysText}>{challenge.duration} days left</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={16} color={Colors.white} />
              <Text style={styles.statText}>{challenge.participants} participants</Text>
            </View>
            <View style={styles.statItem}>
              <Leaf size={16} color={Colors.white} />
              <Text style={styles.statText}>-{challenge.co2Potential}kg CO₂ potential</Text>
            </View>
          </View>
          
          <View style={styles.rewardRow}>
            <View style={styles.rewardItem}>
              <Award size={16} color={Colors.white} />
              <Text style={styles.rewardText}>Earn {challenge.reward}</Text>
            </View>
            <Button 
              title="Log Progress" 
              variant="secondary" 
              size="small" 
              onPress={handleProgress} 
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.headerRow}>
            <View style={styles.iconContainer}>
              {getChallengeIcon()}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{challenge.title}</Text>
              <Text style={styles.description}>{challenge.description}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Difficulty</Text>
              <Text style={styles.detailValue}>{challenge.difficulty}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{challenge.duration} days</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>{challenge.participants}</Text>
            </View>
          </View>
          
          {!isCompleted && (
            <View style={styles.rewardContainer}>
              <Award size={16} color={Colors.primary} />
              <Text style={styles.rewardName}>{challenge.reward}</Text>
              <Button 
                title="Join Challenge" 
                variant="primary" 
                size="small" 
                onPress={handleJoin} 
                style={styles.joinButton}
              />
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 16,
  },
  activeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  activeDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  daysText: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
    marginLeft: 4,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardName: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
    flex: 1,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  completedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
});