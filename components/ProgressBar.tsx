import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export default function ProgressBar({
  progress,
  total,
  label,
  showPercentage = true,
  height = 8,
  color = Colors.primary,
  backgroundColor = Colors.backgroundLight,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((progress / total) * 100), 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height, backgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{percentage}% complete</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageContainer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  percentage: {
    fontSize: 12,
    color: Colors.textLight,
  },
});