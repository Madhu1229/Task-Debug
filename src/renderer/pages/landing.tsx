import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PublicLayout } from "@/layouts/public-layout"
import { clearRedirectTo, getRedirectTo } from "@/lib/utils"
import logo from "../../../assets/logo.png"

export default function LandingPage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null);

  // In LandingPage
useEffect(() => {
  const checkAuthAndRedirect = async () => {
    const token = localStorage.getItem("token");
    const redirectTo = await getRedirectTo();

    if (token) {
      navigate(redirectTo || '/dashboard');
      clearRedirectTo();
    } else {
      navigate('/login');
    }
  };

  const timer = setTimeout(checkAuthAndRedirect, 1000); // Reduced delay
  return () => clearTimeout(timer);
}, []);

  return (
    <PublicLayout className="flex justify-center items-center">
      <div className="flex flex-col items-center gap-3 animate-pulse pt-24">
        <img src={logo} width={80} />
        <h2 className="font-semibold">Task 2</h2>
      </div>
    </PublicLayout>
  )
}
