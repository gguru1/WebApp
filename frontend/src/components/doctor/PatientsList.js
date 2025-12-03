// // components/doctor/PatientsList.js

// import React, { useState, useEffect } from 'react';
// import userService from '../../services/userService';

// const PatientsList = () => {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     loadPatients();
//   }, []);

//   const loadPatients = async () => {
//     try {
//       setLoading(true);
//       const data = await userService.getUsersByRole('patient');
//       const patientsList = data.users || data || [];
//       setPatients(patientsList);
//     } catch (error) {
//       console.error('Error loading patients:', error);
//       setPatients([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredPatients = patients.filter(patient =>
//     (patient.first_name || patient.firstName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (patient.last_name || patient.lastName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <div className="text-center py-5">
//       <div className="spinner-border text-primary" role="status"></div>
//     </div>;
//   }

//   return (
//     <>
//       <div className="page-header">
//         <h2>My Patients</h2>
//         <p>View your patient list</p>
//       </div>

//       <div className="data-table-container">
//         <div className="table-header">
//           <h3>Patients</h3>
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="form-control"
//             />
//             <i className="fas fa-search"></i>
//           </div>
//         </div>

//         <div className="table-responsive">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Last Visit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4">
//                     No patients found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredPatients.map((patient) => (
//                   <tr key={patient.user_id || patient.id}>
//                     <td>{patient.first_name || patient.firstName} {patient.last_name || patient.lastName}</td>
//                     <td>{patient.email}</td>
//                     <td>{patient.phone || 'N/A'}</td>
//                     <td>{patient.last_visit || patient.lastVisit || 'No visits'}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PatientsList;