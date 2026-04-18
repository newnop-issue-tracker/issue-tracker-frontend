import { useState } from "react";
import CustomButton from "@/components/UI/Button";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import IssueFlowLogo from "@/components/UI/IssueFlowLogo";
import AuthSide from "@/components/auth/AuthSide";
import { useRegister } from "@/features/auth/hooks";

const SignUp = () => {
  const registerMutation = useRegister();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;
    registerMutation.mutate({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
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
            Sign Up
          </h2>
          <span className="mt-5 lg:leading-8 lg:text-base text-black font-PlusSans text-sm leading-6 font-medium">
            Create your account to get started.
          </span>

          <div className="mt-[32px]">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.fullName ? "text-red-500" : ""}`}
            />
            <div className={`h-[1px] w-full ${errors.fullName ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div className="mt-[32px]">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.email ? "text-red-500" : ""}`}
            />
            <div className={`h-[1px] w-full ${errors.email ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mt-[36px] relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password (8+ chars)"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.password ? "text-red-500" : ""}`}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <IoEyeOutline size={20} color={errors.password ? "#ef4444" : "#646464"} />
              ) : (
                <IoEyeOffOutline size={20} color={errors.password ? "#ef4444" : "#646464"} />
              )}
            </div>
          </div>
          <div className={`h-[1px] w-full ${errors.password ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

          <div className="mt-[36px] relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className={`w-full text-[14px] font-PlusSans placeholder:text-[#646464] text-black leading-[24px] font-normal focus:outline-none ${errors.confirmPassword ? "text-red-500" : ""}`}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <IoEyeOutline size={20} color={errors.confirmPassword ? "#ef4444" : "#646464"} />
              ) : (
                <IoEyeOffOutline size={20} color={errors.confirmPassword ? "#ef4444" : "#646464"} />
              )}
            </div>
          </div>
          <div className={`h-[1px] w-full ${errors.confirmPassword ? "bg-red-500" : "bg-[#000]"} mt-[4px]`} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}

          <div className="font-PlusSans mt-[24px] lg:mt-[32px] w-full">
            <CustomButton
              title={registerMutation.isPending ? "Creating Account..." : "Sign Up"}
              onClick={handleFormSubmit}
              disabled={registerMutation.isPending}
            />
          </div>
          <div className="font-PlusSans text-xs leading-6 text-[#646464] w-full mt-3">
            This site is protected by recaptcha and the Google Privacy Policy and Terms of Service apply.
          </div>
          <h1 className="flex items-center justify-center mt-[12px] font-PlusSans text-[#646464] text-sm leading-6">
            If you have an account?{" "}
            <Link
              to="/signin"
              className="text-brand-navy font-semibold hover:text-[#000] ml-2.5 hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </h1>
        </div>
        <div className="flex justify-center items-center text-xs text-black leading-6 mt-auto font-PlusSans lg:py-7 py-3">
          2026 © All rights reserved
        </div>
      </div>
    </div>
  );
};

export default SignUp;
