// 사용자 활동 데이터 타입 정의

export type StepActivity = {
  type: 'steps';
  date: string; // YYYY-MM-DD
  count: number; // steps count
};

export type CarbonReductionActivity = {
  type: 'carbon_reduction';
  date: string; // YYYY-MM-DD
  action: string; // e.g. 'Public Transport', 'Reduce Plastic'
  value: number; // reduction amount (e.g. kg CO2, count)
};

export type UserActivity = StepActivity | CarbonReductionActivity;

export type Feedback = {
  date: string;
  summary: string;
};

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};