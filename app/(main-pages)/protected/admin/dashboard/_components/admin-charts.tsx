"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";

type ChartDataProps = {
  data: {
    created_at: string;
    type: "merit" | "demerit";
    is_serious_infraction: boolean | null;
    sanction_context: "office" | "rle" | null;
  }[];
};

export function AdminCharts({ data }: ChartDataProps) {
  const severityData = useMemo(() => {
    const seriousCount = data.filter((r) => r.is_serious_infraction).length;
    const minorCount = data.length - seriousCount;
    return [
      { name: "Minor Infractions", value: minorCount, color: "#f59e0b" }, // Amber
      { name: "Serious Infractions", value: seriousCount, color: "#dc2626" }, // Red
    ];
  }, [data]);

  const contextData = useMemo(() => {
    const officeCount = data.filter(
      (r) => r.sanction_context === "office"
    ).length;
    const rleCount = data.filter((r) => r.sanction_context === "rle").length;
    return [
      { name: "Academic / Office", count: officeCount, fill: "#3b82f6" }, // Blue
      { name: "RLE / Clinical", count: rleCount, fill: "#10b981" }, // Emerald
    ];
  }, [data]);

  const trendData = useMemo(() => {
    const grouped = data.reduce((acc, curr) => {
      const date = new Date(curr.created_at);
      const monthKey = date.toLocaleString("default", { month: "short" });

      if (!acc[monthKey]) acc[monthKey] = 0;
      acc[monthKey]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([month, count]) => ({
      month,
      count,
    }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle>Infraction Trends</CardTitle>
          <CardDescription>Volume of reports over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A58A3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0A58A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0A58A3"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Severity Ratio</CardTitle>
          <CardDescription>Minor vs. Serious Offenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Context Breakdown</CardTitle>
          <CardDescription>Where are incidents happening?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contextData}
                layout="vertical"
                margin={{ left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  fontSize={12}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                  {contextData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
