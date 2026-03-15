const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ===============================
// DATABASE CONNECTION
// ===============================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lawfirm"
});

db.connect(err => {
    if(err){
        console.log("Database connection failed");
    } else {
        console.log("Connected to database");
    }
});

// ===============================
// LAWYER CRUD
// ===============================

// CREATE lawyer
app.post("/lawyers", (req,res)=>{
    const {name,specialization,email,phone} = req.body;

    const sql = "INSERT INTO lawyers (name,specialization,email,phone) VALUES (?,?,?,?)";

    db.query(sql,[name,specialization,email,phone],(err,result)=>{
        if(err) return res.send(err);

        res.send("Lawyer added successfully");
    });
});

// READ all lawyers
app.get("/lawyers",(req,res)=>{
    db.query("SELECT * FROM lawyers",(err,result)=>{
        if(err) return res.send(err);

        res.json(result);
    });
});

// UPDATE lawyer
app.put("/lawyers/:id",(req,res)=>{
    const id = req.params.id;
    const {name,specialization,email,phone} = req.body;

    const sql = "UPDATE lawyers SET name=?, specialization=?, email=?, phone=? WHERE id=?";

    db.query(sql,[name,specialization,email,phone,id],(err,result)=>{
        if(err) return res.send(err);

        res.send("Lawyer updated");
    });
});

// DELETE lawyer
app.delete("/lawyers/:id",(req,res)=>{
    const id = req.params.id;

    db.query("DELETE FROM lawyers WHERE id=?",[id],(err,result)=>{
        if(err) return res.send(err);

        res.send("Lawyer deleted");
    });
});

// ===============================
// APPLICATION CRUD
// ===============================

// CREATE application
app.post("/applications",(req,res)=>{
    const {
        client_name,
        client_email,
        client_address,
        client_city,
        case_description,
        lawyer_id,
        status
    } = req.body;

    const sql = `
        INSERT INTO applications 
        (client_name, client_email, client_address, client_city, case_description, lawyer_id, status)
        VALUES (?,?,?,?,?,?,?)
    `;

    db.query(sql,
        [client_name, client_email, client_address, client_city, case_description, lawyer_id, status],
        (err,result)=>{
            if(err) return res.send(err);

            res.send("Application submitted");
        }
    );
});

// READ all applications sorted by city and name
app.get("/applications",(req,res)=>{
    const sql = "SELECT * FROM applications ORDER BY client_city ASC, client_name ASC";
    db.query(sql, (err,result)=>{
        if(err) return res.send(err);

        res.json(result);
    });
});

// READ applications filtered by city
app.get("/applications/city/:city",(req,res)=>{
    const city = req.params.city;
    const sql = "SELECT * FROM applications WHERE client_city = ? ORDER BY client_name ASC";
    db.query(sql, [city], (err,result)=>{
        if(err) return res.send(err);

        res.json(result);
    });
});

// UPDATE application status
app.put("/applications/:id",(req,res)=>{
    const id = req.params.id;
    const {status} = req.body;

    const sql = "UPDATE applications SET status=? WHERE id=?";

    db.query(sql,[status,id],(err,result)=>{
        if(err) return res.send(err);

        res.send("Application updated");
    });
});

// DELETE application
app.delete("/applications/:id",(req,res)=>{
    const id = req.params.id;

    db.query("DELETE FROM applications WHERE id=?",[id],(err,result)=>{
        if(err) return res.send(err);

        res.send("Application deleted");
    });
});

// ===============================
// SERVER
// ===============================
app.listen(3000,()=>{
    console.log("Server running on port 3000");
});