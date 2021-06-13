"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
var User = /** @class */ (function () {
    function User(userId, email, senha) {
        this.recados = [];
        this.userId = userId;
        this.email = email;
        this.senha = senha;
    }
    return User;
}());
var Recado = /** @class */ (function () {
    function Recado(recadoId, descricao, detalhe) {
        this.recadoId = recadoId;
        this.descricao = descricao,
            this.detalhe = detalhe;
    }
    return Recado;
}());
var users = [];
app.post("/users", function (request, response) {
    var _a = request.body, email = _a.email, senha = _a.senha;
    var novoId = uuid_1.v4();
    var user = new User(novoId, email, senha);
    var exist = users.find(function (f) {
        return f.email === email;
    });
    if (exist) {
        return response.status(400).json(email + " j\u00E1 cadastrado.");
    }
    users.push(user);
    return response.status(200).json({
        id: novoId,
        email: email,
        senha: senha
    });
});
app.get("/users/", function (request, response) {
    return response.status(200).json({
        users: users
    });
});
app.get("/users/:userId", function (request, response) {
    var userId = request.params.userId;
    var user = users.find(function (f) {
        return f.userId === userId;
    });
    return response.status(200).json(user);
});
app.post("/users/:userId/recados", function (request, response) {
    var userId = request.params.userId;
    var _a = request.body, descricao = _a.descricao, detalhe = _a.detalhe;
    var novoId = uuid_1.v4();
    var user = users.find(function (f) {
        return f.userId === userId;
    });
    var recado = new Recado(novoId, descricao, detalhe);
    user.recados.push(recado);
    return response.status(200).json({
        descricao: descricao,
        detalhe: detalhe
    });
});
app.get("/users/:userId/recados", function (request, response) {
    var userId = request.params.userId;
    var user = users.find(function (f) {
        return f.userId === userId;
    });
    return response.status(200).json({
        recados: user.recados
    });
});
app.delete("/users/:userId/recados/:recadoId", function (request, response) {
    var _a = request.params, userId = _a.userId, recadoId = _a.recadoId;
    var user = users.find(function (f) {
        return f.userId === userId;
    });
    var indexRecado = user.recados.findIndex(function (f) {
        return f.recadoId === recadoId;
    });
    user.recados.splice(indexRecado, 1);
    return response.status(200).json("Recado apagado");
});
app.put("/users/:userId/recados/:recadoId", function (request, response) {
    var _a = request.params, userId = _a.userId, recadoId = _a.recadoId;
    var _b = request.body, descricao = _b.descricao, detalhe = _b.detalhe;
    var user = users.find(function (f) {
        return f.userId === userId;
    });
    var recado = user.recados.find(function (f) {
        return f.recadoId === recadoId;
    });
    if (!recado) {
        return response.status(404).json({
            msg: "recado não encontrado",
        });
    }
    recado.descricao = descricao;
    recado.detalhe = detalhe;
    return response.status(200).json({
        id: recadoId,
        descricao: descricao,
        detalhe: detalhe
    });
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Servidor rodando...");
});
