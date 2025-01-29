import React,{useEffect,useState} from "react";
import { RootState,AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getKycStatus } from "../../action/doctorActions";

import DoctorKyc from "../../components/doctorComponents/DoctorKyc"
import KycSubmitStatus from "../../components/doctorComponents/kycSubmitStatus";
import KycRejectionStatus from "../../components/doctorComponents/KycRejectionStatus";

interface DoctorProtectedRouteProps {
    children: React.ReactNode;
  }
  
  function DoctorProtectRoute({ children }: DoctorProtectedRouteProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [updated, setUpdated] = useState(false);
    const { doctorInfo, kycStatus } = useSelector(
      (state: RootState) => state.doctor
    );
  
    const doctor_id = doctorInfo?.id;
    console.log("Doctor ID:", doctor_id);
    const toggleUpdateStatus = () => {
      setUpdated(!updated);
    };
    useEffect(() => {
      if (doctor_id) {
        console.log("p.......");
        dispatch(getKycStatus(doctor_id));
        toggleUpdateStatus();
      } else {
        navigate("/doctor/login");
      }
    }, [doctor_id, dispatch, navigate]);
    console.log("kyc status=======", kycStatus);
    console.log("kyc status=======", doctorInfo);
  
    if (!doctorInfo) {
      return null;
    } else if (kycStatus === "submitted") {
      return (
        <>
          <KycSubmitStatus />
        </>
      );
    } else if (kycStatus === "rejected") {
      return (
        <>
          <KycRejectionStatus />
        </>
      );
    } else if (kycStatus === "pending") {
      return (
        <>
          <DoctorKyc />
        </>
      );
    } else {
      return <>{children}</>;
    }
  }
  
  export default DoctorProtectRoute;