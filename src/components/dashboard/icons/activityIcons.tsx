type RecentActivityIcon = Record<string, any>;
import ConfirmedReservation from "../../../../public/confirmed_reservation.svg";

export const recentActivityIcons: RecentActivityIcon = {
  confirmed_reservation: (
    <img src={ConfirmedReservation} className="w-4 h-4" alt="" />
  ),
};
