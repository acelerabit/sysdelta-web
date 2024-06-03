"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, useEffect } from "react";
import { fetchApi } from "@/services/fetchApi";
import { groupByDate } from "@/utils/group-by-date";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";

const data = [
  {
    revenue: 10400,
    subscription: 240,
  },
  {
    revenue: 14405,
    subscription: 300,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 189,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 278,
  },
  {
    revenue: 26475,
    subscription: 189,
  },
];

interface Metric {
  id: string;
  name: string;
  createdAt: Date;
}

interface Metrics {
  data: Metric[];
  total: number;
}

export default function CardsStats() {
  const [usersMetrics, setUsersMetrics] = useState<Metrics | null>(null);
  const [loadingUsersMetrics, setSetLoadingUsersMetrics] = useState(true);

  async function getUsersMetrics() {
    setSetLoadingUsersMetrics(true);
    const fetchSubsUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users/metrics`
    );

    const response = await fetchApi(
      `${fetchSubsUrl.pathname}${fetchSubsUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingUsersMetrics(false);
      return;
    }

    const data = await response.json();

    setUsersMetrics(data);
    setSetLoadingUsersMetrics(false);
  }

  useEffect(() => {
    getUsersMetrics();
  }, []);

  const groupedUserData = usersMetrics ? groupByDate(usersMetrics.data) : [];

  return (
    <main className="p-8 flex flex-col">
      <h1 className="text-4xl font-semibold">Dashboard</h1>

      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {loadingUsersMetrics || !usersMetrics ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{usersMetrics?.total}</div>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={groupedUserData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <Line
                      type="monotone"
                      strokeWidth={2}
                      dataKey="count"
                      activeDot={{
                        r: 6,
                        style: {
                          fill: "var(--theme-primary)",
                          opacity: 0.25,
                        },
                      }}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(tick) => dayjs(tick).format("DD/MM/YYYY")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        dayjs(label).format("DD/MM/YYYY")
                      }
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <Line
                    type="monotone"
                    strokeWidth={2}
                    dataKey="revenue"
                    activeDot={{
                      r: 6,
                      style: { fill: "var(--theme-primary)", opacity: 0.25 },
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="subscription"
                    fill="var(--theme-primary)"
                    opacity={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
