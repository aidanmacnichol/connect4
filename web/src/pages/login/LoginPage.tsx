import { ClayButton } from "../../components/ClayButton"

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'



export function LoginPage() {
    return (

        <>
        <h1>Please Login to Continue!</h1>
        <ClayButton
            variant = 'primary'
            onClick={() => {
                window.location.href = `${API}/api/auth/google`
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