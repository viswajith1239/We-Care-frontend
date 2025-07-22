import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store"
import { useSocketContext } from "../../context/socket"
import { endCallUser, setRoomIdUser, setShowVideoCallUser } from "../../slice/UserSlice"
import { MdCallEnd } from "react-icons/md"


function IncomingVideoCall() {

  const { showIncomingVideoCall } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const handleEndCall = async () => {
    if (!showIncomingVideoCall) {
      console.error("No incoming call to end.");
      return;
    }
    await socket?.emit("reject-call", {
      to: showIncomingVideoCall._id,
      sender: "user",
      name: showIncomingVideoCall.doctorName,
    });
    dispatch(endCallUser());
  };
  const handleAcceptCall = async () => {
    if (!showIncomingVideoCall) {
      console.error("No incoming call to accept.");
      return;
    }
    console.log('Emitting accept-incoming-call with data:', {
      to: showIncomingVideoCall._id,
      from: showIncomingVideoCall.doctorId,
      roomId: showIncomingVideoCall.roomId,
    });

    socket?.emit("accept-incoming-call", {
      to: showIncomingVideoCall._id,
      from: showIncomingVideoCall.doctorId,
      roomId: showIncomingVideoCall.roomId,
    });
    dispatch(setRoomIdUser(showIncomingVideoCall.roomId));
    dispatch(setShowVideoCallUser(true));
  };

  return (
    <>
      <div className='w-full h-full flex justify-center items-center z-40 fixed top-1'>
        <div className='w-96 bg-cyan-950  z-40 rounded-xl flex flex-col items-center shadow-2xl shadow-black'>
          <div className='flex flex-col gap-7 items-center'>
            <span className='text-lg text-white  mt-4'>
              {'Incoming video call'}
            </span>
            <span className='text-3xl text-white font-bold'>{showIncomingVideoCall?.doctorName}</span>

          </div>
          <div className='flex m-5'>
            <img className='w-24 h-24 rounded-full' src={showIncomingVideoCall?.doctorImage} alt='profile' />
          </div>
          <div className='flex m-2  mb-5 gap-7'>

            <div className='bg-green-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
              <MdCallEnd onClick={handleAcceptCall} className='text-3xl' />

            </div>
            <div className='bg-red-500 w-12 h-12 text-white rounded-full flex justify-center items-center m-1 cursor-pointer'>
              <MdCallEnd onClick={handleEndCall} className='text-3xl' />

            </div>
          </div>
        </div>
      </div>
    </>
  )


}
export default IncomingVideoCall