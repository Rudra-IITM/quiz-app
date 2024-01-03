"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
let globalProblemId = 0;
class QuizManager {
    constructor() {
        this.quizes = [];
    }
    start(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem(Object.assign(Object.assign({}, problem), { startTime: new Date().getTime(), id: (globalProblemId++).toString(), submissions: [] }));
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }
    addUser(roomId, name) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.addUser(name);
    }
    submit(userId, roomId, problemId, submission) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.submit(userId, roomId, problemId, submission);
    }
    getQuiz(roomId) {
        var _a;
        return (_a = this.quizes.find(x => x.roomId === roomId)) !== null && _a !== void 0 ? _a : null;
    }
    getCurrentState(roomId) {
        const quiz = this.quizes.find(x => x.roomId === roomId);
        if (!quiz) {
            return null;
        }
        quiz.getCurrentState();
    }
}
exports.QuizManager = QuizManager;
