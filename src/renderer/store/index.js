import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router'
import moment from 'moment'
Vue.use(Vuex);

function playAudio() {
    let audio = new Audio("static/message.mp3");
    audio.play();
}
function getChatName(chat) {
    let chatName = chat.name;
    if (chat.userList) {
        if (chat.userList.length < 3) {
            chat.userList.forEach((user) => {
                if (user.id !== Store.state.currentUser.id) chatName = user.legalName
            })
        }
    }

    return chatName;
}
function onClose(evt) {
    Message({ message: 'socket 中断, 需要重新连接', type: 'warning' });
    Store.commit('logout');
}
function onMessage(evt) {
    let data = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data;
    if (data.hasOwnProperty('uuid') && UUIDList.indexOf(data.uuid) >= 0) return;
    console.log(data.type);
    if (data.type === 'system') {
        if (data.content.type === 'newChat') Store.commit('addChat', data.content);
    }
    if (data.type === 'chat') {
        playAudio();
        let chatName = getChatName(data.content.chat);
        if (['text', 'file'].indexOf(data.content.type) >= 0) {
            let myNotification = new Notification(chatName, {
                body: data.content.sender.legalName + ": " + data.content.content
            });
        }
        if (data.content.type === 'newUser') {
            Store.commit('addUserToChat', { chatId: data.content.chat.id, user: data.content.sender });
        }
        if (data.content.type === 'removeUser') {
            Store.commit('removeUserFromChat', { chatId: data.content.chat.id, user: data.content.sender });
        }
        Store.commit('addMessageToChat', { message: data.content, chatId: data.content.chat.id });
        if (data.content.type === 'chatNameChanged') Store.commit('changeChatName', data.content.chat);
    }

}
function onError(evt) {
    console.info('error', evt);

}

let UUIDList = [];

const state = {
    ipAddress: localStorage.getItem('ipAddress') ? localStorage.getItem('ipAddress') : '172.20.10.8',
    currentUser: null,
    activePanelIndex: 0,
    contactList: [],
    chatList: [],
    websocket: null,
    activeChatId: null,
    version: '1.0.1',
};

const getters = {
    chatList(state) {
        let chatList = JSON.parse(JSON.stringify(state.chatList));
        chatList.sort((a, b) => {
            a.sortTime = a.messageList.length === 0 ? a.updatedTime : a.messageList[a.messageList.length - 1].builtTime;
            b.sortTime = b.messageList.length === 0 ? b.updatedTime : b.messageList[b.messageList.length - 1].builtTime;

            return -moment(a.sortTime).diff(moment(b.sortTime))
        });
        return chatList;
    },
    activeChat(state) {
        if (!state.activeChatId) return null;
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === state.activeChatId) return state.chatList[i]
        }
    },
    unreadMessageCount(state) {
        let count = 0;
        state.chatList.forEach(chat => {
            count += chat.unread;
        });
        return count;
    }
};

