import React from "react";
import { signInWithGoogle } from "../utilities/auth";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = ({ setUser }) => {
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const user = await signInWithGoogle();
        if (user) {
            navigate("/");
        }
    };

    const handleDemoLogin = () => {
        const demoUser = { uid: "user1" };
        setUser(demoUser);
        navigate("/");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="16px"
            marginTop="200px"
        >
            <Typography variant="h5" fontWeight="600" gutterBottom>
                Welcome to DaYu
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleSignIn}
            >
                Sign in
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                onClick={handleDemoLogin}
                sx={{
                    position: "absolute",
                    bottom: "20px",
                }}
            >
                Demo
            </Button>
        </Box>
    );
};

export default Login;