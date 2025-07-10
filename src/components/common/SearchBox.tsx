import React from 'react';
import './SearchBox.css';

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`search-box ${className}`}>
      <span className="material-symbols-outlined search-box__icon">search</span>
      <input
        type="text"
        className="search-box__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBox; 