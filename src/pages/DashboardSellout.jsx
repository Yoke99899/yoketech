// Final DashboardSellout.jsx with full features
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../GoogleAuthProvider";
import * as XLSX from "xlsx";
import Select from "react-select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, ComposedChart
} from "recharts";

const SHEET_ID = "1JNFMxWz-0A7QUKWOcNlxn_Yb4xlyNOlnBRnJd_Bz5qA";
const RANGE = "Sellout!A1:J";
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#22d3ee"];

export default function DashboardSellout() {
  const { accessToken, login } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ region: "", group: "", store: "", name: "", start: "", end: "" });
  const [stats, setStats] = useState({});
  const [options, setOptions] = useState({ region: [], group: [], store: [], name: [] });

  useEffect(() => {
    if (!accessToken) return;
    fetchData();
  }, [accessToken]);

  const fetchData = async () => {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?majorDimension=ROWS`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const json = await res.json();
    if (!json.values) return;

    const [headers, ...rows] = json.values;
    const parsed = rows.map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i] || "");
      if (obj.Date) obj.dateISO = formatDate(obj.Date);
      if (obj.Date) obj.date = new Date(obj.dateISO);
      return obj;
    });

    setData(parsed);
    setFiltered(parsed);
    setOptions({
      region: [...new Set(parsed.map(r => r.Region))],
      group: [...new Set(parsed.map(r => r.Group))],
      store: [...new Set(parsed.map(r => r.Store))],
      name: [...new Set(parsed.map(r => r.Name))]
    });
    computeStats(parsed);
  };

  const formatDate = (d) => {
    const parts = d.split("/");
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  };

  const computeStats = (rows) => {
    const totalTarget = rows.reduce((sum, r) => sum + parseFloat(r.Target || 0), 0);
    const totalActual = rows.reduce((sum, r) => sum + parseFloat(r.Actual || 0), 0);
    const avgAch = rows.reduce((sum, r) => sum + parseFloat(r.ach?.replace("%", "").replace(",", ".") || 0), 0) / rows.length;
    const mitra = new Set(rows.map(r => r.Name)).size;
    const store = new Set(rows.map(r => r.Store)).size;

    const perRegion = {}, trend = {}, groupDist = {}, perMonth = {}, perQuarter = {}, productivityMap = {};

    rows.forEach(r => {
      const actual = parseFloat(r.Actual || 0);
      const target = parseFloat(r.Target || 0);
      const month = r.date?.toLocaleString('default', { month: 'short' });
      const quarter = r.Quarterly;
      const name = r.Name;

      perRegion[r.Region] = (perRegion[r.Region] || 0) + actual;
      groupDist[r.Group] = (groupDist[r.Group] || 0) + actual;
      trend[r.Date] = (trend[r.Date] || 0) + actual;
      if (month) {
        if (!perMonth[month]) perMonth[month] = { actual: 0, target: 0 };
        perMonth[month].actual += actual;
        perMonth[month].target += target;
      }
      if (quarter) perQuarter[quarter] = (perQuarter[quarter] || 0) + actual;
      if (name) {
        if (!productivityMap[name]) productivityMap[name] = { actual: 0, count: 0 };
        productivityMap[name].actual += actual;
        productivityMap[name].count++;
      }
    });

    const productivity = Object.entries(productivityMap).map(([k, v]) => ({ name: k, value: v.actual / v.count }));

    setStats({
      totalTarget,
      totalActual,
      avgAch,
      mitra,
      store,
      perRegion: Object.entries(perRegion).map(([k, v]) => ({ name: k, value: v })),
      trend: Object.entries(trend).map(([k, v]) => ({ name: k, value: v })).sort((a, b) => new Date(a.name) - new Date(b.name)),
      groupDist: Object.entries(groupDist).map(([k, v]) => ({ name: k, value: v })),
      perMonth: Object.entries(perMonth).map(([k, v]) => ({ name: k, actual: v.actual, target: v.target })),
      perQuarter: Object.entries(perQuarter).map(([k, v]) => ({ name: k, value: v })),
      productivity
    });
  };

  const applyFilter = () => {
    const filtered = data.filter(row => {
      const matchRegion = filters.region ? row.Region === filters.region : true;
      const matchGroup = filters.group ? row.Group === filters.group : true;
      const matchStore = filters.store ? row.Store === filters.store : true;
      const matchName = filters.name ? row.Name === filters.name : true;
      const matchStart = filters.start ? row.dateISO >= filters.start : true;
      const matchEnd = filters.end ? row.dateISO <= filters.end : true;
      return matchRegion && matchGroup && matchStore && matchName && matchStart && matchEnd;
    });
    setFiltered(filtered);
    computeStats(filtered);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sellout");
    XLSX.writeFile(wb, "Sellout_Export.xlsx");
  };

  if (!accessToken) return <div className="p-10 text-center"><button onClick={login} className="px-6 py-3 bg-blue-600 text-white rounded">Login dengan Google</button></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard Sellout</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Select options={options.region.map(r => ({ value: r, label: r }))} onChange={v => setFilters(f => ({ ...f, region: v?.value || "" }))} placeholder="Region" />
        <Select options={options.group.map(r => ({ value: r, label: r }))} onChange={v => setFilters(f => ({ ...f, group: v?.value || "" }))} placeholder="Group" />
        <Select options={options.store.map(r => ({ value: r, label: r }))} onChange={v => setFilters(f => ({ ...f, store: v?.value || "" }))} placeholder="Store" />
        <Select options={options.name.map(r => ({ value: r, label: r }))} onChange={v => setFilters(f => ({ ...f, name: v?.value || "" }))} placeholder="Name" />
        <input type="date" className="border p-2 rounded" onChange={e => setFilters(f => ({ ...f, start: e.target.value }))} />
        <input type="date" className="border p-2 rounded" onChange={e => setFilters(f => ({ ...f, end: e.target.value }))} />
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={applyFilter} className="px-4 py-2 bg-blue-600 text-white rounded">Terapkan Filter</button>
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded">Export Excel</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard label="🎯 Total Target" value={stats.totalTarget?.toLocaleString()} />
        <SummaryCard label="✅ Total Actual" value={stats.totalActual?.toLocaleString()} />
        <SummaryCard label="📊 Rata-rata Ach" value={stats.avgAch?.toFixed(2) + "%"} />
        <SummaryCard label="👤 Mitra Unik" value={stats.mitra} />
        <SummaryCard label="🏬 Store Unik" value={stats.store} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphCard title="Actual per Region">
          <BarChart data={stats.perRegion}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#6366f1" /></BarChart>
        </GraphCard>
        <GraphCard title="Tren Actual Harian">
          <LineChart data={stats.trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3b82f6" /></LineChart>
        </GraphCard>
        <GraphCard title="Distribusi Group">
          <PieChart><Pie data={stats.groupDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>{stats.groupDist?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
        </GraphCard>
        <GraphCard title="Agregasi Bulanan">
          <ComposedChart data={stats.perMonth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="actual" fill="#10b981" name="Actual" /><Line type="monotone" dataKey="target" stroke="#f97316" name="Target" strokeWidth={2} /></ComposedChart>
        </GraphCard>
        <GraphCard title="Tren per Quartal">
          <BarChart data={stats.perQuarter}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#f59e0b" /></BarChart>
        </GraphCard>
        <GraphCard title="Produktivitas per Mitra">
          <BarChart data={stats.productivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#ef4444" /></BarChart>
        </GraphCard>
      </div>
    </div>
  );
}

const SummaryCard = ({ label, value }) => (
  <div className="bg-white border rounded shadow p-4 text-center">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
);

const GraphCard = ({ title, children }) => (
  <div className="bg-white border rounded shadow p-4 h-[300px]">
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
  </div>
);
