import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { ShieldOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminPremission = ({ children }) => {
    const { user } = useAuthStore();
    if (user?.role === 'ADMIN') return <>{children}</>;
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 mt-30 text-center">
            <ShieldOff className="w-20 h-20 text-error mb-2 animate-bounce" />
            <h1 className="text-4xl font-bold text-error mb-2">Permission Denied</h1>
            <p className="text-base-content/70 text-lg max-w-md mb-4">
                Sorry, you do not have the required admin privileges to access this page.<br/>
                If you believe this is a mistake, please contact your administrator.
            </p>
            <Link to="/dashboard/profile" className="btn btn-primary btn-lg mt-2">
                Go to Dashboard
            </Link>
        </div>
    );
}

export default AdminPremission
