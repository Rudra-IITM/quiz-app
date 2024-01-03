"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminManager = void 0;
const QuizManager_1 = require("./QuizManager");
class AdminManager {
    constructor() {
        this.users = [];
        this.quizManager = new QuizManager_1.QuizManager();
    }
    addUser(roomId, socket) {
        this.users.push({
            socket,
            roomId,
        });
        this.createHandlers(roomId, socket);
    }
    createHandlers(roomId, socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("userId", {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
                console.log("Issue while getting input" + submission);
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission);
        });
    }
}
exports.AdminManager = AdminManager;
