import Switch from 'react-switch';

const CustomSwitch = ({ ...props }) => {
  return (
    <Switch
      offColor="#2e3843"
      offHandleColor="#20aca8"
      onColor="#20aca8"
      onHandleColor="#ffffff"
      uncheckedIcon={false}
      checkedIcon={false}
      height={16}
      width={38}
      handleDiameter={14}
      checked={props.checked}
      onChange={props.onChange}
    />
  );
};

export default CustomSwitch;
