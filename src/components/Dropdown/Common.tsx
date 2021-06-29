import styled from 'styled-components';
import Select, { components } from 'react-select';
import { ReactComponent as DropDownIcon } from '../../assets/images/dropdown.svg';

const DropdownIndicator = (props) => {
  const { getStyles } = props;
  return (
    <components.DropdownIndicator {...props}>
      <DropDownIcon style={getStyles('dropdownIndicator', props)} stroke="black" />
    </components.DropdownIndicator>
  );
};

const DropdownCommon = ({ options, ...props }) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : state.isFocused ? 'white' : 'black',
      background: state.isSelected ? '#23beb9' : state.isFocused ? '#23beb9' : 'transparent',
      padding: 5,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: '100%',
      display: 'flex',
      paddingBottom: 11,
      borderBottom: props.theme && props.theme === 'dark' ? 'solid 1px #525a63' : 'solid 1px #d7d8d9',
    }),
    indicatorSeparator: () => ({
      width: 0,
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: 0,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      fontFamily: 'Montserrat',
      fontSize: 13,
      fontWeight: 500,
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: 1.23,
      textAlign: 'left',
      color: props.theme && props.theme === 'dark' ? 'white' : '#17222d',
    }),
    dropdownIndicator: (provided, state) => ({
      display: 'flex',
      width: '100%',
      transform: state.isFocused ? 'rotate(45deg)' : 'none',
      transitionDuration: '0.2s',
      stroke: props.theme && props.theme === 'dark' ? 'white' : 'black',
    }),
  };

  return (
    <DropdownLayout width={props.style.width} backgroundColor={props.style.backgroundColor}>
      <Select
        options={options}
        isSearchable={false}
        styles={customStyles}
        components={{ DropdownIndicator }}
        value={props.value ? props.value : options[0]}
        onChange={props.onChange}
      />
    </DropdownLayout>
  );
};

export default DropdownCommon;

type DropdownLayoutProps = {
  width: string;
  backgroundColor: string;
};
const DropdownLayout = styled.div<DropdownLayoutProps>`
  width: ${(props) => (props.width ? props.width : '90%')};
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : 'transparent')};
`;
