// pages/adminPanel.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../styles/AdminPanel.module.css";

interface Student {
  id: number;
  name: string;
  student_college: string;
  status: string;
  dsa_score: number;
  webd_score: number;
  react_score: number;
  interview_date: string;
  interview_company: string;
  interview_student_result: string;
}

const AdminPanel = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<Student>({
    id: 0,
    name: "",
    student_college: "",
    status: "",
    dsa_score: 0,
    webd_score: 0,
    react_score: 0,
    interview_date: "",
    interview_company: "",
    interview_student_result: ""
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      setStudents(responseData);
    } else {
      console.error("Failed to fetch students:", response.statusText);
    }
    setIsLoading(false);
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editStudent) {
      setEditStudent({ ...editStudent, [name]: value });
    } else {
      setNewStudent({ ...newStudent, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (editStudent) {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/students/update/${editStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editStudent),
      });

      if (response.ok) {
        fetchStudents(); // Refresh the data
        setEditStudent(null); // Reset the edit state
      } else {
        console.error("Failed to update student:", response.statusText);
      }
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStudent),
    });

    if (response.ok) {
      fetchStudents(); // Refresh the data
      setNewStudent({
        id: 0,
        name: "",
        student_college: "",
        status: "",
        dsa_score: 0,
        webd_score: 0,
        react_score: 0,
        interview_date: "",
        interview_company: "",
        interview_student_result: ""
      }); // Reset the form
      setIsCreateModalOpen(false); // Close the modal
    } else {
      console.error("Failed to create student:", response.statusText);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      fetchStudents(); // Refresh the data
    } else {
      console.error("Failed to delete student:", response.statusText);
    }
    setIsLoading(false);
  };

  const handleExport = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/students/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      const csvContent = convertToCSV(responseData);
      downloadCSV(csvContent);
    } else {
      console.error("Failed to export students:", response.statusText);
    }
    setIsLoading(false);
  };

  const convertToCSV = (data: Student[]) => {
    const headers = [
      "ID",
      "Name",
      "College",
      "Status",
      "DSA Score",
      "WebD Score",
      "React Score",
      "Interview Date",
      "Interview Company",
      "Interview Result",
    ];
    const rows = data.map(student => [
      student.id,
      student.name,
      student.student_college,
      student.status,
      student.dsa_score,
      student.webd_score,
      student.react_score,
      new Date(student.interview_date).toLocaleDateString(),
      student.interview_company,
      student.interview_student_result,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = (csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "student_details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Student Details</h1>
        <button onClick={fetchStudents} className={styles.button}>
          {isLoading ? "Fetching Students..." : "Refresh Students"}
        </button>
        <button onClick={() => setIsCreateModalOpen(true)} className={styles.button}>
          Create Student
        </button>
        <button onClick={handleExport} className={styles.button}>
          Export CSV
        </button>

        {students.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>College</th>
                <th>Status</th>
                <th>DSA Score</th>
                <th>WebD Score</th>
                <th>React Score</th>
                <th>Interview Date</th>
                <th>Company</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.student_college}</td>
                  <td>{student.status}</td>
                  <td>{student.dsa_score}</td>
                  <td>{student.webd_score}</td>
                  <td>{student.react_score}</td>
                  <td>{new Date(student.interview_date).toLocaleDateString()}</td>
                  <td>{student.interview_company}</td>
                  <td>{student.interview_student_result}</td>
                  <td>
                    <button onClick={() => handleEdit(student)} className={styles.button}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(student.id)} className={styles.button}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editStudent && (
          <div className={styles.editForm}>
            <h2>Edit Student</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editStudent.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                College:
                <input
                  type="text"
                  name="student_college"
                  value={editStudent.student_college}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={editStudent.status}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                DSA Score:
                <input
                  type="number"
                  name="dsa_score"
                  value={editStudent.dsa_score}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                WebD Score:
                <input
                  type="number"
                  name="webd_score"
                  value={editStudent.webd_score}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                React Score:
                <input
                  type="number"
                  name="react_score"
                  value={editStudent.react_score}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Interview Date:
                <input
                  type="date"
                  name="interview_date"
                  value={new Date(editStudent.interview_date).toISOString().substr(0, 10)}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Interview Company:
                <input
                  type="text"
                  name="interview_company"
                  value={editStudent.interview_company}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Interview Result:
                <input
                  type="text"
                  name="interview_student_result"
                  value={editStudent.interview_student_result}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" className={styles.button}>
                Update
              </button>
            </form>
          </div>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={() => setIsCreateModalOpen(false)}
          contentLabel="Create Student Modal"
        >
          <h2>Create Student</h2>
          <form onSubmit={handleCreate} className={styles.form}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              College:
              <input
                type="text"
                name="student_college"
                value={newStudent.student_college}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Status:
              <input
                type="text"
                name="status"
                value={newStudent.status}
                onChange={handleInputChange}
              />
            </label>
            <label>
              DSA Score:
              <input
                type="number"
                name="dsa_score"
                value={newStudent.dsa_score}
                onChange={handleInputChange}
              />
            </label>
            <label>
              WebD Score:
              <input
                type="number"
                name="webd_score"
                value={newStudent.webd_score}
                onChange={handleInputChange}
              />
            </label>
            <label>
              React Score:
              <input
                type="number"
                name="react_score"
                value={newStudent.react_score}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Interview Date:
              <input
                type="date"
                name="interview_date"
                value={newStudent.interview_date}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Interview Company:
              <input
                type="text"
                name="interview_company"
                value={newStudent.interview_company}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Interview Result:
              <input
                type="text"
                name="interview_student_result"
                value={newStudent.interview_student_result}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit" className={styles.button}>
              Create
            </button>
            <button onClick={() => setIsCreateModalOpen(false)} className={styles.button}>
              Close
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminPanel;
