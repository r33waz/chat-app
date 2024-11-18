import PropTypes from "prop-types";
export const Card = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// Prop validation
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: "",
};
