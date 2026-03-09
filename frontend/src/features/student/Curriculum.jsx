import React, { useEffect, useState } from "react";
import axios from "axios";

const Curriculum = () => {

    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurriculum();
    }, []);

    const fetchCurriculum = async () => {
        try {
            const token = localStorage.getItem("access");

            const response = await axios.get(
                "http://localhost:8000/api/courses/curriculum/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data)

            setCurriculum(response.data);
            setLoading(false);

        } catch (error) {
            console.error("Curriculum alınamadı:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
    <div>

      <h2>Müfredat</h2>

      {Object.keys(curriculum).map((semester) => (

        <div key={semester} style={{ marginBottom: "30px" }}>

          <h3>{semester}. Dönem</h3>

          <table border="1">

            <thead>
              <tr>
                <th>Ders Kodu</th>
                <th>Ders Adı</th>
                <th>Kredi</th>
                <th>AKTS</th>
                <th>Tür</th>
              </tr>
            </thead>

            <tbody>

              {curriculum[semester].map((course, index) => (

                <tr key={index}>
                  <td>{course.cours_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.course_credit}</td>
                  <td>{course.course_ects}</td>
                  <td>{course.course_type}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ))}

    </div>
  )
}


export default Curriculum;