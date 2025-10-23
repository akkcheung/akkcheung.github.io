import { getCurrentUser } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const userName = getCurrentUser();
    if (!userName) {
        alert('Please select a user first.');
        return;
    }

    const results = JSON.parse(localStorage.getItem('cognitive-training-results')) || {};
    const userData = results[userName] || {};

    const chartsMainContainer = document.getElementById('charts-main-container');

    const controls = document.createElement('div');
    controls.classList.add('chart-controls');

    const dailyBtn = document.createElement('button');
    dailyBtn.id = 'daily-btn';
    dailyBtn.textContent = 'Daily';
    dailyBtn.classList.add('active');

    const weeklyBtn = document.createElement('button');
    weeklyBtn.id = 'weekly-btn';
    weeklyBtn.textContent = 'Weekly';

    controls.appendChild(dailyBtn);
    controls.appendChild(weeklyBtn);
    chartsMainContainer.insertBefore(controls, chartsMainContainer.firstChild);

    createRadarCharts(userData, 'daily');

    dailyBtn.addEventListener('click', () => {
        dailyBtn.classList.add('active');
        weeklyBtn.classList.remove('active');
        createRadarCharts(userData, 'daily');
    });

    weeklyBtn.addEventListener('click', () => {
        weeklyBtn.classList.add('active');
        dailyBtn.classList.remove('active');
        createRadarCharts(userData, 'weekly');
    });
});

function createRadarCharts(userData, period) {
    const radarChartsContainer = document.getElementById('radar-charts-container');
    radarChartsContainer.innerHTML = '';

    const dates = Object.keys(userData).sort((a, b) => new Date(a) - new Date(b));
    const seriesData = {};

    dates.forEach(date => {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(Date.UTC(year, month - 1, day));
        
        let key;
        if (period === 'daily') {
            key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        } else { // weekly
            const weekStart = new Date(d.setDate(d.getUTCDate() - d.getUTCDay()));
            key = `${weekStart.getUTCFullYear()}-${String(weekStart.getUTCMonth() + 1).padStart(2, '0')}-${String(weekStart.getUTCDate()).padStart(2, '0')}`;
        }

        if (!seriesData[key]) {
            seriesData[key] = {
                memory: [],
                reaction: [],
                stroop: [],
                'trail-making': [],
                'mirror-game': []
            };
        }

        if (userData[date].memory) {
            userData[date].memory.forEach(m => seriesData[key].memory.push(m.score));
        }
        if (userData[date].reaction) {
            userData[date].reaction.forEach(r => seriesData[key].reaction.push(r.time));
        }
        if (userData[date].stroop) {
            userData[date].stroop.forEach(s => seriesData[key].stroop.push(s.score));
        }
        if (userData[date]['trail-making']) {
            userData[date]['trail-making'].forEach(t => seriesData[key]['trail-making'].push(t.time));
        }
        if (userData[date]['mirror-game']) {
            userData[date]['mirror-game'].forEach(mg => seriesData[key]['mirror-game'].push(mg.score));
        }
    });

    const last5Keys = Object.keys(seriesData).slice(-5);

    last5Keys.forEach((key, index) => {
        const chartContainer = document.createElement('div');
        chartContainer.id = `radar-chart-${index}`;
        chartContainer.classList.add('chart-container');
        radarChartsContainer.appendChild(chartContainer);

        const avgMemory = seriesData[key].memory.length > 0 ? seriesData[key].memory.reduce((a, b) => a + b, 0) / seriesData[key].memory.length : null;
        const avgReaction = seriesData[key].reaction.length > 0 ? seriesData[key].reaction.reduce((a, b) => a + b, 0) / seriesData[key].reaction.length : null;
        const avgStroop = seriesData[key].stroop.length > 0 ? seriesData[key].stroop.reduce((a, b) => a + b, 0) / seriesData[key].stroop.length : null;
        const avgTrailMaking = seriesData[key]['trail-making'].length > 0 ? seriesData[key]['trail-making'].reduce((a, b) => a + b, 0) / seriesData[key]['trail-making'].length : null;
        const avgMirrorGame = seriesData[key]['mirror-game'].length > 0 ? seriesData[key]['mirror-game'].reduce((a, b) => a + b, 0) / seriesData[key]['mirror-game'].length : null;

        const normalizedScores = {
            memory: avgMemory !== null ? Math.max(0, 100 - (avgMemory / 50 * 100)) : 0,
            reaction: avgReaction !== null ? Math.max(0, 100 - ((Math.max(0, avgReaction - 150)) / (1000 - 150) * 100)) : 0,
            stroop: avgStroop !== null ? (avgStroop / 30 * 100) : 0,
            trailMaking: avgTrailMaking !== null ? Math.max(0, 100 - (avgTrailMaking / 60 * 100)) : 0,
            mirrorGame: avgMirrorGame !== null ? (avgMirrorGame / 30 * 100) : 0
        };

        Highcharts.chart(chartContainer.id, {
            chart: {
                polar: true,
                type: 'line'
            },
            title: {
                text: key
            },
            xAxis: {
                categories: ['Memory', 'Reaction', 'Stroop', 'Trail Making', 'Mirror Game'],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0,
                max: 100,
                labels: {
                    format: '{value}%'
                }
            },
            series: [{
                name: 'Performance',
                data: [normalizedScores.memory, normalizedScores.reaction, normalizedScores.stroop, normalizedScores.trailMaking, normalizedScores.mirrorGame],
                pointPlacement: 'on'
            }]
        });
    });
}


