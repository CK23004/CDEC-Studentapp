import os
import time
import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app)

# Database Configuration from Environment Variables
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "student_db")
DB_PORT = int(os.getenv("DB_PORT", 3306))


def get_db_connection(include_db=True):
    """Establishes and returns a MySQL database connection."""
    config = {
        "host": DB_HOST,
        "user": DB_USER,
        "password": DB_PASSWORD,
        "port": DB_PORT,
    }
    if include_db:
        config["database"] = DB_NAME
    return mysql.connector.connect(**config)


def init_db():
    """Initializes Database and Students Table if they do not exist."""
    max_retries = 10
    retry_delay = 3  # seconds

    for attempt in range(max_retries):
        try:
            # 1. Connect to MySQL server without selecting database
            conn = get_db_connection(include_db=False)
            cursor = conn.cursor()

            # 2. Create database if not exists
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            cursor.close()
            conn.close()

            # 3. Connect to student_db database
            conn = get_db_connection(include_db=True)
            cursor = conn.cursor()

            # 4. Create students table if not exists
            create_table_query = """
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                course VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """
            cursor.execute(create_table_query)
            conn.commit()
            cursor.close()
            conn.close()
            print("Successfully initialized database and 'students' table.")
            break
        except Error as e:
            print(f"[Attempt {attempt + 1}/{max_retries}] MySQL Connection Error: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                print("Could not connect to MySQL database after multiple attempts.")


# Initialize DB structure on startup
init_db()


@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "service": "Student Management API"}), 200


@app.route("/students", methods=["GET"])
def get_students():
    """Fetch all student records from MySQL database."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, phone, course FROM students ORDER BY id DESC")
        students = cursor.fetchall()
        cursor.close()
        return jsonify({"success": True, "data": students}), 200
    except Error as e:
        print(f"Error fetching students: {e}")
        return jsonify({"success": False, "error": "Database error while fetching students"}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()


@app.route("/students", methods=["POST"])
def add_student():
    """Insert a new student record into MySQL database."""
    conn = None
    try:
        data = request.get_json()

        # Validation
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        phone = data.get("phone", "").strip()
        course = data.get("course", "").strip()

        if not name or not email or not phone or not course:
            return jsonify({
                "success": False,
                "error": "All fields (name, email, phone, course) are required"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        insert_query = """
        INSERT INTO students (name, email, phone, course)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (name, email, phone, course))
        conn.commit()
        new_id = cursor.lastrowid

        new_student = {
            "id": new_id,
            "name": name,
            "email": email,
            "phone": phone,
            "course": course
        }

        cursor.close()
        return jsonify({
            "success": True,
            "message": "Student added successfully",
            "data": new_student
        }), 201

    except Error as e:
        print(f"Error inserting student: {e}")
        return jsonify({"success": False, "error": "Database error while adding student"}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()


@app.route("/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    """Delete a student record by ID from MySQL database."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM students WHERE id = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            cursor.close()
            return jsonify({"success": False, "error": f"Student with ID {student_id} not found"}), 404

        cursor.execute("DELETE FROM students WHERE id = %s", (student_id,))
        conn.commit()
        cursor.close()
        return jsonify({
            "success": True,
            "message": f"Student #{student_id} deleted successfully"
        }), 200

    except Error as e:
        print(f"Error deleting student: {e}")
        return jsonify({"success": False, "error": "Database error while deleting student"}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5005))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
