// ===================== MODEL =====================
class StudentModel {
  constructor() {
    this.students = JSON.parse(localStorage.getItem('students')) || [];
  }

  save() {
    localStorage.setItem('students', JSON.stringify(this.students));
  }

  addStudent(student) {
    const index = this.students.findIndex(s => s.id === student.id);
    if (index >= 0) this.students[index] = student; // update
    else this.students.push(student); // add
    this.save();
  }

  removeStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
  }

  getAll() {
    return this.students;
  }

  getById(id) {
    return this.students.find(s => s.id === id);
  }
}

// ===================== VIEW =====================
class StudentView {
  constructor() {
    this.table = document.getElementById('studentTable');
    this.form = document.getElementById('studentForm');
    this.idInput = document.getElementById('studentId');
    this.nameInput = document.getElementById('studentName');
    this.ageInput = document.getElementById('studentAge');
  }

  displayStudents(students) {
    this.table.innerHTML = "";
    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>
          <button class="action-btn edit" data-id="${student.id}">Edit</button>
          <button class="action-btn delete" data-id="${student.id}">Delete</button>
        </td>`;
      this.table.appendChild(row);
    });
  }

  clearForm() {
    this.idInput.value = "";
    this.nameInput.value = "";
    this.ageInput.value = "";
  }

  fillForm(student) {
    this.idInput.value = student.id;
    this.nameInput.value = student.name;
    this.ageInput.value = student.age;
  }
}

// ===================== CONTROLLER =====================
class StudentController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = this.view.idInput.value.trim();
      const name = this.view.nameInput.value.trim();
      const age = parseInt(this.view.ageInput.value);

      if (!id || !name || age <= 0) return alert("Invalid input!");

      this.model.addStudent({ id, name, age });
      this.view.displayStudents(this.model.getAll());
      this.view.clearForm();
    });

    this.view.table.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (e.target.classList.contains('delete')) {
        this.model.removeStudent(id);
        this.view.displayStudents(this.model.getAll());
      }
      if (e.target.classList.contains('edit')) {
        const student = this.model.getById(id);
        this.view.fillForm(student);
      }
    });

    // initial load
    this.view.displayStudents(this.model.getAll());
  }
}

// ===================== INIT APP =====================
document.addEventListener('DOMContentLoaded', () => {
  const app = new StudentController(new StudentModel(), new StudentView());
});
