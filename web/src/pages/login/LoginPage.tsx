import { ClayButton } from "../../components/ClayButton"

import { API_BASE } from '../../shared/api/base'



export function LoginPage() {
    return (

        <>
        <h1>Please Login to Continue!</h1>
        <ClayButton
            variant = 'primary'
            onClick={() => {
                window.location.href = `${API_BASE}/api/auth/google`
            }}
            >
                Continue with Google
            </ClayButton>

            <ClayButton
            variant = 'primary'
            onClick={() => {
                // dummy guest login
            }}
            >
                Continue as Guest (Not implemented)
            </ClayButton>
            </>
    )
}

export default LoginPage