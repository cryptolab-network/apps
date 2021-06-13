import styled from 'styled-components';
import Select, { components } from 'react-select';
import { ReactComponent as DropDownIcon } from '../../assets/images/dropdown.svg';

const DropdownIndicator = (props) => {
  const { getStyles } = props;
  return (
    <components.DropdownIndicator {...props}>
      <DropDownIcon style={getStyles('dropdownIndicator', props)} />
    </components.DropdownIndicator>
  );
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'white' : 'black',
    background: state.isSelected ? 'blue' : state.isFocused ? 'red' : 'transparent',
    padding: 5,
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: '100%',
    display: 'flex',
    borderBottom: 'solid 1px #d7d8d9',
  }),
  indicatorSeparator: () => ({
    width: 0,
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
    color: '#17222d',
  }),
  dropdownIndicator: (provided, state) => ({
    transform: state.isFocused ? 'rotate(45deg)' : 'none',
  }),
};

const DropdownCommon = ({ options, ...props }) => {
  return (
    <DropdownLayout width={props.width}>
      <Select options={options} styles={customStyles} components={{ DropdownIndicator }} value={options[0]} />
    </DropdownLayout>
  );
};

export default DropdownCommon;

type DropdownLayoutProps = {
  width: string;
};
const DropdownLayout = styled.div<DropdownLayoutProps>`
  width: ${(props) => (props.width ? props.width : '90%')};
`;
