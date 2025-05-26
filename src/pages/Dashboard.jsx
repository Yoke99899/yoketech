// Dashboard.jsx — dengan styling modern dan estetika bersih
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

const Dashboard = () => {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', nama: '', area: '', sku: '' });
  const [options, setOptions] = useState({ namaList: [], areaList: [], skuList: [] });
  const [stats, setStats] = useState({
    totalQty: 0, totalValue: 0, totalNamaUnik: 0,
    perDate: [], perSKU: [], perArea: [], perBulan: [], perMinggu: [],
    topNama: [], pelangganBaruArray: [], pelangganGrowthArray: []
  });

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3000/api/data2');
      const rows = res.data.values || [];
      const body = rows.slice(1);

      let totalQty = 0, totalValue = 0;
      const summaryPerDate = {}, summarySKU = {}, summaryArea = {}, summaryBulan = {}, summaryMinggu = {}, summaryNama = {};
      const namaSet = new Set(), pelangganBaruPerBulan = {}, pelangganSetPerBulan = {};
      const namaListSet = new Set(), areaListSet = new Set(), skuListSet = new Set();

      body.forEach(row => {
        const area = row[1], nama = row[2], sku = row[3];
        const qty = parseInt(row[6] || 0), val = parseInt(row[7] || 0), tgl = row[9];
        if (!tgl || isNaN(qty) || isNaN(val)) return;
        namaListSet.add(nama); areaListSet.add(area); skuListSet.add(sku);
        if (filters.startDate && tgl < filters.startDate) return;
        if (filters.endDate && tgl > filters.endDate) return;
        if (filters.nama && filters.nama !== 'All' && nama !== filters.nama) return;
        if (filters.area && filters.area !== 'All' && area !== filters.area) return;
        if (filters.sku && filters.sku !== 'All' && sku !== filters.sku) return;
        if (!summaryPerDate[tgl]) summaryPerDate[tgl] = { qty: 0, value: 0 };
        summaryPerDate[tgl].qty += qty; summaryPerDate[tgl].value += val;
        if (!summarySKU[sku]) summarySKU[sku] = 0;
        summarySKU[sku] += qty;
        if (!summaryArea[area]) summaryArea[area] = 0;
        summaryArea[area] += qty;
        const bulan = tgl.slice(0, 7);
        if (!summaryBulan[bulan]) summaryBulan[bulan] = { qty: 0, value: 0 };
        summaryBulan[bulan].qty += qty; summaryBulan[bulan].value += val;
        const minggu = `${tgl.slice(0, 4)}-W${Math.ceil(parseInt(tgl.slice(8, 10)) / 7)}`;
        if (!summaryMinggu[minggu]) summaryMinggu[minggu] = { qty: 0, value: 0 };
        summaryMinggu[minggu].qty += qty; summaryMinggu[minggu].value += val;
        if (!summaryNama[nama]) summaryNama[nama] = 0;
        summaryNama[nama] += val;
        if (!pelangganBaruPerBulan[bulan]) pelangganBaruPerBulan[bulan] = new Set();
        if (!pelangganSetPerBulan[bulan]) pelangganSetPerBulan[bulan] = new Set();
        if (!namaSet.has(nama)) pelangganBaruPerBulan[bulan].add(nama);
        namaSet.add(nama);
        pelangganSetPerBulan[bulan].add(nama);
        totalQty += qty; totalValue += val;
      });

      const perDate = Object.entries(summaryPerDate).sort().map(([tgl, data]) => ({ tanggal: tgl, qty: data.qty, value: data.value }));
      const perSKU = Object.entries(summarySKU).map(([sku, qty]) => ({ name: sku, value: qty }));
      const perArea = Object.entries(summaryArea).map(([area, qty]) => ({ name: area, value: qty }));
      const perBulan = Object.entries(summaryBulan).sort().map(([bulan, data]) => ({ bulan, qty: data.qty, value: data.value }));
      const perMinggu = Object.entries(summaryMinggu).sort().map(([minggu, data]) => ({ minggu, qty: data.qty, value: data.value }));
      const topNama = Object.entries(summaryNama).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nama, value]) => ({ name: nama, value }));
      const pelangganBaruArray = Object.entries(pelangganBaruPerBulan).sort().map(([bulan, set]) => ({ bulan, pelangganBaru: set.size }));
      const pelangganGrowthArray = Object.entries(pelangganSetPerBulan).sort().map(([bulan, set]) => ({ bulan, totalPelanggan: set.size }));

      setOptions({
        namaList: ['All', ...Array.from(namaListSet).filter(Boolean)],
        areaList: ['All', ...Array.from(areaListSet).filter(Boolean)],
        skuList: ['All', ...Array.from(skuListSet).filter(Boolean)],
      });

      setStats({
        totalQty, totalValue, totalNamaUnik: namaSet.size,
        perDate, perSKU, perArea, perBulan, perMinggu,
        topNama, pelangganBaruArray, pelangganGrowthArray
      });
    }
    fetchData();
  }, [filters]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800">📊 Dashboard Statistik Penjualan</h2>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">🎯 Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['startDate', 'endDate'].map((key, idx) => (
            <div key={idx}>
              <label className="text-sm font-medium text-gray-600">{key === 'startDate' ? 'Tanggal Mulai' : 'Tanggal Akhir'}</label>
              <input type="date" value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          ))}
          {['nama', 'area', 'sku'].map((key, idx) => (
            <div key={idx}>
              <label className="text-sm font-medium text-gray-600 capitalize">{key}</label>
              <select value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                {options[`${key}List`].map((item, i) => <option key={i} value={item}>{item}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Qty" value={stats.totalQty.toLocaleString()} color="text-blue-600" />
        <SummaryCard label="Total Value" value={`Rp ${stats.totalValue.toLocaleString()}`} color="text-green-600" />
        <SummaryCard label="Total Pelanggan" value={stats.totalNamaUnik.toLocaleString()} color="text-purple-600" />
      </div>

      {/* Semua Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphCard title="📅 Penjualan Harian">
          <BarChart data={stats.perDate}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tanggal" /><YAxis /><Tooltip /><Legend /><Bar dataKey="qty" fill="#3b82f6" /><Bar dataKey="value" fill="#10b981" /></BarChart>
        </GraphCard>
        <GraphCard title="📈 Tren Bulanan">
          <LineChart data={stats.perBulan}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="bulan" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="qty" stroke="#6366f1" /><Line type="monotone" dataKey="value" stroke="#16a34a" /></LineChart>
        </GraphCard>
        <GraphCard title="🌍 Distribusi Area">
          <PieChart><Pie data={stats.perArea} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{stats.perArea.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
        </GraphCard>
        <GraphCard title="🏅 Top 5 Pelanggan">
          <BarChart data={stats.topNama} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" /></BarChart>
        </GraphCard>
        <GraphCard title="🆕 Pelanggan Baru">
          <BarChart data={stats.pelangganBaruArray}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="bulan" /><YAxis /><Tooltip /><Bar dataKey="pelangganBaru" fill="#ec4899" /></BarChart>
        </GraphCard>
        <GraphCard title="📈 Pertumbuhan Pelanggan">
          <LineChart data={stats.pelangganGrowthArray}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="bulan" /><YAxis /><Tooltip /><Line type="monotone" dataKey="totalPelanggan" stroke="#f97316" /></LineChart>
        </GraphCard>
        <GraphCard title="📦 SKU Terjual">
          <BarChart data={stats.perSKU}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#f59e0b" /></BarChart>
        </GraphCard>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl border shadow-md p-4">
    <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const GraphCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md border h-[300px]">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
  </div>
);

export default Dashboard;