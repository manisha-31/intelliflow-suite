// Mock data for the entire application

export const kpiData = [
  { label: 'Total Revenue', value: '₹24.8M', change: '+12.5%', trend: 'up' as const, icon: 'revenue' },
  { label: 'Active Orders', value: '1,284', change: '+8.3%', trend: 'up' as const, icon: 'orders' },
  { label: 'Inventory Value', value: '₹8.2M', change: '-3.1%', trend: 'down' as const, icon: 'inventory' },
  { label: 'Production Rate', value: '94.2%', change: '+2.1%', trend: 'up' as const, icon: 'production' },
];

export const salesData = [
  { month: 'Sep', briefs: 4200, vests: 3100, thermals: 1200 },
  { month: 'Oct', briefs: 4800, vests: 3400, thermals: 2400 },
  { month: 'Nov', briefs: 4500, vests: 3800, thermals: 4100 },
  { month: 'Dec', briefs: 5200, vests: 4200, thermals: 5800 },
  { month: 'Jan', briefs: 4900, vests: 3900, thermals: 6200 },
  { month: 'Feb', briefs: 5100, vests: 3600, thermals: 3400 },
];

export const categoryDistribution = [
  { name: 'Briefs', value: 35, fill: 'hsl(217, 91%, 60%)' },
  { name: 'Vests', value: 28, fill: 'hsl(160, 84%, 39%)' },
  { name: 'Thermals', value: 22, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Socks', value: 15, fill: 'hsl(280, 65%, 60%)' },
];

export const orders = [
  { id: 'ORD-2024-001', customer: 'Metro Distributors', items: 5200, total: '₹4,68,000', status: 'confirmed', date: '2024-02-18', priority: 'high' },
  { id: 'ORD-2024-002', customer: 'City Retail Hub', items: 3100, total: '₹2,79,000', status: 'processing', date: '2024-02-17', priority: 'medium' },
  { id: 'ORD-2024-003', customer: 'Fashion Point', items: 1800, total: '₹1,62,000', status: 'shipped', date: '2024-02-16', priority: 'low' },
  { id: 'ORD-2024-004', customer: 'Garment Galaxy', items: 7500, total: '₹6,75,000', status: 'pending', date: '2024-02-15', priority: 'high' },
  { id: 'ORD-2024-005', customer: 'Comfort Wear Co', items: 2400, total: '₹2,16,000', status: 'delivered', date: '2024-02-14', priority: 'medium' },
  { id: 'ORD-2024-006', customer: 'National Traders', items: 4100, total: '₹3,69,000', status: 'confirmed', date: '2024-02-13', priority: 'medium' },
  { id: 'ORD-2024-007', customer: 'Premium Outlets', items: 6300, total: '₹5,67,000', status: 'processing', date: '2024-02-12', priority: 'high' },
  { id: 'ORD-2024-008', customer: 'Value Mart', items: 1500, total: '₹1,35,000', status: 'shipped', date: '2024-02-11', priority: 'low' },
];

export const inventory = [
  { sku: 'BRF-001', name: 'Classic Brief - White', category: 'Briefs', stock: 12400, reorderLevel: 5000, status: 'healthy', unitCost: '₹45' },
  { sku: 'BRF-002', name: 'Classic Brief - Black', category: 'Briefs', stock: 3200, reorderLevel: 5000, status: 'low', unitCost: '₹45' },
  { sku: 'VST-001', name: 'Cotton Vest - White', category: 'Vests', stock: 8900, reorderLevel: 4000, status: 'healthy', unitCost: '₹65' },
  { sku: 'VST-002', name: 'Ribbed Vest - Grey', category: 'Vests', stock: 1800, reorderLevel: 3000, status: 'critical', unitCost: '₹72' },
  { sku: 'THR-001', name: 'Thermal Top - Navy', category: 'Thermals', stock: 6500, reorderLevel: 3000, status: 'healthy', unitCost: '₹180' },
  { sku: 'THR-002', name: 'Thermal Bottom - Black', category: 'Thermals', stock: 4200, reorderLevel: 3000, status: 'healthy', unitCost: '₹175' },
  { sku: 'SCK-001', name: 'Ankle Socks (Pack of 3)', category: 'Socks', stock: 2100, reorderLevel: 4000, status: 'low', unitCost: '₹95' },
  { sku: 'BRF-003', name: 'Premium Brief - Navy', category: 'Briefs', stock: 950, reorderLevel: 2000, status: 'critical', unitCost: '₹85' },
];

export const designs = [
  { id: 'DSN-001', name: 'Summer Breeze Collection', designer: 'Priya Sharma', status: 'approved', category: 'Briefs', date: '2024-02-10' },
  { id: 'DSN-002', name: 'Arctic Shield Thermals', designer: 'Priya Sharma', status: 'in_review', category: 'Thermals', date: '2024-02-12' },
  { id: 'DSN-003', name: 'Urban Fit Vest Line', designer: 'Ravi Gupta', status: 'approved', category: 'Vests', date: '2024-02-08' },
  { id: 'DSN-004', name: 'Eco Comfort Range', designer: 'Priya Sharma', status: 'draft', category: 'Briefs', date: '2024-02-15' },
  { id: 'DSN-005', name: 'Sport Pro Socks', designer: 'Ravi Gupta', status: 'revision', category: 'Socks', date: '2024-02-14' },
  { id: 'DSN-006', name: 'Heritage Classic Line', designer: 'Priya Sharma', status: 'approved', category: 'Vests', date: '2024-02-06' },
];

export const production = [
  { batchId: 'BATCH-001', product: 'Classic Brief - White', qty: 10000, completed: 8500, status: 'in_progress', line: 'Line A', eta: '2024-02-20' },
  { batchId: 'BATCH-002', product: 'Cotton Vest - White', qty: 5000, completed: 5000, status: 'completed', line: 'Line B', eta: '2024-02-18' },
  { batchId: 'BATCH-003', product: 'Thermal Top - Navy', qty: 3000, completed: 1200, status: 'in_progress', line: 'Line C', eta: '2024-02-25' },
  { batchId: 'BATCH-004', product: 'Ankle Socks (Pack of 3)', qty: 8000, completed: 0, status: 'queued', line: 'Line A', eta: '2024-03-01' },
  { batchId: 'BATCH-005', product: 'Ribbed Vest - Grey', qty: 4000, completed: 3600, status: 'in_progress', line: 'Line B', eta: '2024-02-22' },
  { batchId: 'BATCH-006', product: 'Premium Brief - Navy', qty: 6000, completed: 6000, status: 'completed', line: 'Line C', eta: '2024-02-15' },
];

export const aiInsights = [
  { type: 'warning' as const, title: 'Stock-out Risk Alert', message: 'Ribbed Vest - Grey (VST-002) predicted to stock out in 8 days. Current velocity: 225 units/day.', confidence: 92 },
  { type: 'success' as const, title: 'Demand Surge Detected', message: 'Thermal category showing 34% growth trend. Recommend increasing production allocation by 20%.', confidence: 87 },
  { type: 'info' as const, title: 'Reorder Recommendation', message: 'AI suggests reordering 15,000 units of Classic Brief - Black based on 90-day moving average.', confidence: 85 },
  { type: 'warning' as const, title: 'Seasonal Pattern', message: 'Historical data indicates 40% demand increase for thermals starting March. Begin stock buildup now.', confidence: 91 },
];

export const demandForecast = [
  { month: 'Mar', actual: null, predicted: 5800, lower: 5200, upper: 6400 },
  { month: 'Apr', actual: null, predicted: 5400, lower: 4700, upper: 6100 },
  { month: 'May', actual: null, predicted: 4900, lower: 4100, upper: 5700 },
];

export const riskScores = [
  { product: 'Ribbed Vest - Grey', risk: 92, velocity: 225, daysLeft: 8, trend: 'increasing' },
  { product: 'Classic Brief - Black', risk: 78, velocity: 180, daysLeft: 18, trend: 'stable' },
  { product: 'Ankle Socks (Pack of 3)', risk: 71, velocity: 150, daysLeft: 14, trend: 'increasing' },
  { product: 'Premium Brief - Navy', risk: 85, velocity: 120, daysLeft: 8, trend: 'increasing' },
  { product: 'Thermal Top - Navy', risk: 25, velocity: 95, daysLeft: 68, trend: 'decreasing' },
];
