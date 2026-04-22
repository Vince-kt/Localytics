// Data Structure
let platformData = {
    tiktok: { views: 0, revenue: 0 },
    instagram: { views: 0, revenue: 0 },
    youtube: { views: 0, revenue: 0 }
};

let revenueChart, pieChart, rpmChart;

// Initialize
function init() {
    loadData();
    updateDashboard();
    initCharts();
    
    // Add event listeners for real-time updates
    document.getElementById('tiktok-views-input').addEventListener('input', () => updatePlatformData('tiktok'));
    document.getElementById('tiktok-revenue-input').addEventListener('input', () => updatePlatformData('tiktok'));
    document.getElementById('instagram-views-input').addEventListener('input', () => updatePlatformData('instagram'));
    document.getElementById('instagram-revenue-input').addEventListener('input', () => updatePlatformData('instagram'));
    document.getElementById('youtube-views-input').addEventListener('input', () => updatePlatformData('youtube'));
    document.getElementById('youtube-revenue-input').addEventListener('input', () => updatePlatformData('youtube'));
}

// Save to localStorage
function saveData() {
    localStorage.setItem('localyticsData', JSON.stringify(platformData));
}

// Load from localStorage
function loadData() {
    const saved = localStorage.getItem('localyticsData');
    if (saved) {
        platformData = JSON.parse(saved);
    }
    populateInputFields();
}

// Populate input fields with current data
function populateInputFields() {
    document.getElementById('tiktok-views-input').value = platformData.tiktok.views || 0;
    document.getElementById('tiktok-revenue-input').value = platformData.tiktok.revenue || 0;
    document.getElementById('instagram-views-input').value = platformData.instagram.views || 0;
    document.getElementById('instagram-revenue-input').value = platformData.instagram.revenue || 0;
    document.getElementById('youtube-views-input').value = platformData.youtube.views || 0;
    document.getElementById('youtube-revenue-input').value = platformData.youtube.revenue || 0;
}

// Update platform data
function updatePlatformData(platform) {
    const viewsInput = document.getElementById(`${platform}-views-input`);
    const revenueInput = document.getElementById(`${platform}-revenue-input`);

    platformData[platform].views = parseInt(viewsInput.value) || 0;
    platformData[platform].revenue = parseFloat(revenueInput.value) || 0;

    saveData();
    updateDashboard();
}

// Calculate RPM
function calculateRPM(revenue, views) {
    if (views === 0) return 0;
    return (revenue / views) * 1000;
}

// Update dashboard
function updateDashboard() {
    const totalRevenue = platformData.tiktok.revenue + platformData.instagram.revenue + platformData.youtube.revenue;
    const totalViews = platformData.tiktok.views + platformData.instagram.views + platformData.youtube.views;
    
    const tiktokRPM = calculateRPM(platformData.tiktok.revenue, platformData.tiktok.views);
    const instagramRPM = calculateRPM(platformData.instagram.revenue, platformData.instagram.views);
    const youtubeRPM = calculateRPM(platformData.youtube.revenue, platformData.youtube.views);
    
    const avgRPM = totalViews === 0 ? 0 : (totalRevenue / totalViews) * 1000;

    // Update KPIs
    document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
    document.getElementById('total-views').textContent = (totalViews / 1000).toFixed(1);
    document.getElementById('avg-rpm').textContent = avgRPM.toFixed(2);

    // Update platform stats
    document.getElementById('tiktok-revenue').textContent = platformData.tiktok.revenue.toFixed(2);
    document.getElementById('tiktok-views').textContent = platformData.tiktok.views;
    document.getElementById('tiktok-rpm').textContent = tiktokRPM.toFixed(2);

    document.getElementById('instagram-revenue').textContent = platformData.instagram.revenue.toFixed(2);
    document.getElementById('instagram-views').textContent = platformData.instagram.views;
    document.getElementById('instagram-rpm').textContent = instagramRPM.toFixed(2);

    document.getElementById('youtube-revenue').textContent = platformData.youtube.revenue.toFixed(2);
    document.getElementById('youtube-views').textContent = platformData.youtube.views;
    document.getElementById('youtube-rpm').textContent = youtubeRPM.toFixed(2);

    // Generate insights
    generateInsights(totalRevenue, totalViews, tiktokRPM, instagramRPM, youtubeRPM);

    // Update charts
    updateCharts();

    // Update ranking
    updateRanking(tiktokRPM, instagramRPM, youtubeRPM);
}

