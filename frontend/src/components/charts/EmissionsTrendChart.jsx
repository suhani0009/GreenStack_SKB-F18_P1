import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function EmissionsTrendChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d5dfd9" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="emissions" stroke="#114232" strokeWidth={3} dot={{ fill: "#D8FF7E" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EmissionsTrendChart;
