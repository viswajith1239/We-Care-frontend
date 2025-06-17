import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt"

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../app/store";

import { useEffect, useRef } from "react";
import { useSocketContext } from "../../context/socket";
import { setRoomId, setShowVideoCall, setVideoCall,setPrescription } from "../../slice/DoctorSlice";


function DoctorVideoCall(){
    const videoCallRef = useRef<HTMLDivElement | null>(null);
    const { roomIdDoctor, videoCall } = useSelector((state: RootState) => state.doctor);

    const dispatch = useDispatch();
    let { socket } = useSocketContext();
    useEffect(() => {
        if (!roomIdDoctor) return;
    
        const appId = parseInt(import.meta.env.VITE_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SECRET;
    
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appId,
          serverSecret,
          roomIdDoctor.toString(),
          Date.now().toString(),
          "Doctor"
        );
    
        const zp = ZegoUIKitPrebuilt.create(kitToken);
    
        zp.joinRoom({
          container: videoCallRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showPreJoinView: false,
          onUserJoin: (users) => {
            users.forEach((user) => {
              console.log("User joined the room:", user);
            });
          },
          onLeaveRoom: () => {
            console.log("Leaving room...");
    
            // Emit leave-room event to the server
            if (socket) {
              socket.emit("leave-room", { to: videoCall?.userID });
            }
    
            // Reset state on leave
            dispatch(setPrescription(true))
            dispatch(setShowVideoCall(false));
            dispatch(setRoomId(null));
            dispatch(setVideoCall(null));
          },
        });
    
        // Handle user-left event from the server
        socket?.on("user-left", () => {
          console.log("User left the room.");
          zp.destroy();
          dispatch(setShowVideoCall(false));
          dispatch(setRoomId(null));
          dispatch(setVideoCall(null));
        });
    
        return () => {
          zp.destroy();
          socket?.off("user-left");
        };
      }, [roomIdDoctor, dispatch, socket]);

      return (
        <div
          className="w-screen bg-black h-screen absolute z-[100]"
          ref={videoCallRef}
        />
      );
}
export default DoctorVideoCall;

