/**
 * Save user info to string
 * @param data {{username: string, guid: string}}
 */
export const save = (data) => {
    window.localStorage.setItem('chatData', JSON.stringify({
        username: data.username,
        guid: data.guid
    }));
};

export const load = () => {
    const chatData = window.localStorage.getItem('chatData');
    if (!chatData) return;
    // Parsing data
    try {
        const data = JSON.parse(chatData);
        if (typeof data.username === 'string' && typeof data.guid === 'string') {
            return {
                username: data.username,
                guid: data.guid
            };
        }
    } catch (ex) {
        console.log(ex);
        // If we get parsing error - remove this `thing` from storage
        window.localStorage.removeItem('chatData');
    }
    return null;
};

export const remove = () => {
    window.localStorage.removeItem('chatData');
};
