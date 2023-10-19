import React from "react";
import { Redirect } from "react-router-dom";
// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
//import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";
//import Register12 from "../pages/Authentication/Register12";
import PasswordReset from "../pages/Authentication/PasswordReset";
import ProfilePasswordChange from "../pages/Authentication/ProfilePasswordChange";
// Dashboard
import Dashboard from "../pages/Dashboard/index";
//Doctor
import AddDoctor from "../pages/Doctor/AddDoctor";
import Doctors from "../pages/Doctor/Doctors";
import EditDoctor from "../pages/Doctor/EditDoctor";
//Patient
import Patients from "../pages/Pateint/Patients";
import AddPatient from "../pages/Pateint/AddPatient";
import EditPatient from "../pages/Pateint/EditPatient";
//Appointments
import Appointments from "../pages/Appointments/Appointments";
import EditAppointment from "../pages/Appointments/EditAppointment";
import AddAppointment from "../pages/Appointments/AddAppointment";


//Dashboard
import SuperDashboard from "../pages/SuperDashboard";
//Hospitals
import Hospitals from "../pages/Hospital/Hospitals";
import AddHospital from "../pages/Hospital/AddHospital";
import EditHospital from "../pages/Hospital/EditHospital";
//Nurses
import Nurses from "../pages/Nurses/Nurses";
import AddNurse from "../pages/Nurses/AddNurse";
import EditNurse from "../pages/Nurses/EditNurse";
//Departments
import Departments from "../pages/Department/Departments";
//Medicines
import Medicines from "../pages/Medicines/Medicines";
import AddMedicine from "../pages/Medicines/AddMedicine";
import EditMedicine from "../pages/Medicines/EditMedicine";
//Beds
import Beds from "../pages/Beds/Beds";
import AddBed from "../pages/Beds/AddBed";
import EditBed from "../pages/Beds/EditBed";
//Prescriptions
import Prescriptions from "../pages/Prescriptions/Prescriptions";
import AddPrescription from "../pages/Prescriptions/AddPrescription";
import EditPrescription from "../pages/Prescriptions/EditPrescription";

//Prescription Details
import PrescriptionDetails from "../pages/PrescriptionDetails/PrescriptionDetails";
import AddPrescriptionDetails from "../pages/PrescriptionDetails/AddPrescriptionDetails";
import EditPrescriptionDetails from "../pages/PrescriptionDetails/EditPrescriptionDetails";
//Invoices
import Invoices from "../pages/Invoice/Invoices";
import AddInvoice from "../pages/Invoice/AddInvoice";
import EditInvoice from "../pages/Invoice/EditInvoice";
//Lab Test
import LabTest from "../pages/LabTest/LabTest";
import AddLabTest from "../pages/LabTest/AddLabTest";
import EditLabTest from "../pages/LabTest/EditLabTest";
//Payments
import Payments from "../pages/Payments/Payments";
import AddPayment from "../pages/Payments/AddPayment";
import EditPayment from "../pages/Payments/EditPayment";
import ListBed from "../pages/Beds/ListBed";
//Profile
import HProfile from "../pages/Profile/HProfile";

const authProtectedRoutes = [
    // Doctors
	{ path: "/doctors", component: Doctors},
	{ path: "/add-doctor", component: AddDoctor},
	{ path:"/edit-doctor/:doctor_id", component:EditDoctor },
	//Pateints
	{ path: "/patients", component: Patients},
	{ path: "/add-patient", component: AddPatient},
	{path: "/edit-patient/:patient_id", component: EditPatient},
    //Apointments
	{ path: "/appointments", component: Appointments},
	{ path: "/edit-appointment/:appointment_id", component: EditAppointment},
	{ path: "/add-appointment", component: AddAppointment},
	//Dashboard
	{ path: "/admin-dashboard", component: SuperDashboard},

	//Hospitals
	{ path: "/hospital-list", component: Hospitals},
	{ path: "/add-hospital", component: AddHospital},
	{ path: "/edit-hospital/:client_id", component: EditHospital},
    //Nurses
	{path:"/nurse-list", component: Nurses},
	{path:"/add-nurse", component:AddNurse},
	{ path: "/edit-nurse/:nurse_id", component: EditNurse},
    //Departments
	{path:"/department-list",component: Departments},
	//Medicines
	{path:"/medicine-list", component: Medicines},
	{path:"/add-medicine", component: AddMedicine},
	{ path: "/edit-medicine/:medicine_id", component: EditMedicine},
    //Beds
	{path:"/bed-list", component: Beds},
	{path:"/add-bed", component: AddBed},
	{path: "/edit-bed/:bed_id/:department_id", component: EditBed},
	// {path:"/beds", component: ListBed},
    //Prescriptions
	{path:"/prescription-list", component: Prescriptions},
	{path:"/add-prescription", component: AddPrescription},
	{path:"/edit-prescription/:prescription_id", component: EditPrescription},
    //Prescription Details
	{path:"/prescription-details-list", component: PrescriptionDetails},
	{path:"/add-prescription-details", component: AddPrescriptionDetails},
	{path:"/edit-prescription-details/:prescription_detail_id", component: EditPrescriptionDetails},
    //Invoices
	{path:"/invoice-list", component: Invoices},
	{path:"/add-invoice", component: AddInvoice},
	{path:"/edit-invoice/:invoice_id", component: EditInvoice},
    //Lab Test
	{path:"/lab-test-list", component:LabTest},
	{path:"/add-lab-test", component:AddLabTest},
	{path:"/edit-lab-test/:lab_test_id", component: EditLabTest},
    //Payments
	{path:"/payment-list", component:Payments},
	{path:"/add-payment", component:AddPayment},
	{path:"/edit-payment/:payment_id", component: EditPayment},
	{ path: "/dashboard", component: Dashboard },
    //Profile
	{ path: "/hprofile", component: HProfile },
	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

const publicRoutes = [
	{ path: "/logout", component: Logout },
	{ path: "/login", component: Login },
    { path: "/forgot-password", component: ForgetPwd },
	{ path: "/Hospital/reset/:uid/:token", component: PasswordReset },
	{ path: "/change-password", component: ProfilePasswordChange },
]

	// { path: "/register", component: Register },
	// { path: "/lock-screen", component: AuthLockScreen },
	// { path: "/register12", component: Register12},
	// { path: "/login12", component: Login12 },
export { authProtectedRoutes, publicRoutes };
