<div align="center">

# 🎓 University Management System

**A role-based university platform — Django REST API + React.**

Course planning, enrollment, grading and a course discussion forum, with separate experiences for admins, instructors and students.

![Backend](https://img.shields.io/badge/Backend-Django%204.2%20%7C%20DRF-092E20?style=flat-square&logo=django&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20(SimpleJWT)-A30000?style=flat-square)
![DB](https://img.shields.io/badge/DB-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61DAFB?style=flat-square&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

> Built during my backend internship at **TechNarts** to practice domain modeling, role-based access and REST API design on a non-trivial schema.

---

## ✨ Features

| Area | Details |
| --- | --- |
| 👥 **Role-based access** | Custom user model with three roles — **Admin**, **Instructor**, **Student** — each with its own permissions and UI. |
| 📚 **Course catalog** | Courses with **prerequisite** relationships (self-referencing many-to-many). |
| 🏛️ **Academic structure** | Departments, classes, semesters, class hours and classrooms. |
| 🗂️ **Sections** | Open sections with **capacity** limits and **scheduling-conflict** checks. |
| 📝 **Enrollment & grading** | Students enroll in sections; instructors assign grades on an **AA–FF** scale. |
| 💬 **Course forum** | Q&A per course with accepted answers and upvotes. |

---

## 🧱 Architecture & data model

- **Custom user model** built on `AbstractBaseUser` + `PermissionsMixin` for full control over auth and roles.
- **Course ↔ Prerequisites** — self-referencing many-to-many.
- **Enrollment** — join model linking `Student`, `Section` and grade.
- **Forum** — `User` → `Question` → `Answer` with accepted-answer and voting logic.

**Stack:** Django 4.2 · Django REST Framework · SimpleJWT · PostgreSQL · React · Vite · Tailwind CSS

---

## 📸 Screenshots

| Student dashboard | Instructor — course list |
| --- | --- |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Course list](docs/screenshots/enrollment.png) |

| Instructor — grade entry | Course forum |
| --- | --- |
| ![Grades](docs/screenshots/grades.png) | ![Forum](docs/screenshots/forum.png) |

---

## 🚀 Getting started

### Docker (quick start)

```bash
docker compose up --build
docker compose run --rm web python manage.py migrate
docker compose run --rm web python manage.py createsuperuser
```

- Backend → `http://localhost:8000`
- Frontend → `http://localhost:5173`

Development database credentials are defined in `docker-compose.yml`.

### Local development

**Backend**

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# update PostgreSQL settings in core/settings.py
python manage.py migrate
python manage.py runserver
```

**Frontend**

```bash
cd frontend
npm install
npm run dev                         # http://localhost:5173
```

---

## 📝 Notes

- CORS is enabled for `5173` and `3000` in `core/settings.py`.
- When a Student or Instructor account is created, a temporary username/password is printed to the console.

---

<div align="center">
<sub>Built by <a href="https://github.com/BerkeBoran">Berke Boran</a> · <a href="https://www.linkedin.com/in/berke-boran/">LinkedIn</a></sub>
</div>
