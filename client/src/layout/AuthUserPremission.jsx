import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useModalStore } from '../store/useModalStore'

const AuthUserPermission = ({ children }) => {
    const { user } = useAuthStore();
    const { setOpenLogin } = useModalStore();
    if (user) return <>{children}</>;
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center mt-25">
            <Lock className="w-20 h-20 text-error mb-2 animate-bounce" />
            <h1 className="text-4xl font-bold text-error mb-2">Permission Denied</h1>
            <p className="text-base-content/70 text-lg max-w-md mb-4">
                You must be logged in to access this page.<br/>
                Please log in to continue.
            </p>
            <div className='flex flex-row gap-4'>
            <button onClick={setOpenLogin} className="btn btn-primary btn-lg mt-2">     
                Go to Login
            </button>
            <Link to="/" className="btn btn-primary btn-lg mt-2">
                Go to Home
            </Link>
            </div>
        </div>
    );
}

export default AuthUserPermission
