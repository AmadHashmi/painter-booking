export interface Booking {
  bookingId: string;
  startTime: string;
  endTime: string;
  status?: string;
  painter?: {
    id: string;
    name: string;
  };
}
