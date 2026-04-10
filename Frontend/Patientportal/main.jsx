import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import HealthLogin from './login.jsx'
import PatientDashboard from './patient-dashboard.jsx'
import VitalsPage from './vitals.jsx'
import AlertsPage from './alerts.jsx'
import JarvisChat from './jarvis-chat.jsx'
import LogoutPage from './logout.jsx'
import Medication from './medication.jsx'
import Reports from './reports.jsx'
import Settings from './settings.jsx'
import PatientMessages from './patient-messages.jsx'

import DoctorDashboard from '../Doctorportal/doctor-dashboard.jsx'
import DoctorAppointments from '../Doctorportal/doctor-appointments.jsx'
import MyPatientsPage from '../Doctorportal/doctor-patients.jsx'
import DoctorAnalytics from '../Doctorportal/doctor-analytics.jsx'
import DoctorPrescriptions from '../Doctorportal/doctor-prescriptions.jsx'
import DoctorReports from '../Doctorportal/doctor-reports.jsx'
import DoctorSettings from '../Doctorportal/doctor-settings.jsx'
import DoctorMessages from '../Doctorportal/doctor-messages.jsx'
import DoctorLogout from '../Doctorportal/doctor-logout.jsx'
import DoctorChat from '../Doctorportal/doctor-chat.jsx'
import DoctorDeleteAccount from '../Doctorportal/doctor-delete-account.jsx'
import PatientDeleteAccount from './patient-delete-account.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<HealthLogin />} />
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/vitals" element={<VitalsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/jarvis-chat" element={<JarvisChat />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/medication" element={<Medication />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/messages" element={<PatientMessages />} />

                {}
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                <Route path="/doctor-patients" element={<MyPatientsPage />} />
                <Route path="/doctor-analytics" element={<DoctorAnalytics />} />
                <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />} />
                <Route path="/doctor-reports" element={<DoctorReports />} />
                <Route path="/doctor-settings" element={<DoctorSettings />} />
                <Route path="/doctor-messages" element={<DoctorMessages />} />
                <Route path="/doctor-logout" element={<DoctorLogout />} />
                <Route path="/doctor-chat" element={<DoctorChat />} />
        <Route path="/doctor-delete-account" element={<DoctorDeleteAccount />} />
        <Route path="/patient-delete-account" element={<PatientDeleteAccount />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>,
)
