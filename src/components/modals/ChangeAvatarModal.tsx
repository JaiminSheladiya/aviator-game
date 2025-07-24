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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-[#1b1c1d] text-white w-[95%] max-w-[600px] rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2c2d30] px-5 py-4 flex justify-between items-center border-b border-[#414345]">
          <h2 className="text-white text-sm font-semibold">CHANGE AVATAR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4 overflow-y-auto">
          {avatarImages.map((avatar) => (
            <div
              key={avatar.id}
              className={`w-14 h-14 rounded-full p-0.5 border-2 cursor-pointer transition-all
            ${
              selectedId === avatar.id
                ? "border-green-400"
                : "border-transparent hover:border-gray-400"
            }`}
              onClick={() => {
                onSelect(avatar.id);
                onClose();
              }}
            >
              <img
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
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
