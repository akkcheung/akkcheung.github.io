export function getUsers() {
    const results = JSON.parse(localStorage.getItem('cognitive-training-results')) || {};
    return Object.keys(results);
}

export function getCurrentUser() {
    return localStorage.getItem('cognitive-training-user');
}

export function setCurrentUser(userName) {
    localStorage.setItem('cognitive-training-user', userName);
}

export function addUser(userName) {
    const results = JSON.parse(localStorage.getItem('cognitive-training-results')) || {};
    if (!results[userName]) {
        results[userName] = {};
        localStorage.setItem('cognitive-training-results', JSON.stringify(results));
    }
}

export function saveGameResult(game, score, time) {
    const userName = getCurrentUser();
    if (!userName) return;

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }); // YYYY-MM-DD in Ontario time
    const results = JSON.parse(localStorage.getItem('cognitive-training-results')) || {};

    if (!results[userName]) {
        results[userName] = {};
    }
    if (!results[userName][today]) {
        results[userName][today] = {};
    }
    if (!results[userName][today][game]) {
        results[userName][today][game] = [];
    }

    results[userName][today][game].push({ score, time });
    localStorage.setItem('cognitive-training-results', JSON.stringify(results));
}
