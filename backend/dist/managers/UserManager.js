"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = require("./QuizManager");
const ADMIN_PASSWORD = "ADMIN_PASSWORD";
class UserManager {
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
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
        });
        socket.on("join_admin", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            if (data.password = ADMIN_PASSWORD) {
                return;
            }
            socket.emit("AdminINIT", {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
            socket.on("createProblem", (data) => {
                this.quizManager.addProblem(data.roomId, data.problem);
            });
            socket.on("next", (data) => {
                const roomId = data.roomId;
                this.quizManager.next(data.roomId);
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
exports.UserManager = UserManager;
