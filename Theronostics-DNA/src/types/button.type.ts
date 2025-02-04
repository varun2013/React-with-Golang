export type ButtonProps = {
    type: "submit" | "button";
    className: string;
    text: string;
    icon?: JSX.Element;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  