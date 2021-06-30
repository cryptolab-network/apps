import Switch from 'react-switch';

const CustomSwitch = ({ ...props }) => {
  return (
    <Switch
      offColor={props.offColor ? props.offColor : '#2e3843'}
      offHandleColor={props.offHandleColor ? props.offHandleColor : '#20aca8'}
      onColor={props.onColor ? props.onColor : '#20aca8'}
      onHandleColor={props.onHandleColor ? props.onHandleColor : '#ffffff'}
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