const mutations = {
    setCurrentUser(state, user) {
        state.currentUser = user;
    },
    setActivePanelIndex(state, index) {
        state.activePanelIndex = index;
    },
    setContactList(state, contactList) {
        state.contactList = contactList;
    },
    setChatList(state, chatList) {
        state.chatList = chatList.map(chat => {
            chat.name = getChatName(chat);
            chat.unread = chat.offlineChatMessage ? chat.offlineChatMessage.count : 0;
            return chat;
        });
    },
    logout(state) {
        state.websocket.close();
        state.currentUser = null;

        router.push({ name: 'login' });
    },
    initWebSocket(state, wsUrl) {
        state.websocket = new WebSocket(wsUrl);
        state.websocket.onopen = function () {
            console.info('websocket', 'connected!');
        };
        state.websocket.onclose = function (evt) {
            onClose(evt)
        };
        state.websocket.onmessage = function (evt) {
            onMessage(evt);


        };
        state.websocket.onerror = function (evt) {
            onError(evt)
        };
    },
    setActiveChat(state, chat) {
        state.activeChatId = chat.id;
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === state.activeChatId) {
                state.chatList[i].unread = 0;
            }
        }
    },
    addMessageToChat(state, { message, chatId }) {
        chatId = Number(chatId);
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chatId) {
                state.chatList[i].messageList.push(message);
                if (chatId !== state.activeChatId) state.chatList[i].unread++;
                state.chatList[i].updatedTime = moment().format('YYYY-MM-DD hh:mm:ss');
            }
        }
    },
    addUserToChat(state, { user, chatId }) {
        chatId = Number(chatId);
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chatId) {
                state.chatList[i].userList.push(user);
            }
        }
    },
    removeUserFromChat(state, { user, chatId }) {
        chatId = Number(chatId);
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chatId) {
                for (let j = 0; j < state.chatList[i].userList.length; j++) {
                    if (state.chatList[i].userList[j].id === user.id) {
                        state.chatList[i].userList.splice(j, 1);
                    }
                }
            }
        }
    },
    changeChatName(state, chat) {
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chat.id) {
                state.chatList[i].name = chat.name;
            }
        }
    },
    updateMessageFromChat(state, { message, chatId, uuid }) {
        chatId = Number(chatId);

        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chatId) {
                let index = -1;
                for (let j = 0; j < state.chatList[i].messageList.length; j++) {
                    if (state.chatList[i].messageList[j].uuid === uuid) {
                        index = j;
                        break;
                    }
                }
                if (index >= 0) {
                    state.chatList[i].messageList.splice(index, 1, message);
                }
            }
        }
    },
    updateFileMessageStatus(state, { status, chatId, uuid }) {
        chatId = Number(chatId);
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chatId) {
                let index = -1;
                for (let j = 0; j < state.chatList[i].messageList.length; j++) {
                    if (state.chatList[i].messageList[j].uuid === uuid) {
                        index = j;
                        break;
                    }
                }
                if (index >= 0) {
                    state.chatList[i].messageList[index].progress = status.progress;
                    state.chatList[i].messageList[index].isSending = status.isSending;
                    state.chatList[i].messageList[index].isError = status.isError;
                }
            }
        }
    },
    addChat(state, chat) {
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chat.id) return
        }
        chat.name = getChatName(chat);
        chat.unread = chat.offlineChatMessage ? chat.offlineChatMessage.count : 0;
        state.chatList.push(chat);
    },
    removeChat(state, chat) {
        for (let i = 0; i < state.chatList.length; i++) {
            if (state.chatList[i].id === chat.id) {
                state.chatList.splice(i, 1);
            }
        }

    },
    setIpAddress(state, ipAddress) {
        localStorage.setItem('ipAddress', ipAddress);
        state.ipAddress = ipAddress;
    }
};

