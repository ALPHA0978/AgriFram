import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, onChange, options, placeholder, className = "", onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    onToggle?.(false);
  };

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-3 bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500 transition-all duration-200 flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg"
      >
        <span className={selectedOption ? 'text-white' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-2 bg-[#0f172a]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-2xl glow-emerald max-h-60 overflow-y-auto scrollbar-hide py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full px-4 py-3 text-left text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-300 transition-all duration-200 text-xs sm:text-sm font-bold flex items-center justify-between"
            >
              <span>{option.label}</span>
              {option.value === value && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;