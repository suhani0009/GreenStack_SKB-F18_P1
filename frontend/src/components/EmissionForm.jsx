import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
  activity_type: z.string().min(1, "Activity type is required"),
  value: z.number().min(0, "Value must be positive")
});

export default function EmissionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const submit = async data => {
    try {
      await axios.post("http://localhost:5000/emissions", data);
      // Send notification
      await axios.post("http://localhost:5000/api/notifications", {
        message: `New emission data added: ${data.activity_type} - ${data.value} tons CO2e`
      });
      alert("Emission data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Emission Data</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type
          </label>
          <select
            {...register("activity_type")}
            id="activity_type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select activity type</option>
            <option value="electricity">Electricity</option>
            <option value="fuel">Fuel</option>
            <option value="waste">Waste</option>
          </select>
          {errors.activity_type && (
            <p className="mt-1 text-sm text-red-600">{errors.activity_type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Value (tons CO2e)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("value", { valueAsNumber: true })}
            id="value"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter emission value"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Emission Data"}
        </button>
      </form>
    </div>
  );
}