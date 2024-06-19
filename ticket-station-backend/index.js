import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from "bcrypt"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"538194Dimo",
    database:"dssticketproject"
})

app.use(express.json())
app.use(cors())

app.get("/tickets", (req, res) => {
    const q = "SELECT * FROM ticket"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post("/tickets", (req, res) => {
    const q = "INSERT INTO ticket (`shortDescription`, `description`, `state`, `priority`, `asignedTo`, `createdOn`) VALUES (?)";
    const values = [
        req.body.shortDescription, 
        req.body.description, 
        req.body.state,
        req.body.priority,
        req.body.asignedTo, 
        req.body.createdOn
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Ticket created successfully")
    });
});

app.put("/tickets", (req, res) => {
    const ticketId = req.body.idTicket;
    const q = "UPDATE ticket SET `shortDescription` = ?, `description` = ?, `state` = ?, `priority` = ?, `asignedTo` = ?,  `createdOn` = ? WHERE idTicket = ?";

    const values = [
        req.body.shortDescription, 
        req.body.description, 
        req.body.state,
        req.body.priority,
        req.body.asignedTo, 
        req.body.createdOn
    ];

    db.query(q, [...values, ticketId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Ticket updated successfully")
    });
});

app.post("/log", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const q = "SELECT * FROM user WHERE `email` = ?";
  
    db.query(q, email, async (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.json("Invalid credentials");
      }
  
      const user = data[0];
      const hashedPassword = user.password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  
      if (isPasswordValid) {
        return res.json(user);
      } else {
        return res.json("Invalid credentials");
      }
    });
  });
  
app.post("/reg", async (req, res) => {
    const check = "SELECT * FROM user WHERE `email` = ?";

    db.query(check, req.body.email, async (err, data) => {
        if (err) return res.json(err)

        if (data.length > 0) {
            return res.json("This email is already taken!");
        } else {
            const q = "INSERT INTO user (`email`, `firstName`, `lastName`, `fullName`, `password`, `role`) VALUES (?)";
            const values = [
                req.body.email, 
                req.body.fName, 
                req.body.lName, 
                req.body.fullName, 
                req.body.password, 
                req.body.role 
            ];

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            values[4] = hashedPassword;

            db.query(q, [values], (err, data) => {
                if (err) return res.json(err)
                return res.json("Registered successfully");
            })
        }
    });
})

app.post("/user", (req, res) => {
    const id = req.body[0];
    const q = "SELECT firstName FROM user WHERE `idUser` = ?";

    db.query(q, id, (err, data) => {
        if (err) return res.json(err)
        return res.json(data);
    })
})

app.delete("/tickets/:id", (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM ticket WHERE `idTicket` = ?";

    db.query(q, id, (err, data) => {
        if (err) return res.json(err)
        return res.json("Deleted Successfully!");
    })
})

app.listen(8800, ()=>{
    console.log("Backend running!!");
})