export interface TimeZoneLocation {
  id: string;
  name: string;
  label: string;
  offset: number;
  isCurrent: boolean;
  secondaryLabels?: string[];
}

export interface MetadataProps {
  title?: string;
  description?: string;
}
