export interface AgencyInfo {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    availability: string;
    responseTime: string;
  };
  businessHours: {
    weekdays: {
      start: string;
      end: string;
    };
    saturday: {
      start: string;
      end: string;
    };
    sunday: {
      start: string;
      end: string;
    };
  };
}

export interface AgencyCardProps {
  agency: AgencyInfo;
  className?: string;
  onContactClick?: () => void;
}
