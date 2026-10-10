const express = require("express");
const dotenv = require("dotenv");
const { connectDB, getDB } = require("./db");
const {
  validateInternship,
  allowedStatuses
} = require("./validation");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Internship REST API is running"
  });
});

app.get("/api/internships", async (req, res) => {
  try {
    const db = getDB();

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const status = req.query.status;

    let where = "";
    let params = [];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status"
        });
      }

      where = "WHERE status = ?";
      params.push(status);
    }

    const totalResult = await db.get(
      `SELECT COUNT(*) AS total FROM internships ${where}`,
      params
    );

    const internships = await db.all(
      `
      SELECT *
      FROM internships
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: internships,
      pagination: {
        page,
        limit,
        total: totalResult.total,
        totalPages: Math.ceil(totalResult.total / limit)
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.get("/api/internships/:id", async (req, res) => {
  try {
    const db = getDB();

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid internship ID"
      });
    }

    const internship = await db.get(
      "SELECT * FROM internships WHERE id = ?",
      id
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.post("/api/internships", async (req, res) => {
  try {
    const db = getDB();

    const validation = validateInternship(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    const {
      title,
      company,
      location,
      startDate,
      endDate,
      stipend,
      description,
      status
    } = req.body;

    const internshipStatus = status || "applied";

    const result = await db.run(
      `
      INSERT INTO internships
      (
        title,
        company,
        location,
        startDate,
        endDate,
        stipend,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        company.trim(),
        location.trim(),
        startDate,
        endDate,
        stipend ?? null,
        description ?? null,
        internshipStatus
      ]
    );

    const internship = await db.get(
      "SELECT * FROM internships WHERE id = ?",
      result.lastID
    );

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      data: internship
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.put("/api/internships/:id", async (req, res) => {
  try {
    const db = getDB();

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid internship ID"
      });
    }

    const existing = await db.get(
      "SELECT * FROM internships WHERE id = ?",
      id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    const updatedData = {
      title: req.body.title ?? existing.title,
      company: req.body.company ?? existing.company,
      location: req.body.location ?? existing.location,
      startDate: req.body.startDate ?? existing.startDate,
      endDate: req.body.endDate ?? existing.endDate,
      stipend: req.body.stipend ?? existing.stipend,
      description: req.body.description ?? existing.description,
      status: req.body.status ?? existing.status
    };

    const validation = validateInternship(updatedData);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    await db.run(
      `
      UPDATE internships
      SET
        title = ?,
        company = ?,
        location = ?,
        startDate = ?,
        endDate = ?,
        stipend = ?,
        description = ?,
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        updatedData.title.trim(),
        updatedData.company.trim(),
        updatedData.location.trim(),
        updatedData.startDate,
        updatedData.endDate,
        updatedData.stipend,
        updatedData.description,
        updatedData.status,
        id
      ]
    );

    const internship = await db.get(
      "SELECT * FROM internships WHERE id = ?",
      id
    );

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      data: internship
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.delete("/api/internships/:id", async (req, res) => {
  try {
    const db = getDB();

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid internship ID"
      });
    }

    const existing = await db.get(
      "SELECT * FROM internships WHERE id = ?",
      id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    await db.run(
      "DELETE FROM internships WHERE id = ?",
      id
    );

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();