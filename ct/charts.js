import { getCurrentUser } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const dailyBtn = document.getElementById('daily-btn');
    const weeklyBtn = document.getElementById('weekly-btn');

    const userName = getCurrentUser();
    if (!userName) {
        alert('Please select a user first.');
        return;
    }

    const results = JSON.parse(localStorage.getItem('cognitive-training-results')) || {};
    const userData = results[userName] || {};

    dailyBtn.classList.add('active');
    createRadarChart(userData, 'daily');

    dailyBtn.addEventListener('click', () => {
        dailyBtn.classList.add('active');
        weeklyBtn.classList.remove('active');
        createRadarChart(userData, 'daily');
    });

    weeklyBtn.addEventListener('click', () => {
        weeklyBtn.classList.add('active');
        dailyBtn.classList.remove('active');
        createRadarChart(userData, 'weekly');
    });
});

function createRadarChart(userData, period) {
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

    const series = Object.keys(seriesData).slice(-5).map(key => {
        const avgMemory = seriesData[key].memory.length > 0 ? seriesData[key].memory.reduce((a, b) => a + b, 0) / seriesData[key].memory.length : null;
        const avgReaction = seriesData[key].reaction.length > 0 ? seriesData[key].reaction.reduce((a, b) => a + b, 0) / seriesData[key].reaction.length : null;
        const avgStroop = seriesData[key].stroop.length > 0 ? seriesData[key].stroop.reduce((a, b) => a + b, 0) / seriesData[key].stroop.length : null;
        const avgTrailMaking = seriesData[key]['trail-making'].length > 0 ? seriesData[key]['trail-making'].reduce((a, b) => a + b, 0) / seriesData[key]['trail-making'].length : null;
        const avgMirrorGame = seriesData[key]['mirror-game'].length > 0 ? seriesData[key]['mirror-game'].reduce((a, b) => a + b, 0) / seriesData[key]['mirror-game'].length : null;

        const normalizedScores = {
            memory: avgMemory !== null ? Math.max(0, 100 - (avgMemory / 50 * 100)) : 0,
            reaction: avgReaction !== null ? Math.max(0, 100 - ((Math.max(0, avgReaction - 150)) / (1000 - 150) * 100)) : 0,
            stroop: avgStroop !== null ? (avgStroop / 30 * 100) : 0,
            trailMaking: avgTrailMaking !== null ? Math.max(0, 100 - (avgTrailMaking / 60 * 100)) : 0, // Assuming 60 seconds is a bad time
            mirrorGame: avgMirrorGame !== null ? (avgMirrorGame / 30 * 100) : 0 // Assuming 30 is a good score
        };

        return {
            name: key,
            data: [normalizedScores.memory, normalizedScores.reaction, normalizedScores.stroop, normalizedScores.trailMaking, normalizedScores.mirrorGame],
            pointPlacement: 'on'
        };
    });

    Highcharts.chart('radar-chart', {
        chart: {
            polar: true,
            type: 'line'
        },
        title: {
            text: 'Overall Performance'
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
        series: series
    });
}


