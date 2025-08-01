import * as React from 'react';
import Modal from '@mui/material/Modal';
import SwitchButton from './SwitchButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAviator } from '../store/aviator';
const AutoCashItem = ({ msg, index, stops, setStops }: { msg: string, index: number, stops: string[], setStops: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const [enabled, setEnabled] = React.useState(false)
    return (
        <div className='flex justify-between gap-2 items-center w-full'>
            <div className='flex gap-2 items-center'>
                <SwitchButton disabled={false} checked={enabled} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    setStops(prev => {
                        const new_val = [...prev]
                        new_val[index] = checked ? "10.00" : "0.00"
                        return new_val
                    })
                    setEnabled(v => !v)
                }} />
                <span>{msg}</span>
            </div>
            <div className={`flex gap-1 ${enabled ? "text-white" : "text-[#737373]"}`}>
                <div className={`flex justify-between items-center text-[20px] w-full h-[27px] bg-black rounded-full px-1 border ${enabled ? "border-white" : "border-[#3E3E3E]"}`} style={{ fontFamily: 'Roboto' }}>
                    <button onClick={() =>
                        setStops(prev => {
                            const new_val = [...prev]
                            new_val[index] = Math.max(10, parseFloat(new_val[index]) - 10).toFixed(2)
                            return new_val
                        })
                    } className={`flex justify-center items-center w-[20px] h-[20px] ${enabled ? "border-white text-white" : "border-[#3E3E3E] text-[#3E3E3E]"} rounded-full border-2`}>-</button>
                    <input
                        disabled={!enabled}
                        value={stops[index]}
                        onChange={(e) => {
                            const val = e.target.value.trim()
                            // if (val && !/^\d+(\.\d*)?$/.test(val)) return
                            setStops(prev => {
                                const new_val = [...prev]
                                new_val[index] = val
                                return new_val
                            })
                        }}
                        onKeyDown={(e) => {
                            const val = e.key
                            if (/^[^0-9.]$/.test(val)) e.preventDefault()
                        }}
                        onBlur={(e) => {
                            const val = e.target.value.trim()
                            setStops(prev => {
                                const new_val = [...prev]
                                new_val[index] = isNaN(parseFloat(val)) ? "0.00" : parseFloat(val).toFixed(2)
                                return new_val
                            })
                        }}
                        className={`w-[70px] outline-none bg-black text-center text-[15px] ${enabled ? "text-white" : "text-[#737373]"}`} />
                    <button onClick={() =>
                        setStops(prev => {
                            const new_val = [...prev]
                            new_val[index] = (parseFloat(new_val[index]) + 10).toFixed(2)
                            return new_val
                        })
                    } className={`flex justify-center items-center w-[20px] h-[20px] rounded-full border-2 ${enabled ? "border-white text-white" : "border-[#3E3E3E] text-[#3E3E3E]"}`}>+</button>
                </div>
                <span> </span>
            </div>
        </div >
    )
}
// export default function AutoBetModal({ modalOpen, modalSetOpen, autoPlayingIndex }: { modalOpen: boolean, modalSetOpen: React.Dispatch<React.SetStateAction<boolean>>, autoPlayingIndex: number }) {

