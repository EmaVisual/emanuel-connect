import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, MousePointerClick, TrendingUp } from "lucide-react";

interface AnalyticsCardProps {
  userId: string;
}

export const AnalyticsCard = ({ userId }: AnalyticsCardProps) => {
  const [totalViews, setTotalViews] = useState(0);
  const [viewsLast7Days, setViewsLast7Days] = useState(0);
  const [viewsLast30Days, setViewsLast30Days] = useState(0);
  const [viewsOverTime, setViewsOverTime] = useState<Array<{ date: string; views: number }>>([]);
  const [topLinks, setTopLinks] = useState<Array<{ title: string; clicks: number }>>([]);
  const [topReferrers, setTopReferrers] = useState<Array<{ referrer: string; count: number }>>([]);

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    // Total views
    const { count: total } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    setTotalViews(total || 0);

    // Views last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: last7 } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("viewed_at", sevenDaysAgo.toISOString());
    setViewsLast7Days(last7 || 0);

    // Views last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: last30 } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("viewed_at", thirtyDaysAgo.toISOString());
    setViewsLast30Days(last30 || 0);

    // Views over time (last 30 days)
    const { data: viewsData } = await supabase
      .from("profile_views")
      .select("viewed_at")
      .eq("user_id", userId)
      .gte("viewed_at", thirtyDaysAgo.toISOString())
      .order("viewed_at", { ascending: true });

    if (viewsData) {
      const groupedByDay = viewsData.reduce((acc: any, view) => {
        const date = new Date(view.viewed_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(groupedByDay).map(([date, views]) => ({
        date,
        views: views as number,
      }));
      setViewsOverTime(chartData);
    }

    // Top 5 clicked links
    const { data: clicksData } = await supabase
      .from("link_clicks")
      .select("link_title")
      .eq("user_id", userId);

    if (clicksData) {
      const groupedByLink = clicksData.reduce((acc: any, click) => {
        acc[click.link_title] = (acc[click.link_title] || 0) + 1;
        return acc;
      }, {});

      const topLinksData = Object.entries(groupedByLink)
        .map(([title, clicks]) => ({ title, clicks: clicks as number }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);
      setTopLinks(topLinksData);
    }

    // Top referrers
    const { data: referrersData } = await supabase
      .from("profile_views")
      .select("referrer")
      .eq("user_id", userId)
      .not("referrer", "is", null);

    if (referrersData) {
      const groupedByReferrer = referrersData.reduce((acc: any, view) => {
        const ref = view.referrer || "Directo";
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
      }, {});

      const topReferrersData = Object.entries(groupedByReferrer)
        .map(([referrer, count]) => ({ referrer, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopReferrers(topReferrersData);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vistas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 7 días</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewsLast7Days}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 30 días</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewsLast30Days}</div>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vistas del Perfil (Últimos 30 días)</CardTitle>
          <CardDescription>Número de visitas por día</CardDescription>
        </CardHeader>
        <CardContent>
          {viewsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No hay datos de vistas aún</p>
          )}
        </CardContent>
      </Card>

      {/* Top Links Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Enlaces Más Populares</CardTitle>
          <CardDescription>Top 5 enlaces con más clics</CardDescription>
        </CardHeader>
        <CardContent>
          {topLinks.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={topLinks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="title" type="category" width={100} tick={{ fontSize: 12 }} className="sm:w-[150px]" />
                <Tooltip />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No hay clics registrados aún</p>
          )}
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Principales Referencias</CardTitle>
          <CardDescription>De dónde vienen tus visitantes</CardDescription>
        </CardHeader>
        <CardContent>
          {topReferrers.length > 0 ? (
            <div className="space-y-2">
              {topReferrers.map((ref, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium truncate flex-1">{ref.referrer}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{ref.count} visitas</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No hay datos de referencias aún</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
