export interface TimeZoneLocation {
  id: string;
  label: string;
  name: string;
  isCurrent: boolean;
  secondaryLabels?: string[];
  offset?: number; // Add this to match the existing usage
}
