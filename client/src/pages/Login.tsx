import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard"); // Redirect if already logged in
    }, []);

    const handleLogin = async (response: any) => {
        console.log('login success');
        try {
            const { data } = await axios.post("http://localhost:3002/api/auth/google-login", {
                token: response.tokenId,
            });

            console.log(data);

            localStorage.setItem("token", data.token);
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-semibold mb-6 text-gray-800">Admin Login</h1>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <GoogleLogin
                    clientId="517464061253-d8u4o5dv4na2ibe4ia0a2tvh64rfbr5t.apps.googleusercontent.com"
                    onSuccess={handleLogin}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600"
                />
            </div>
        </div>
    );
};

export default Login;
