import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAvailability } from "../services/api"; // add this
import {
  addAvailability,
  getMyBookings,
  getMyAvailability,
} from "../services/api";
import type { Booking } from "../types";

export default function PainterDashboard({ user }: { user: any }) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getMyBookings(user.id).then((res) => setBookings(res.data));
      getMyAvailability(user.id).then((res) => setAvailabilities(res.data));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAvailability(
        startTime?.toISOString(),
        endTime?.toISOString(),
        user.id
      );
      setMessage("Availability added.");
      setStartTime(null);
      setEndTime(null);
      const updated = await getMyAvailability(user.id);
      setAvailabilities(updated.data);
    } catch (err: any) {
      console.log(err.response?.data);
      setMessage(err.response?.data.error || "Failed to add availability.");
    }
  };
  const handleDeleteAvailability = async (id: string) => {
    try {
      await deleteAvailability(id);
      setMessage("Availability deleted.");
      const updated = await getMyAvailability(user.id);
      setAvailabilities(updated.data);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to delete availability.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user?.name || "Painter"}!
      </h2>

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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Availability
        </button>

        {message && (
          <p className="text-sm mt-2 text-red-600 font-medium">{message}</p>
        )}
      </form>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Assigned Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border shadow rounded-lg">
              <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.bookingId}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{b.client?.name || "Unknown"}</td>
                    <td className="px-4 py-2">
                      {dayjs(b.startTime).format("MMM D, h:mm A")}
                    </td>
                    <td className="px-4 py-2">
                      {dayjs(b.endTime).format("h:mm A")}
                    </td>
                    <td className="px-4 py-2 capitalize">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Your Availabilities</h3>
        {availabilities.length === 0 ? (
          <p className="text-gray-500">No availability defined.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border shadow rounded-lg">
              <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                </tr>
              </thead>
              <tbody>
                {availabilities.map((a: any) => (
                  <tr
                    key={a.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {dayjs(a.startTime).format("MMM D, h:mm A")}
                    </td>
                    <td className="px-4 py-2">
                      {dayjs(a.endTime).format("h:mm A")}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteAvailability(a.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
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
