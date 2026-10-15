import express from "express";
import mysql from "mysql2";

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password123",
    database: "college"
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.query(query, (err, results: any) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        if (results.length > 0) {
            res.json({
                message: "Login successful",
                user: results[0],
                sessionToken: Math.random().toString(36).substring(2)
            });
        } else {
            res.status(401).json({
                message: "Invalid credentials"
            });
        }
    });
});

app.get("/users", (req, res) => {
    const search = req.query.search || "";

    const query = `SELECT * FROM users WHERE username LIKE '%${search}%'`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(results);
    });
});

app.delete("/users/:id", (req, res) => {
    const query = `DELETE FROM users WHERE id = ${req.params.id}`;

    db.query(query, (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json({
            message: "User deleted successfully"
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
