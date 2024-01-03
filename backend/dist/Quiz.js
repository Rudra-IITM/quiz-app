"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const IoManager_1 = require("./managers/IoManager");
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
    }
    addProblem(problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }
    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
        this.currentState = "question";
    }
    setActiveProblem(problem) {
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IoManager_1.IoManager.getIo().emit("CHANGE_PROBLEM", {
            problem,
        });
        setTimeout(() => {
            this.sendLeaderboard();
        }, 20 * 1000);
    }
    sendLeaderboard() {
        const leaderboard = this.getLeaderboard();
        IoManager_1.IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard,
        });
    }
    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            // IoManager.getIo().emit("QUIZ_ENDED", {
            //     problem
            // })
        }
    }
    generateString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    addUser(name) {
        const id = this.generateString(7);
        this.users.push({
            name, id,
            points: 0,
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id == userId);
        if (!problem || !user) {
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId == userId);
        if (existingSubmission) {
            return;
        }
        problem.submissions.push({
            problemId,
            isCorrect: problem.answer == submission,
            userId,
            optionSelected: submission,
        });
        user.points += 1000 - 500 * (new Date().getTime() - problem.startTime) / 20;
    }
    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).splice(0, 20);
    }
    getCurrentState() {
        if (this.currentState === "not_started") {
            return {
                type: "not_started",
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === "question") {
            const problem = this.problems[this.activeProblem];
            return {
                type: "question",
                problem,
            };
        }
    }
}
exports.Quiz = Quiz;
