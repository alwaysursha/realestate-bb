export interface StatsData {
  total: number;
  monthlyChange: number;
  isPositive: boolean;
}

export interface ViewsData extends StatsData {
  change: number;
} 