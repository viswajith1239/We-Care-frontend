import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { useSocketContext } from '../../context/socket';
import { endCallDoctor } from '../../slice/DoctorSlice'
import { MdCallEnd } from "react-icons/md";
import userimg from "../../assets/user.png"


 function OutgoingVideocall() {

    const { videoCall, doctorInfo } = useSelector((state: RootState) => state.doctor);
      const { socket } = useSocketContext();
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);
      const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        if (videoCall?.type === "out-going") {
          socket?.emit("outgoing-video-call", {
            to: videoCall.userID,
            from: doctorInfo.id,
            doctorName: videoCall.doctorName,
            doctorImage: videoCall.doctorImage,
            callType: videoCall.callType,
            roomId: videoCall.roomId,
          });
    
          timeoutRef.current = setTimeout(() => {
            handleEndCall(); 
          }, 60000);
        }
        return () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          };
        }, [videoCall]);
        useEffect(() => {
            console.log('Socket instance:', socket);
            if (socket) {
              console.log('Socket connected:', socket.connected);
            }
          }, [socket]);

          const handleEndCall = async () => {
            await socket?.emit('reject-call', {to: videoCall?.userID, sender:'doctor', name:videoCall?.userName, from:doctorInfo.name, sder: doctorInfo.id})
            dispatch(endCallDoctor())
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
          }
      
  return (
    <div className="w-full h-full fixed flex justify-center items-center z-50 top-1">
      <div className="w-96 bg-cyan-950 flex justify-center items-center z-50 rounded-xl shadow-2xl shadow-black">
        <div className="flex flex-col gap-6 items-center">
          <span className="text-lg text-white mt-3"></span>
          <span className="text-3xl text-white">{videoCall?.userName}</span>
          <div className="flex">
            <img
              className="w-24 h-24 rounded-full"
              src={userimg}
              alt="profile"
            />
          </div>
          <div className="bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-5 cursor-pointer">
            <MdCallEnd onClick={handleEndCall} className="text-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default OutgoingVideocall

