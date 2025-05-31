import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addBookingRequest,
  deleteBooking,
  getMyBookings,
} from "../services/api";

export default function CustomerDashboard() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState<null | {
    start: string;
    end: string;
  }>(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMyBookings().then((res) => setBookings(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuggestion(null);

    try {
      const res = await addBookingRequest(
        startTime?.toISOString(),
        endTime?.toISOString()
      );
      setMessage(`Booking confirmed with ${res.data.painter.name}`);
      const updated = await getMyBookings();
      setBookings(updated.data);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.suggestedStartTime) {
        setSuggestion({
          start: errorData.suggestedStartTime,
          end: errorData.suggestedEndTime,
        });
      } else {
        setMessage(errorData?.error || "Booking failed");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Start Time:</label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select start time"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Time:</label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select end time"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Request Booking
        </button>

        {message && (
          <p className="mt-2 text-sm text-red-600 font-medium">{message}</p>
        )}
      </form>

      {suggestion && (
        <div className="bg-yellow-100 border border-yellow-400 rounded p-4 mb-6">
          <p className="font-semibold text-yellow-700">
            No painters available for the requested time.
          </p>
          <p>
            Suggested Slot:{" "}
            <strong>
              {dayjs(suggestion.start).format("MMM D, h:mm A")} -{" "}
              {dayjs(suggestion.end).format("h:mm A")}
            </strong>
          </p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                  <th className="px-4 py-2">Painter</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {dayjs(b.startTime).format("MMM D, h:mm A")}
                    </td>
                    <td className="px-4 py-2">
                      {dayjs(b.endTime).format("h:mm A")}
                    </td>
                    <td className="px-4 py-2">
                      {b.painter?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2 capitalize">{b.status}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={async () => {
                          try {
                            await deleteBooking(b.id);
                            setMessage("Booking deleted successfully.");
                            const updated = await getMyBookings();
                            setBookings(updated.data);
                          } catch (err: any) {
                            setMessage(
                              err.response?.data?.error ||
                                "Failed to delete booking."
                            );
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
