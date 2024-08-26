import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SidebarMenu from "../sidebar/SidebarMenu";
import MedicalRecord from "./MedicalRecord";
import PatientRecord from "./PatientRecord";

const MainMedicalRecord = () => {
    const { did } = useParams();
    const [theId, setTheId] = useState("");
    const [theName, setTheName] = useState("");
    const [theImage, setTheImage] = useState("");
    const [viewingPatientId, setViewingPatientId] = useState(null);
    const defaultImage = "images/014ef2f860e8e56b27d4a3267e0a193a.jpg";

    useEffect(() => {
      axios
        .get(`http://localhost:8000/doctor/api/finduser/` + did)
        .then((res) => {
          setTheId(res.data.theDoctor._id);
          setTheName(res.data.theDoctor.dr_firstName);
          setTheImage(res.data.theDoctor.dr_image || defaultImage)
        })
        .catch((err) => {
          console.log(err);
        });
    }, [did]);

    return (
      <div style={{display: "flex", flex: "1 0 auto", height: "100vh",overflowY: "hidden",}}>
        <SidebarMenu doctor_image={theImage} doctor_name={theName} did={theId} />
        {viewingPatientId ? (
          <PatientRecord patientId={viewingPatientId} onClose={() => setViewingPatientId(null)} />
        ) : (
          <MedicalRecord onViewRecord={setViewingPatientId} />
        )}
      </div>
    );
};

export default MainMedicalRecord;
