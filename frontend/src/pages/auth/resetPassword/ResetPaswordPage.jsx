// import React, { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const ResetPasswordPage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const token = searchParams.get("token");

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token,
//           newPassword,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to reset password");
//       }

//       toast.success("Password reset successfully");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.message || "Something went wrong!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-screen-xl mx-auto flex items-center justify-center h-screen">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
//         <form onSubmit={handleResetPassword}>
//           <div className="mb-4">
//             <label
//               htmlFor="newPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               New Password
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               className="input input-bordered w-full"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Confirm New Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               className="input input-bordered w-full"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="btn btn-primary w-full rounded-full"
//               disabled={isLoading || !newPassword || !confirmPassword}
//             >
//               {isLoading ? "Resetting..." : "Reset Password"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;

import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MdPassword,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import XSvg from "../../../components/svgs/X";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleResetPassword}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Reset Password</h1>

          {/* New Password Field */}
          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <MdPassword
              style={{
                color: "white",
                marginRight: "15px",
                marginBottom: "4px",
                marginLeft: "5px",
              }}
            />
            <TextField
              id="newPassword"
              label="New Password"
              variant="standard"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              slotProps={{
                input: {
                  sx: { color: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowNewPassword} edge="end">
                        {showNewPassword ? (
                          <MdOutlineVisibilityOff style={{ color: "white" }} />
                        ) : (
                          <MdOutlineVisibility style={{ color: "white" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                inputLabel: {
                  sx: {
                    color: "grey",
                    "&.Mui-focused": {
                      color: "gold",
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Confirm Password Field */}
          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
            <MdPassword
              style={{
                color: "white",
                marginRight: "15px",
                marginBottom: "4px",
                marginLeft: "5px",
              }}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              variant="standard"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              slotProps={{
                input: {
                  sx: { color: "white" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                        {showConfirmPassword ? (
                          <MdOutlineVisibilityOff style={{ color: "white" }} />
                        ) : (
                          <MdOutlineVisibility style={{ color: "white" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                inputLabel: {
                  sx: {
                    color: "grey",
                    "&.Mui-focused": {
                      color: "gold",
                    },
                  },
                },
              }}
            />
          </Box>

          <button className="btn rounded-full btn-primary text-white">
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
