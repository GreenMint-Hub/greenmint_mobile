
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import Card from './Card';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StatisticsComponentProps {
  data: {
    totalCO2Saved: number;
    activities: {
      type: string;
      co2Saved: number;
      [key: string]: any;
    }[];
  };
}

export default function StatisticsComponent({ data }: StatisticsComponentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedChart, setSelectedChart] = useState('bar');

  const getActivityStats = () => {
    const stats = data.activities.reduce((acc, activity) => {
      const type = activity.type;
      if (!acc[type]) {
        acc[type] = { count: 0, co2Saved: 0 };
      }
      acc[type].count += 1;
      acc[type].co2Saved += activity.co2Saved;
      return acc;
    }, {} as Record<string, { count: number; co2Saved: number }>);

    return Object.entries(stats).map(([type, statData]) => ({
      type,
      count: statData.count,
      co2Saved: statData.co2Saved,
      percentage: (statData.co2Saved / data.totalCO2Saved) * 100,
    }));
  };

  const getActivityName = (type: string) => {
    const names: Record<string, string> = {
      cycling: 'Cycling',
      publicTransport: 'Public Transport',
      recycling: 'Recycling',
      energySaving: 'Energy Saving',
      plantBasedMeal: 'Plant-based Meals',
      secondHandPurchase: 'Second-hand Purchases',
    };
    return names[type] || type;
  };

  const getActivityColor = (type: string, index: number) => {
    const colors = [
      Colors.primary,
      '#81C784',
      '#AED581',
      '#C5E1A5',
      '#E6EE9C',
      '#F0F4C3',
    ];
    return colors[index % colors.length];
  };

  const getTrendData = () => {
    return {
      weeklyChange: 12.5,
      monthlyChange: 8.3,
      isIncreasing: true,
    };
  };

  const activityStats = getActivityStats();
  const trendData = getTrendData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.periodSelector}>
          {['This Week', 'This Month', 'This Year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.selectedPeriodText
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View>
            <Text style={styles.overviewTitle}>Total CO₂ Saved</Text>
            <Text style={styles.overviewValue}>{data.totalCO2Saved}kg</Text>
          </View>
          <View style={styles.trendContainer}>
            {trendData.isIncreasing ? (
              <TrendingUp size={24} color={Colors.success} />
            ) : (
              <TrendingDown size={24} color={Colors.error} />
            )}
            <Text style={[
              styles.trendText,
              { color: trendData.isIncreasing ? Colors.success : Colors.error }
            ]}>
              +{trendData.weeklyChange}%
            </Text>
          </View>
        </View>
        
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{data.activities.length}</Text>
            <Text style={styles.metricLabel}>Total Activities</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {(data.totalCO2Saved / data.activities.length || 0).toFixed(1)}kg
            </Text>
            <Text style={styles.metricLabel}>Avg per Activity</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {Math.round(data.totalCO2Saved / 30 * 10) / 10}kg
            </Text>
            <Text style={styles.metricLabel}>Daily Average</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Activity Breakdown</Text>
          <View style={styles.chartTypeSelector}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                selectedChart === 'bar' && styles.selectedChartType
              ]}
              onPress={() => setSelectedChart('bar')}
            >
              <BarChart3 size={16} color={selectedChart === 'bar' ? Colors.white : Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                selectedChart === 'pie' && styles.selectedChartType
              ]}
              onPress={() => setSelectedChart('pie')}
            >
              <PieChart size={16} color={selectedChart === 'pie' ? Colors.white : Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {selectedChart === 'bar' ? (
          <View style={styles.barChart}>
            {activityStats.map((stat, index) => (
              <View key={stat.type} style={styles.barItem}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (stat.co2Saved / Math.max(...activityStats.map(s => s.co2Saved), 1)) * 100,
                        backgroundColor: getActivityColor(stat.type, index),
                      }
                    ]}
                  />
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.barLabel}>{getActivityName(stat.type)}</Text>
                  <Text style={styles.barValue}>{stat.co2Saved.toFixed(1)}kg</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.pieChart}>
            <View style={styles.pieContainer}>
              <View style={styles.pieCenter}>
                <Text style={styles.pieCenterValue}>{data.totalCO2Saved}kg</Text>
                <Text style={styles.pieCenterLabel}>Total CO₂</Text>
              </View>
            </View>
            <View style={styles.pieLegend}>
              {activityStats.map((stat, index) => (
                <View key={stat.type} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: getActivityColor(stat.type, index) }
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {getActivityName(stat.type)} ({stat.co2Saved.toFixed(1)}kg)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>

      <Card style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🚴‍♂️</Text>
            <Text style={styles.insightText}>
              Cycling is your top CO₂ saving activity this month
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>📈</Text>
            <Text style={styles.insightText}>
              You're saving {trendData.weeklyChange}% more CO₂ than last week
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🎯</Text>
            <Text style={styles.insightText}>
              You're {Math.round((data.totalCO2Saved / 200) * 100)}% towards your 200kg goal
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedPeriod: {
    backgroundColor: Colors.white,
  },
  periodText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: Colors.primary,
  },
  overviewCard: {
    padding: 16,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  trendContainer: {
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  chartCard: {
    padding: 16,
    gap: 20,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 6,
    padding: 2,
  },
  chartTypeButton: {
    padding: 6,
    borderRadius: 4,
  },
  selectedChartType: {
    backgroundColor: Colors.primary,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 140, // Increased to accommodate top-aligned labels
  },
  barItem: {
    flex: 1,
    gap: 4,
    flexDirection: 'column', // Stack label, bar, and value vertically
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barContainer: {
    width: 20,
    height: 80,
    justifyContent: 'flex-end', // Bottom-align bars
    marginVertical: 8, // Space for label and value
  },
  bar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    height: 28,
    color: Colors.textLight,
    textAlign: 'center',
  },
  valueContainer: {
    height: 20,
    justifyContent: 'center', // Center value vertically
    width: '100%',
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center', // Center value horizontally
  },
  pieChart: {
    alignItems: 'center',
  },
  pieContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  pieCenterLabel: {
    fontSize: 10,
    color: Colors.textLight,
  },
  pieLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text,
  },
  insightsCard: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
});
 