//     const handleClose = () => modalSetOpen(false);
//     const { setAviatorState } = useAviator()
//     const [nOfRounds, setNOfRounds] = React.useState(-1)
//     const [stops, setStops] = React.useState(["0.00", "0.00", "0.00"])
//     React.useEffect(() => {
//         if (modalOpen) {
//             setStops(["0.00", "0.00", "0.00"])
//             setNOfRounds(-1)
//         }
//     }, [modalOpen])
//     return (
//         <div>
//             <Modal
//                 open={modalOpen}
//                 onClose={handleClose}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//                 className='overflow-y-auto'
//             >
//                 <div className='mx-auto max-w-[600px] text-white mt-10 p-2 overflow-y-auto'>
//                     <div className='border border-[#7C4F00] rounded-[8px] overflow-hidden bg-black/90'>
//                         <div className='h-8 bg-[#E59407] text-black text-[16px] font-bold items-center px-4 flex justify-between'>
//                             <span>Autoplay Options</span>
//                             <button onClick={handleClose} className='cursor-pointer'><CloseIcon /></button>
//                         </div>
//                         <div className='flex flex-col gap-8 w-full p-6'>
//                             <div className='flex flex-col justify-center items-center rounded-[4px] gap-4 p-4 border border-[#2A2B2E]'>
//                                 <span>Number of Rounds</span>
//                                 <div className='flex justify-center gap-5 items-center flex-wrap'>
//                                     {[10, 50, 100, 500, 1000, 5000].map((item, i) =>
//                                         <button key={i} onClick={() => setNOfRounds(item)} className={`rounded-full w-12 px-1 ${item === nOfRounds ? "bg-[#444] border border-white" : "bg-[#222]"}`}>
//                                             {item}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                             <AutoCashItem msg="Stop if cash decreases by" index={0} stops={stops} setStops={setStops} />
//                             <AutoCashItem msg="Stop if cash increases by" index={1} stops={stops} setStops={setStops} />
//                             {/* <AutoCashItem msg="Stop if single win exceeds" index={2} autoPlayingIndex={autoPlayingIndex} /> */}
//                         </div>
//                         <div className='flex justify-center items-center gap-8 pb-8'>
//                             <button
//                                 onClick={() => {
//                                     setAviatorState(prev => {
//                                         const new_state = { ...prev }
//                                         new_state.autoPlayParams[autoPlayingIndex].stopIfarr = stops.map(item => parseFloat(item))
//                                         new_state.RemainedAutoPlayCount[autoPlayingIndex] = nOfRounds
//                                         return new_state
//                                     })
//                                     handleClose()
//                                 }}
//                                 disabled={nOfRounds < 0 || stops.every((value) => (parseFloat(value) === 0))}
//                                 className={`w-[70px] h-[26px] rounded-full flex justify-center items-center text-[14px] bg-gradient-to-b from-[#E59407] to-[#412900] uppercase font-bold disabled:opacity-50`}>
//                                 <span className='drop-shadow-md shadow-black'>Start</span>
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setNOfRounds(-1)
//                                     setStops(["0.00", "0.00", "0.00"])
//                                 }}
//                                 className='w-[70px] h-[26px] rounded-full flex justify-center items-center text-[14px] bg-gradient-to-b from-[#E50707] to-[#412900] uppercase font-bold '>
//                                 <span className='drop-shadow-md shadow-black'>Reset</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// }


export default function AutoBetModal({
  modalOpen,
  modalSetOpen,
  autoPlayingIndex,
}: {
  modalOpen: boolean;
  modalSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  autoPlayingIndex: number;
}) {
  const handleClose = () => modalSetOpen(false);
  const { setAviatorState } = useAviator();
  const [nOfRounds, setNOfRounds] = React.useState(-1);
  const [stops, setStops] = React.useState(["0.00", "0.00", "0.00"]);

  React.useEffect(() => {
    if (modalOpen) {
      setStops(["0.00", "0.00", "0.00"]);
      setNOfRounds(-1);
    }
  }, [modalOpen]);

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <div className="flex justify-center items-start pt-10 h-full overflow-y-auto">
        <div className="w-full max-w-[500px] rounded-lg bg-[#131313] text-white shadow-lg border border-[#444]">
          {/* Header */}
          <div className="bg-[#E59407] text-black text-lg font-semibold rounded-t-lg px-5 py-2 flex justify-between items-center">
            <span>Auto play options</span>
            <button onClick={handleClose}>
              <CloseIcon className="text-black" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-6">
            {/* Number of Rounds */}
            <div className="bg-[#1a1a1a] p-4 rounded-md flex flex-col items-center gap-4">
              <span className="text-[15px] font-medium text-white">
                Number of Rounds:
              </span>
              <div className="flex flex-wrap gap-3 justify-center">
                {[10, 20, 50, 100].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setNOfRounds(item)}
                    className={`w-14 h-10 rounded-full text-sm font-semibold ${
                      item === nOfRounds
                        ? "bg-[#444] border border-white"
                        : "bg-[#1F1F1F]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Conditions */}
            <AutoCashItem
              msg="Stop if cash decreases by"
              index={0}
              stops={stops}
              setStops={setStops}
            />
            <AutoCashItem
              msg="Stop if cash increases by"
              index={1}
              stops={stops}
              setStops={setStops}
            />
            <AutoCashItem
              msg="Stop if single win exceeds"
              index={2}
              stops={stops}
              setStops={setStops}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 pb-6 gap-4">
            <button
              onClick={() => {
                setNOfRounds(-1);
                setStops(["0.00", "0.00", "0.00"]);
              }}
              className="w-[100px] h-10 rounded-full bg-gradient-to-b from-[#E50707] to-[#412900] text-white font-bold"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setAviatorState((prev) => {
                  const newState = { ...prev };
                  newState.autoPlayParams[autoPlayingIndex].stopIfarr =
                    stops.map((s) => parseFloat(s));
                  newState.RemainedAutoPlayCount[autoPlayingIndex] = nOfRounds;
                  return newState;
                });
                handleClose();
              }}
              disabled={
                nOfRounds < 0 || stops.every((val) => parseFloat(val) === 0)
              }
              className="w-[100px] h-10 rounded-full bg-gradient-to-b from-[#0CE50C] to-[#015C01] text-white font-bold disabled:opacity-50"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}