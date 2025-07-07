import Colors from '@/constants/Colors';
import { EcoActivity } from '@/types';
import { formatDistanceToNow } from '@/utils/date';
import { Bike, Bus, Leaf, Lightbulb, Recycle, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from './Card';

interface ActivityCardProps {
  activity: EcoActivity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
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
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.timeText}>{formatDistanceToNow(new Date(activity.date))}</Text>
          <Text style={styles.pointsText}>+{activity.points} points</Text>
        </View>
      </View>
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
});