import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function CustomDropdown({ value, onChange, options, label }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex h-11 w-full items-center justify-between rounded-xl border-0 bg-[#FFFAFA] px-4 py-2 text-sm shadow-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.color ? (
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[80px] ${selectedOption.color}`}>
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-secondary">{selectedOption?.label || value}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-secondary/50" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#FFFAFA] border border-secondary/10 rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((opt: any) => (
            <div 
              key={opt.value}
              className="px-4 py-2 hover:bg-secondary/5 cursor-pointer flex items-center"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.color ? (
                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold text-[#424790] min-w-[80px] ${opt.color}`}>
                  {opt.label}
                </span>
              ) : (
                <span className="text-sm text-secondary">{opt.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
