import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { useEffect, useRef } from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../../context/socket";
import { setRoomIdUser, setShowIncomingVideoCall, setShowVideoCallUser, setVideoCallUser } from "../../slice/UserSlice";


function VideoCall() {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdUser, showIncomingVideoCall, videoCall } = useSelector((state: RootState) => state.user);
  let { socket } = useSocketContext();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!roomIdUser) return;

  }, [roomIdUser]);

  useEffect(() => {
    if (!roomIdUser) return;

    const appId = parseInt(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdUser.toString(),
      Date.now().toString(),
      "User"
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
      onLeaveRoom: () => {
        socket?.emit("leave-room", { to: showIncomingVideoCall?.doctorId });
        dispatch(setShowVideoCallUser(false));
        dispatch(setRoomIdUser(null));
        dispatch(setVideoCallUser(null));
        dispatch(setShowIncomingVideoCall(null));
      },
    });

    socket?.on("user-left", () => {
      zp.destroy();
      dispatch(setShowVideoCallUser(false));
      dispatch(setRoomIdUser(null));
      dispatch(setVideoCallUser(null));
      dispatch(setShowIncomingVideoCall(null));
      localStorage.removeItem("roomId");

      localStorage.removeItem("showVideoCall");
    });

    return () => {
      window.location.reload();

      zp.destroy();
    };
  }, [roomIdUser, dispatch, socket]);

  return (
    <div
      className="w-screen bg-black h-screen absolute z-[100]"
      ref={videoCallRef}
    />
  );
}

export default VideoCall