const actions = {
    async request(store, { api, form, }) {
        let isOk = false;

        try {
            let config = {
                timeout: 15000,

            };
            if (store.state.currentUser) {
                config.headers = { 'token': store.state.currentUser.token.token }

            }



            let res = await axios.post(`http://${store.state.ipAddress}:1516/${api}`, form, config);
            isOk = true;
            return Promise.resolve(res.data);

        } catch (err) {
            isOk = true;
            return Promise.reject(httpErrorHandle(err))
        }

    },
    async login(store, form) {
        try {
            form.version = store.state.version;
            let user = await store.dispatch('request', { api: 'user/login', form });
            store.commit('setCurrentUser', user);

            let contactList = await store.dispatch('request', { api: 'department/tree' });
            contactList = contactList.map((department) => {
                let userList = [];
                department.positionList.forEach(position => {
                    position.userList.forEach(user => {
                        user.position = {
                            name: position.name,
                            id: position.id,
                        };
                        user.department = {
                            name: department.name,
                            id: department.id
                        };
                        if (user.id !== store.state.currentUser.id) userList.push(user);
                    })
                });
                return {
                    name: department.name,
                    id: department.id,
                    userList: userList
                }
            });
            store.commit('setContactList', contactList);

            let chatList = await store.dispatch('request', { api: 'chat/index' });
            store.commit('setChatList', chatList);

            store.commit('initWebSocket', `ws://${store.state.ipAddress}:1516/socket/connect?token=${store.state.currentUser.token.token}`);
        } catch (err) {
            store.commit('setCurrentUser', null);
            console.log(err);
            return Promise.reject(err);
        }
    },
    async sendTextMessage(store, form) {
        let uuid = form.isResend ? form.uuid : generateUUID();
        UUIDList.push(uuid);
        let formMessage = {
            type: 'text',
            content: form.content,
            sender: {
                id: store.state.currentUser.id,
                legalName: store.state.currentUser.legalName
            },
            builtTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            isSending: true,
            uuid: uuid
        };
        try {
            if (form.isResend) {
                store.commit('updateMessageFromChat', { message: formMessage, uuid: uuid, chatId: form.chatId });
            } else {
                store.commit('addMessageToChat', { message: formMessage, chatId: form.chatId });
            }
            form.uuid = uuid;
            let message = await store.dispatch('request', { api: 'message/text/send', form });
            store.commit('updateMessageFromChat', { message: message, uuid: uuid, chatId: form.chatId });
        } catch (err) {
            formMessage.isError = true;
            formMessage.isSending = false;
            store.commit('updateMessageFromChat', { message: formMessage, uuid: uuid, chatId: form.chatId });
            return Promise.reject(err);
        }
    },
    async newChat(store, userIdList) {
        let uuid = generateUUID();
        userIdList.push(store.state.currentUser.id);
        UUIDList.push(uuid);
        try {
            let chat = await store.dispatch('request', { api: 'chat/new', form: { userIdList, uuid } });
            store.commit('addChat', chat);
            store.commit('setActivePanelIndex', 0);
            store.commit('setActiveChat', chat);
        } catch (err) {
            return Promise.reject(err);
        }

    },
    async changeChatName(store, form) {
        try {
            let chat = await store.dispatch('request', { api: 'chat/update', form: form });
        } catch (err) {
            return Promise.reject(err);
        }

    },
    async sendFileMessage(store, form) {
        let uuid = form.get('isResend') ? form.get('uuid') : generateUUID();
        UUIDList.push(uuid);
        let formMessage = {
            type: 'file',
            content: '[文件]',
            media: {
                name: form.get('file').name,
                size: form.get('file').size
            },
            sender: {
                id: store.state.currentUser.id,
                legalName: store.state.currentUser.legalName
            },
            builtTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            isSending: true,
            uuid: uuid,
            progress: 0,
            formData: form
        };
        try {
            if (form.get('isResend')) {
                store.commit('updateMessageFromChat', { message: formMessage, uuid: uuid, chatId: form.get('chatId') });
            } else {
                store.commit('addMessageToChat', { message: formMessage, chatId: form.get('chatId') });
            }
            form.append('uuid', uuid);
            let message = await axios.post(`http://${store.state.ipAddress}:1516/message/file/send`, form, {
                headers: { 'token': store.state.currentUser.token.token },
                onUploadProgress(e) {
                    let status = {
                        progress: Number(((e.loaded / e.total) * 100).toFixed()),
                        isSending: true,
                        isError: false
                    };
                    store.commit('updateFileMessageStatus', { status: status, uuid: uuid, chatId: form.get('chatId') });
                }
            });
            store.commit('updateMessageFromChat', { message: message.data, uuid: uuid, chatId: form.get('chatId') });

        } catch (err) {
            let status = {
                isSending: false,
                isError: true
            };
            store.commit('updateFileMessageStatus', { status: status, uuid: uuid, chatId: form.get('chatId') });
            return Promise.reject(err);
        }
    },
    async chatInviteMulti(store, { chatId, userIdList }) {
        try {
            await store.dispatch('request', {
                api: 'chat/invite/multi', form: {
                    chatId: chatId,
                    userIdList: userIdList
                }
            });
        } catch (err) {
            return Promise.reject(err);
        }

    },
    async leaveChat(store, chatId) {
        try {
            await store.dispatch('request', { api: 'chat/leave', form: { chatId: chatId } });
            store.commit('removeChat', { id: chatId });
        } catch (err) {
            return Promise.reject(err);
        }
    }
};

let Store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: process.env.NODE_ENV !== 'production'
});
export default Store;


let httpErrorHandle = function (err) {
    if (typeof err === 'object') {
        err = JSON.parse(JSON.stringify(err));
        if (err.hasOwnProperty('response') && err.response.hasOwnProperty('data')) {
            Message({ message: err.response.data.message || '未知错误', type: 'warning' });
            return (err.response.data.message || '未知错误');
        } else {
            Message({ message: '连接服务器出错，请稍后再试', type: 'warning' });
            return ('连接服务器出错，请稍后再试');
        }
    } else {
        Message({ message: '连接服务器出错，请稍后再试', type: 'warning' });
        return ('连接服务器出错，请稍后再试')
    }
};

class Department {
    positionList = [];
    userList = [];
    offlineChatMessage = {};
}

let generateUUID = function () {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};