import { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const hardcodedUsername = import.meta.env.VITE_USERNAME;
    const hardcodedPassword = import.meta.env.VITE_USERNAME_PASSWORD;

    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      alert("Login successful!");
      navigate("/form");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <main className="flex justify-center items-center h-[100vh] ">
      <div className="p-8 shadow-md rounded">
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </main>
  );
};

LoginForm.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default LoginForm;
