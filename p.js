function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateUUIDs(count) {
    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUIDv4());
    }
    return uuids;
}

const uuidArray = generateUUIDs(10000);