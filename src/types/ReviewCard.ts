export interface CustomerReview {
  id: string;
  customerName: string;
  customerType: 'client' | 'premium' | 'vip';
  rating: number;
  reviewText: string;
  date?: Date;
  verified?: boolean;
}

export interface ReviewCardProps {
  review: CustomerReview;
  className?: string;
  showDate?: boolean;
}
