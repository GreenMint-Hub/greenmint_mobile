import Colors from '@/constants/Colors';
import { EcoActivity } from '@/types';
import { formatDistanceToNow } from '@/utils/date';
import { Bike, Bus, Leaf, Lightbulb, Recycle, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from './Card';
import Button from './Button';

interface ActivityCardProps {
  activity: EcoActivity;
  showVoteButton?: boolean;
  onVote?: (value: 'yes' | 'no') => void;
  currentUserId?: string;
}

export default function ActivityCard({ activity, showVoteButton, onVote, currentUserId }: ActivityCardProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'cycling':
        return <Bike size={24} color={Colors.primary} />;
      case 'publicTransport':
        return <Bus size={24} color={Colors.primary} />;
      case 'recycling':
        return <Recycle size={24} color={Colors.primary} />;
      case 'energySaving':
        return <Lightbulb size={24} color={Colors.primary} />;
      case 'plantBasedMeal':
        return <Leaf size={24} color={Colors.primary} />;
      case 'secondHandPurchase':
        return <ShoppingBag size={24} color={Colors.primary} />;
      default:
        return <Leaf size={24} color={Colors.primary} />;
    }
  };

  // Count votes
  const yesVotes = activity.votes?.filter(v => v.value === 'yes').length || 0;
  const noVotes = activity.votes?.filter(v => v.value === 'no').length || 0;
  // Check if current user has voted
  const userVoted = !!activity.votes?.find(v => v.userId === currentUserId);

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.co2Text}>CO₂ saved: {activity.co2Saved}kg</Text>
            {activity.status && (
              <Text style={[styles.status, styles[activity.status]]}>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</Text>
            )}
            {activity.user?.name && (
              <Text style={styles.userName}>by {activity.user.name}</Text>
            )}
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.timeText}>{formatDistanceToNow(new Date(activity.date))}</Text>
          <Text style={styles.pointsText}>+{activity.points} points</Text>
        </View>
      </View>
      {showVoteButton && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, alignItems: 'center' }}>
          <Button
            title={`Yes (${yesVotes})`}
            variant="primary"
            onPress={() => onVote && onVote('yes')}
            style={{ marginRight: 8 }}
            disabled={userVoted}
          />
          <Button
            title={`No (${noVotes})`}
            variant="outline"
            onPress={() => onVote && onVote('no')}
            disabled={userVoted}
          />
          {userVoted && <Text style={{ marginLeft: 8, color: Colors.textLight, fontSize: 12 }}>You voted</Text>}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  co2Text: {
    fontSize: 14,
    color: Colors.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  status: { marginLeft: 8, fontSize: 12 },
  pending: { color: '#f39c12' },
  verified: { color: '#27ae60' },
  rejected: { color: '#e74c3c' },
  voting: { color: '#2980b9' },
  userName: { marginLeft: 8, fontSize: 12, color: Colors.textLight },
});

