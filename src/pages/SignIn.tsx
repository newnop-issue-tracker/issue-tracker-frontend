import { useState } from "react";
import CustomButton from "@/components/UI/Button";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import IssueFlowLogo from "@/components/UI/IssueFlowLogo";
import AuthSide from "@/components/auth/AuthSide";
import { useLogin } from "@/features/auth/hooks";

function SignIn() {
  const login = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setEmailError(errors.email);
    setPasswordError(errors.password);
    return isValid;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;
    login.mutate({ email, password });
  };

  return (
    <div className="max-w-[1920px] mx-auto w-full flex lg:flex-row flex-col min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)]">
      <div className="lg:w-1/2 lg:flex hidden flex-1 h-full">
        <AuthSide />
      </div>

      {/* Form Section */}
      <div className="flex flex-col w-full lg:w-[45%] lg:mx-auto px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:pt-[40px] lg:px-[60px] 2xl:pt-[80px] 2xl:px-[165px] h-full overflow-y-auto pb-6">
        <div className="w-full lg:block hidden">
          <Link to="/">
            <IssueFlowLogo />
          </Link>
        </div>

        <div className="flex flex-col w-full lg:mt-10">
          <h2 className="font-PlusSans text-[24px] font-bold text-[#000] leading-[32px] lg:text-[36px]">
            Sign In
          </h2>
          <span className="mt-5 lg:leading-8 lg:text-base text-black font-PlusSans text-sm leading-6 font-medium">
            If you have an account, sign in with your email address.
          </span>

          <div className="mt-[32px]">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="Username@gmail.com"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${emailError ? "text-red-500" : ""}`}
            />
          </div>
          <div className={`h-[1px] w-full ${emailError ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}

          <div className="mt-[36px] relative">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="Enter your Password"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${passwordError ? "text-red-500" : ""}`}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <IoEyeOutline size={20} color={passwordError ? "#ef4444" : "#646464"} />
              ) : (
                <IoEyeOffOutline size={20} color={passwordError ? "#ef4444" : "#646464"} />
              )}
            </div>
          </div>
          <div className={`h-[1px] w-full ${passwordError ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}

          <div className="font-Mainfront mt-[24px] lg:mt-[32px] w-full">
            <CustomButton
              title={login.isPending ? "Signing In..." : "Sign In"}
              onClick={handleFormSubmit}
              disabled={login.isPending}
            />
          </div>
          <div className="font-Mainfront text-xs leading-6 text-[#646464] w-full mt-3">
            This site is protected by recaptcha and the Google Privacy Policy and Terms of Service apply.
          </div>
          <h1 className="flex items-center justify-center mt-[12px] font-PlusSans text-[#646464] text-sm leading-6">
            If you haven't an account?{" "}
            <Link
              to="/signup"
              className="text-brand-navy font-semibold hover:text-[#000] ml-2.5 hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </h1>
        </div>
        <div className="flex justify-center items-center text-xs text-black leading-6 mt-auto font-PlusSans lg:py-7 py-3">
          2026 © All rights reserved
        </div>
      </div>
    </div>
  );
}

export default SignIn;
