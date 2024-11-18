import PropTypes from "prop-types";
export const Input = ({ placeholder, className ,onChange}) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={className}
            onChange={onChange}
        />
    );
};


// Prop validation
Input.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    placeholder:PropTypes.string,
    onChange:PropTypes.func
  };
  
  Input.defaultProps = {
    className: "",
  };
  