import React from "react";
import { X } from "lucide-react";

const avatarCount = 72;
const avatarImages = Array.from({ length: avatarCount }, (_, i) => ({
  id: i + 1,
  src: `/avatars/av-${i + 1}.png`,
}));

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number;
  onSelect: (id: number) => void;
}

const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start sm:p-[1.75rem] p-[.5rem]">
      <div className="bg-[#1b1c1d] text-white w-full max-w-[500px] rounded-xl shadow-lg max-h-full flex flex-col">
        {/* Header */}
        <div className="bg-[#2c2d30] px-5 py-4 flex justify-between items-center border-b border-[#414345]">
          <h2 className="text-white text-sm font-semibold">CHANGE AVATAR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-4 flex flex-wrap justify-center gap-2 overflow-y-auto">
          {avatarImages.map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.src}
              alt={`Avatar ${avatar.id}`}
              className={`w-[56px] h-[56px] border-4 object-cover rounded-full ${
                selectedId === avatar.id ? "border-[#428a12]" : "border-[#333]"
              }`}
              onClick={() => {
                onSelect(avatar.id);
                onClose();
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#2c2d30] px-4 py-3 flex justify-center border-t border-[#414345]">
          <button
            onClick={onClose}
            className="bg-transparent border border-gray-500 text-sm text-white px-6 py-1.5 rounded-md hover:bg-[#3a3b3e] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatarModal;
