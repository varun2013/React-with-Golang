export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface CommonDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string | number ;
  onSelect: (value: string | number ) => void;
}