// Generate insights
function generateInsights(totalRevenue, totalViews, tiktokRPM, instagramRPM, youtubeRPM) {
    if (totalRevenue === 0) {
        document.getElementById('insights-text').innerHTML = "Start by adding revenue data for your platforms to see insights here.";
        return;
    }

    const revenues = {
        'TikTok': platformData.tiktok.revenue,
        'Instagram': platformData.instagram.revenue,
        'YouTube': platformData.youtube.revenue
    };

    const winner = Object.keys(revenues).reduce((a, b) => revenues[a] > revenues[b] ? a : b);
    const winnerRevenue = revenues[winner];
    const winnerRPM = winner === 'TikTok' ? tiktokRPM : (winner === 'Instagram' ? instagramRPM : youtubeRPM);

    const rpmWinner = tiktokRPM >= instagramRPM && tiktokRPM >= youtubeRPM ? 'TikTok' : 
                    (instagramRPM >= youtubeRPM ? 'Instagram' : 'YouTube');

    let insights = `<div class="mb-4">🏆 <strong>${winner}</strong> is your top revenue driver with <strong>$${winnerRevenue.toFixed(2)}</strong> in earnings! <span class="winner-badge">TOP EARNER</span></div>`;
    
    insights += `<div class="mb-4">💰 <strong>${rpmWinner}</strong> has the highest RPM at <strong>$${(rpmWinner === 'TikTok' ? tiktokRPM : (rpmWinner === 'Instagram' ? instagramRPM : youtubeRPM)).toFixed(2)}</strong> per 1,000 views.</div>`;
    
    insights += `<div class="mb-4">📊 Total Revenue: <strong>$${platformData.tiktok.revenue + platformData.instagram.revenue + platformData.youtube.revenue}</strong></div>`;
    
    insights += `<div>👥 Combined Impressions: <strong>${((platformData.tiktok.views + platformData.instagram.views + platformData.youtube.views) / 1000000).toFixed(2)}M</strong> views</div>`;

    document.getElementById('insights-text').innerHTML = insights;
}

// Update ranking
function updateRanking(tiktokRPM, instagramRPM, youtubeRPM) {
    const rankings = [
        { platform: 'TikTok', revenue: platformData.tiktok.revenue, rpm: tiktokRPM },
        { platform: 'Instagram', revenue: platformData.instagram.revenue, rpm: instagramRPM },
        { platform: 'YouTube', revenue: platformData.youtube.revenue, rpm: youtubeRPM }
    ].sort((a, b) => b.revenue - a.revenue);

    let html = '';
    rankings.forEach((item, index) => {
        const medal = index === 0 ? '🥇' : (index === 1 ? '🥈' : '🥉');
        html += `<div class="platform-stat mb-3">
            <div class="flex justify-between items-center">
                <div>
                    <div class="text-lg font-bold text-white">${medal} ${item.platform}</div>
                    <div class="stat-label">Revenue: $${item.revenue.toFixed(2)} | RPM: $${item.rpm.toFixed(2)}</div>
                </div>
            </div>
        </div>`;
    });

    document.getElementById('ranking-container').innerHTML = html;
}

// Initialize charts
function initCharts() {
    const ctx1 = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['TikTok', 'Instagram', 'YouTube'],
            datasets: [{
                label: 'Revenue ($)',
                data: [platformData.tiktok.revenue, platformData.instagram.revenue, platformData.youtube.revenue],
                backgroundColor: ['#3b82f6', '#ec4899', '#ef4444'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(71, 85, 105, 0.2)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });

    const ctx2 = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['TikTok', 'Instagram', 'YouTube'],
            datasets: [{
                data: [platformData.tiktok.revenue, platformData.instagram.revenue, platformData.youtube.revenue],
                backgroundColor: ['#3b82f6', '#ec4899', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });

    const ctx3 = document.getElementById('rpmChart').getContext('2d');
    const tiktokRPM = calculateRPM(platformData.tiktok.revenue, platformData.tiktok.views);
    const instagramRPM = calculateRPM(platformData.instagram.revenue, platformData.instagram.views);
    const youtubeRPM = calculateRPM(platformData.youtube.revenue, platformData.youtube.views);

    rpmChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['TikTok', 'Instagram', 'YouTube'],
            datasets: [{
                label: 'RPM ($)',
                data: [tiktokRPM, instagramRPM, youtubeRPM],
                backgroundColor: ['#10b981', '#f59e0b', '#06b6d4'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(71, 85, 105, 0.2)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Update charts
function updateCharts() {
    if (revenueChart) {
        revenueChart.data.datasets[0].data = [
            platformData.tiktok.revenue,
            platformData.instagram.revenue,
            platformData.youtube.revenue
        ];
        revenueChart.update();
    }

    if (pieChart) {
        pieChart.data.datasets[0].data = [
            platformData.tiktok.revenue,
            platformData.instagram.revenue,
            platformData.youtube.revenue
        ];
        pieChart.update();
    }

    if (rpmChart) {
        const tiktokRPM = calculateRPM(platformData.tiktok.revenue, platformData.tiktok.views);
        const instagramRPM = calculateRPM(platformData.instagram.revenue, platformData.instagram.views);
        const youtubeRPM = calculateRPM(platformData.youtube.revenue, platformData.youtube.views);

        rpmChart.data.datasets[0].data = [tiktokRPM, instagramRPM, youtubeRPM];
        rpmChart.update();
    }
}

// Load demo data
function loadDemoData() {
    platformData = {
        tiktok: { views: 850000, revenue: 2550 },
        instagram: { views: 450000, revenue: 1800 },
        youtube: { views: 1200000, revenue: 4800 }
    };
    saveData();
    populateInputFields();
    updateDashboard();
    alert('📊 Demo data loaded! Switch to Dashboard to see the analytics.');
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure? This will delete all saved data.')) {
        platformData = {
            tiktok: { views: 0, revenue: 0 },
            instagram: { views: 0, revenue: 0 },
            youtube: { views: 0, revenue: 0 }
        };
        saveData();
        populateInputFields();
        updateDashboard();
        alert('✓ All data cleared.');
    }
}

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');

    if (tab === 'analytics') {
        setTimeout(() => {
            if (revenueChart) revenueChart.resize();
            if (pieChart) pieChart.resize();
            if (rpmChart) rpmChart.resize();
        }, 100);
    }
}

// Start
window.addEventListener('DOMContentLoaded', init);
