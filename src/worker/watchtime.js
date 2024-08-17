let channels = [];

const requests = {
    watch: (request, sendResponse) => {
        const channel = request.data.channel.toLowerCase();
        if (channels.includes(channel)) return;
        channels.push(channel);
        getWatchtime(channel).then(sendResponse);
    },
    get: (request, sendResponse) => {
        const channel = request.data.channel.toLowerCase();
        getWatchtime(channel).then(sendResponse);
    },
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type.toLowerCase() !== 'watchtime') return;
    requests[request.id](request, sendResponse);
    return true;
});

setInterval(async () => {
    if (channels.length < 1) return;
    console.log(`Adding watchtime for: ${channels.join(', ')}.`);
    for (const channel of channels) await updateWatchtime(channel, 5);
    channels = [];
}, 5000);

const request = indexedDB.open('enhancer_watchtime');
let database;

request.onupgradeneeded = () => {
    console.log('Creating watchtime database...');
    const db = request.result;
    const store = db.createObjectStore('watchtime', { keyPath: 'username' });
    store.createIndex('by_username', 'username', { unique: true });
    store.createIndex('by_time', 'time');
};

request.onsuccess = () => {
    console.log('Loading watchtime database...');
    database = request.result;
};

async function getWatchtime(username) {
    if (!database) return;
    console.log('Getting watchtime for:', username);
    const tx = database.transaction('watchtime', 'readonly');
    const store = tx.objectStore('watchtime');
    const index = store.index('by_username');

    const request = index.get(username);
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve();
    });
}

async function updateWatchtime(username, time) {
    const now = Date.now();
    let watchtime = await getWatchtime(username);
    if (watchtime) {
        watchtime.time += time;
        watchtime.lastUpdate = now;
    } else watchtime = { username, time, firstUpdate: now, lastUpdate: now };
    const tx = database.transaction('watchtime', 'readwrite');
    const store = tx.objectStore('watchtime');
    store.put(watchtime);
}
