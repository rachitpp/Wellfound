"use client";

import React, { useState, useEffect, useRef } from "react";

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  helper?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  error,
  helper,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-display tracking-wide">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`bg-white dark:bg-gray-800 border-2 rounded-xl px-4 py-3 flex flex-wrap gap-2 min-h-[48px] cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-md ${
            error
              ? "border-red-500 dark:border-red-500 focus-within:ring-red-500/20"
              : "border-gray-200 dark:border-gray-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/20 dark:focus-within:ring-primary-400/30"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500 py-0.5">
              Select options...
            </span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option}
                className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center shadow-sm transition-all duration-300 hover:bg-primary-200 dark:hover:bg-primary-800/40"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
              >
                {option}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 ml-1.5 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            ))
          )}
        </div>
        {isOpen && (
          <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-fade-in">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400 shadow-sm transition-all duration-300"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul className="py-1">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out ${
                      selectedOptions.includes(option)
                        ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 font-medium"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option);
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 dark:text-primary-400 rounded border-gray-300 dark:border-gray-600"
                        checked={selectedOptions.includes(option)}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="ml-2">{option}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg inline-block font-medium">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg inline-block">
          {helper}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
